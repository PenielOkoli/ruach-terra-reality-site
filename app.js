(function(){
    var storeKey = 'rt-business-desk-v1';
    var accessKey = 'rt-owner-access-code-v1';
    var defaultAccessCode = 'RT-OWNER';
    var db = readStore();
    var $ = function(selector, root){ return (root || document).querySelector(selector); };
    var $$ = function(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector)); };
    var money = new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits:0 });

    function seed(){ return { inventory:[], sales:[], settings:{ endpoint:'' } }; }
    function readStore(){ try { return Object.assign(seed(), JSON.parse(localStorage.getItem(storeKey)) || {}); } catch(e) { return seed(); } }
    function saveStore(){ localStorage.setItem(storeKey, JSON.stringify(db)); }
    function today(){ return new Date().toISOString().slice(0,10); }
    function makeId(prefix){ return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
    function invoiceNumber(){ return 'RT-' + new Date().getFullYear() + '-' + String(db.sales.length + 1).padStart(4,'0'); }
    function number(value){ return Number(value) || 0; }
    function escapeHtml(value){ return String(value == null ? '' : value).replace(/[&<>'"]/g, function(char){ return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]; }); }
    function formatDate(value){ if(!value) return ''; var d = new Date(value + 'T12:00:00'); return d.toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }); }
    function setMessage(id, message, isError){ var node = $(id); if(!node) return; node.textContent = message || ''; node.classList.toggle('error', !!isError); }
    function currentAccessCode(){ return localStorage.getItem(accessKey) || defaultAccessCode; }

    function showTab(tab){
      $$('.admin-tab-btn').forEach(function(button){ button.classList.toggle('active', button.dataset.adminTab === tab); });
      $$('[data-admin-panel]').forEach(function(panel){ panel.hidden = panel.dataset.adminPanel !== tab; });
    }
    function openPortal(){ $('#ownerGate').hidden = true; $('#adminPortal').hidden = false; $('#adminDate').textContent = new Date().toLocaleDateString('en-NG', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); renderAll(); }
    function lineMarkup(item){
      var options = '<option value="">Select item</option>' + db.inventory.map(function(product){ return '<option value="' + product.id + '"' + (item && item.productId === product.id ? ' selected' : '') + '>' + escapeHtml(product.name) + ' (' + product.quantity + ' in stock)</option>'; }).join('');
      return '<div class="sale-line"><label>Product<select class="sale-product" required>' + options + '</select></label><label>Quantity<input class="sale-quantity" required type="number" min="1" step="1" value="' + (item ? item.quantity : 1) + '"></label><label>Line total<div class="sale-line-total">â‚¦0</div></label><button class="row-action remove-sale-line" type="button">Remove</button></div>';
    }
    function addSaleLine(item){ $('#saleLines').insertAdjacentHTML('beforeend', lineMarkup(item)); updateSaleTotals(); }
    function updateSaleTotals(){
      var total = 0;
      $$('.sale-line').forEach(function(line){
        var product = db.inventory.find(function(product){ return product.id === $('.sale-product', line).value; });
        var amount = product ? number($('.sale-quantity', line).value) * number(product.price) : 0;
        $('.sale-line-total', line).textContent = money.format(amount);
        total += amount;
      });
      $('#saleGrandTotal').textContent = 'Total: ' + money.format(total);
      return total;
    }
    function renderInventory(){
      $('#inventoryBody').innerHTML = db.inventory.length ? db.inventory.map(function(item){
        var low = item.quantity <= item.reorderAt;
        return '<tr><td><strong>' + escapeHtml(item.name) + '</strong></td><td>' + escapeHtml(item.sku || 'â€”') + '</td><td><span class="stock-pill ' + (low ? 'low' : '') + '">' + item.quantity + ' units' + (low ? ' Â· reorder' : '') + '</span></td><td>' + (item.cost ? money.format(item.cost) : 'â€”') + '</td><td>' + money.format(item.price) + '</td><td><button class="row-action" type="button" data-restock="' + item.id + '">Restock</button></td></tr>';
      }).join('') : '<tr><td colspan="6" class="admin-muted">No inventory yet. Add your first product above.</td></tr>';
    }
    function renderSales(){
      var recent = db.sales.slice().reverse().slice(0,6);
      var body = recent.length ? recent.map(function(sale){ return '<tr><td><strong>' + escapeHtml(sale.invoice) + '</strong></td><td>' + escapeHtml(sale.customer) + '</td><td>' + formatDate(sale.date) + '</td><td>' + money.format(sale.total) + '</td><td><button class="row-action" type="button" data-invoice="' + sale.id + '">View</button></td></tr>'; }).join('') : '<tr><td colspan="5" class="admin-muted">No sales recorded yet.</td></tr>';
      $('#recentSalesBody').innerHTML = body;
      $('#invoiceBody').innerHTML = db.sales.length ? db.sales.slice().reverse().map(function(sale){ return '<tr><td><strong>' + escapeHtml(sale.invoice) + '</strong></td><td>' + escapeHtml(sale.customer) + '</td><td>' + formatDate(sale.date) + '</td><td>' + escapeHtml(sale.payment) + '</td><td>' + money.format(sale.total) + '</td><td><button class="row-action" type="button" data-invoice="' + sale.id + '">Print / view</button></td></tr>'; }).join('') : '<tr><td colspan="6" class="admin-muted">Invoices will appear here after you save a sale.</td></tr>';
    }
    function renderOverview(){
      var now = new Date(); var month = now.getMonth(); var year = now.getFullYear(); var todaySales = db.sales.filter(function(sale){ return sale.date === today(); }); var monthSales = db.sales.filter(function(sale){ var d = new Date(sale.date + 'T12:00:00'); return d.getMonth() === month && d.getFullYear() === year; });
      var total = function(sales){ return sales.reduce(function(sum, sale){ return sum + number(sale.total); }, 0); };
      var units = db.inventory.reduce(function(sum,item){ return sum + number(item.quantity); },0); var low = db.inventory.filter(function(item){ return item.quantity <= item.reorderAt; });
      $('#metricToday').textContent = money.format(total(todaySales)); $('#metricTodayHint').textContent = todaySales.length + (todaySales.length === 1 ? ' transaction today' : ' transactions today');
      $('#metricMonth').textContent = money.format(total(monthSales)); $('#metricMonthHint').textContent = monthSales.length + (monthSales.length === 1 ? ' transaction this month' : ' transactions this month');
      $('#metricItems').textContent = db.inventory.length; $('#metricItemsHint').textContent = units + ' units in stock'; $('#metricLow').textContent = low.length;
      $('#lowStockList').innerHTML = low.length ? low.map(function(item){ return '<p style="margin:0 0 10px"><strong>' + escapeHtml(item.name) + '</strong><br><span class="stock-pill low">' + item.quantity + ' left Â· reorder at ' + item.reorderAt + '</span></p>'; }).join('') : 'No items need reordering.';
    }
    function renderConnection(){
      var connected = !!db.settings.endpoint; $('#sheetStatus').textContent = connected ? 'Connected to Google Sheets. Use â€œSync sheetâ€ to update the workbook.' : 'Not connected yet. You can still download CSV backups.';
      $('#sheetSettingsForm').elements.endpoint.value = db.settings.endpoint || '';
    }
    function refreshSaleLines(){ var previous = $$('.sale-line').map(function(line){ return { productId:$('.sale-product', line).value, quantity:number($('.sale-quantity', line).value) || 1 }; }); $('#saleLines').innerHTML = ''; (previous.length ? previous : [null]).forEach(function(line){ addSaleLine(line); }); }
    function renderAll(){ renderOverview(); renderInventory(); renderSales(); renderConnection(); refreshSaleLines(); }
    function showInvoice(id){
      var sale = db.sales.find(function(record){ return record.id === id; }); if(!sale) return;
      var rows = sale.items.map(function(item){ return '<tr><td>' + escapeHtml(item.name) + '</td><td style="text-align:center">' + item.quantity + '</td><td style="text-align:right">' + money.format(item.price) + '</td><td style="text-align:right"><strong>' + money.format(item.total) + '</strong></td></tr>'; }).join('');
      $('#invoicePaper').innerHTML = '<div class="invoice-header"><div class="invoice-logo">Ruach &amp; Terra<span>Reality Ltd.</span></div><div><div class="invoice-title">Invoice</div><div class="invoice-meta"><strong>' + escapeHtml(sale.invoice) + '</strong><br>Issued ' + formatDate(sale.date) + '</div></div></div><div class="invoice-party"><div><span class="label">Bill to</span><strong>' + escapeHtml(sale.customer) + '</strong><br>' + escapeHtml(sale.phone || 'â€”') + '</div><div><span class="label">Business</span>10A Covel Plaza, opp. Beechwood Estate<br>Malete, Lagos<br>0703 069 5474</div></div><table class="invoice-table"><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit price</th><th style="text-align:right">Amount</th></tr></thead><tbody>' + rows + '</tbody></table><div class="invoice-total"><div><span>Total</span><span>' + money.format(sale.total) + '</span></div></div><div class="invoice-note">Payment method: ' + escapeHtml(sale.payment) + '<br>Thank you for choosing Ruach &amp; Terra Reality Ltd.</div>';
      $('#invoiceSheet').hidden = false;
    }
    function csvDownload(filename, rows){
      var quote = function(value){ return '"' + String(value == null ? '' : value).replace(/"/g,'""') + '"'; };
      var csv = rows.map(function(row){ return row.map(quote).join(','); }).join('\r\n'); var blob = new Blob([csv], {type:'text/csv;charset=utf-8'}); var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href);
    }
    function syncSheet(){
      if(!db.settings.endpoint){ showTab('settings'); setMessage('#settingsMessage','Add your Apps Script web app URL before syncing.',true); return; }
      setMessage('#settingsMessage','Sending current inventory and sales to the connected sheetâ€¦');
      fetch(db.settings.endpoint, { method:'POST', mode:'no-cors', body:JSON.stringify({ inventory:db.inventory, sales:db.sales, syncedAt:new Date().toISOString() }) }).then(function(){ setMessage('#settingsMessage','Sync request sent to Google Sheets.'); }).catch(function(){ setMessage('#settingsMessage','Could not reach the sheet connection. Check the deployed URL.',true); });
    }

    $('#openOwnerPortal').addEventListener('click', function(){ $('#ownerGate').hidden = false; $('#ownerAccessCode').focus(); });
    $('#closeOwnerGate').addEventListener('click', function(){ $('#ownerGate').hidden = true; });
    $('#ownerLoginForm').addEventListener('submit', function(event){ event.preventDefault(); if($('#ownerAccessCode').value === currentAccessCode()){ $('#ownerAccessCode').value = ''; setMessage('#ownerLoginMessage',''); openPortal(); } else { setMessage('#ownerLoginMessage','That access code is not correct.',true); } });
    $('#closeAdminPortal').addEventListener('click', function(){ $('#adminPortal').hidden = true; });
    $('#adminSyncButton').addEventListener('click', syncSheet);
    $$('.admin-tab-btn').forEach(function(button){ button.addEventListener('click', function(){ showTab(button.dataset.adminTab); }); });
    $$('[data-go-tab]').forEach(function(button){ button.addEventListener('click', function(){ showTab(button.dataset.goTab); }); });
    $('#addSaleLine').addEventListener('click', function(){ addSaleLine(); });
    $('#saleLines').addEventListener('input', updateSaleTotals); $('#saleLines').addEventListener('change', updateSaleTotals);
    $('#saleLines').addEventListener('click', function(event){ if(event.target.classList.contains('remove-sale-line')){ var lines = $$('.sale-line'); if(lines.length > 1) event.target.closest('.sale-line').remove(); updateSaleTotals(); } });
    $('#saleForm').elements.date.value = today();
    $('#saleForm').addEventListener('submit', function(event){
      event.preventDefault(); var form = event.currentTarget; var selected = []; var invalid = '';
      $$('.sale-line').forEach(function(line){ var product = db.inventory.find(function(item){ return item.id === $('.sale-product', line).value; }); var qty = number($('.sale-quantity', line).value); if(!product) invalid = 'Select a product for every line item.'; else if(qty < 1 || qty > product.quantity) invalid = 'Check stock levels â€” ' + product.name + ' has only ' + product.quantity + ' units available.'; else selected.push({ productId:product.id, name:product.name, quantity:qty, price:number(product.price), total:qty * number(product.price) }); });
      if(invalid || !selected.length){ setMessage('#saleMessage',invalid || 'Add at least one item to the sale.',true); return; }
      selected.forEach(function(line){ db.inventory.find(function(item){ return item.id === line.productId; }).quantity -= line.quantity; });
      var data = new FormData(form); var sale = { id:makeId('sale'), invoice:invoiceNumber(), customer:data.get('customer'), phone:data.get('phone'), payment:data.get('payment'), date:data.get('date'), items:selected, total:selected.reduce(function(sum,line){ return sum + line.total; },0), createdAt:new Date().toISOString() }; db.sales.push(sale); saveStore(); form.reset(); form.elements.date.value = today(); $('#saleLines').innerHTML = ''; addSaleLine(); renderAll(); setMessage('#saleMessage','Sale saved and inventory updated. Invoice ' + sale.invoice + ' is ready.'); showInvoice(sale.id);
    });
    $('#inventoryForm').addEventListener('submit', function(event){ event.preventDefault(); var data = new FormData(event.currentTarget); db.inventory.push({ id:makeId('item'), name:data.get('name').trim(), sku:data.get('sku').trim(), quantity:number(data.get('quantity')), reorderAt:number(data.get('reorderAt')), cost:number(data.get('cost')), price:number(data.get('price')) }); saveStore(); event.currentTarget.reset(); event.currentTarget.elements.reorderAt.value = 10; renderAll(); setMessage('#inventoryMessage','Inventory item saved.'); });
    $('#inventoryBody').addEventListener('click', function(event){ if(!event.target.dataset.restock) return; var item = db.inventory.find(function(record){ return record.id === event.target.dataset.restock; }); var amount = Number(window.prompt('How many units of ' + item.name + ' are you adding?', '0')); if(Number.isFinite(amount) && amount > 0){ item.quantity += amount; saveStore(); renderAll(); } });
    document.addEventListener('click', function(event){ if(!event.target.dataset.invoice) return; showInvoice(event.target.dataset.invoice); });
    $('#closeInvoice').addEventListener('click', function(){ $('#invoiceSheet').hidden = true; }); $('#printInvoice').addEventListener('click', function(){ window.print(); });
    $('#sheetSettingsForm').addEventListener('submit', function(event){ event.preventDefault(); db.settings.endpoint = new FormData(event.currentTarget).get('endpoint').trim(); saveStore(); renderConnection(); setMessage('#settingsMessage', db.settings.endpoint ? 'Sheet connection saved.' : 'Enter a valid deployed Apps Script URL.', !db.settings.endpoint); });
    $('#disconnectSheet').addEventListener('click', function(){ db.settings.endpoint = ''; saveStore(); renderConnection(); setMessage('#settingsMessage','Sheet connection removed.'); });
    $('#accessCodeForm').addEventListener('submit', function(event){ event.preventDefault(); var code = new FormData(event.currentTarget).get('accessCode'); localStorage.setItem(accessKey,code); event.currentTarget.reset(); setMessage('#accessMessage','Owner access code updated.'); });
    $('#exportInventory').addEventListener('click', function(){ csvDownload('ruach-terra-inventory.csv', [['Name','SKU','Quantity','Reorder At','Cost','Selling Price']].concat(db.inventory.map(function(item){ return [item.name,item.sku,item.quantity,item.reorderAt,item.cost,item.price]; }))); });
    $('#exportSales').addEventListener('click', function(){ csvDownload('ruach-terra-sales.csv', [['Invoice','Date','Customer','Phone','Payment','Items','Total']].concat(db.sales.map(function(sale){ return [sale.invoice,sale.date,sale.customer,sale.phone,sale.payment,sale.items.map(function(item){ return item.name + ' x' + item.quantity; }).join('; '),sale.total]; }))); });
  })();

  // Play each video only while it's actually visible on screen, like a
  // background clip â€” no tap-to-play, no controls, just autoplay in view.
  (function(){
    var videos = document.querySelectorAll('.autoplay-video');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var v = entry.target;
        if (entry.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function(){});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.5 });

    videos.forEach(function(v){ observer.observe(v); });
  })();
