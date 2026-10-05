param(
  [string]$Source = 'C:\Users\DELL\Downloads\RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx',
  [string]$Destination = 'C:\Dev\ruach-terra-reality-site\artifacts\profile-review'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$reviewRoot = [System.IO.Path]::GetFullPath($Destination)
$imageRoot = Join-Path $reviewRoot 'originals'
New-Item -ItemType Directory -Path $imageRoot -Force | Out-Null
$archive = [System.IO.Compression.ZipFile]::OpenRead($Source)

function Read-Entry([string]$Name) {
  $entry = $archive.GetEntry($Name)
  if (-not $entry) { return $null }
  $reader = [System.IO.StreamReader]::new($entry.Open())
  try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Get-Namespaces($Document) {
  $manager = [System.Xml.XmlNamespaceManager]::new($Document.NameTable)
  $manager.AddNamespace('p', 'http://schemas.openxmlformats.org/presentationml/2006/main')
  $manager.AddNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main')
  $manager.AddNamespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
  return ,$manager
}

try {
  $media = @()
  foreach ($entry in $archive.Entries | Where-Object { $_.FullName -like 'ppt/media/*' -and $_.Name }) {
    $target = Join-Path $imageRoot $entry.Name
    if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite extracted original: $target" }
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $target)
    $media += @{ name = $entry.Name; bytes = $entry.Length }
  }
  [xml]$presentation = Read-Entry 'ppt/presentation.xml'
  $presentationNs = Get-Namespaces $presentation
  [xml]$presentationRels = Read-Entry 'ppt/_rels/presentation.xml.rels'
  $slideTargets = @{}
  foreach ($relationship in $presentationRels.DocumentElement.ChildNodes) { $slideTargets[$relationship.Id] = $relationship.Target }
  $slides = @()
  $slideNumber = 0
  foreach ($slideId in $presentation.SelectNodes('//p:sldId', $presentationNs)) {
    $slideNumber++
    $relationshipId = $slideId.GetAttribute('id', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
    $slidePath = 'ppt/' + $slideTargets[$relationshipId].TrimStart('/')
    [xml]$slide = Read-Entry $slidePath
    $namespaces = Get-Namespaces $slide
    $slideFilename = [System.IO.Path]::GetFileName($slidePath)
    [xml]$rels = Read-Entry ('ppt/slides/_rels/' + $slideFilename + '.rels')
    $relationships = @{}
    foreach ($relationship in $rels.DocumentElement.ChildNodes) { $relationships[$relationship.Id] = $relationship.Target }
    $shapes = @()
    foreach ($shape in $slide.SelectNodes('//p:sp | //p:pic | //p:graphicFrame', $namespaces)) {
      $paragraphs = @()
      foreach ($paragraph in $shape.SelectNodes('.//a:p', $namespaces)) {
        $paragraphs += (($paragraph.SelectNodes('.//a:t', $namespaces) | ForEach-Object { $_.InnerText }) -join '')
      }
      $offset = $shape.SelectSingleNode('.//a:xfrm/a:off | ./p:xfrm/a:off', $namespaces)
      $extent = $shape.SelectSingleNode('.//a:xfrm/a:ext | ./p:xfrm/a:ext', $namespaces)
      $blip = $shape.SelectSingleNode('.//a:blip', $namespaces)
      $properties = $shape.SelectSingleNode('.//p:cNvPr', $namespaces)
      $crop = $shape.SelectSingleNode('.//a:srcRect', $namespaces)
      $image = $null
      if ($blip) {
        $imageId = $blip.GetAttribute('embed', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        $image = [System.IO.Path]::GetFileName($relationships[$imageId])
      }
      $shapes += @{
        type = $shape.LocalName; name = $properties.name; description = $properties.descr
        text = ($paragraphs -join "`n"); image = $image
        x = if ($offset) { [long]$offset.x } else { 0 }; y = if ($offset) { [long]$offset.y } else { 0 }
        width = if ($extent) { [long]$extent.cx } else { 0 }; height = if ($extent) { [long]$extent.cy } else { 0 }
        crop = if ($crop) { $crop.OuterXml } else { $null }
      }
    }
    $notesPath = 'ppt/notesSlides/' + [System.IO.Path]::GetFileName(($relationships.Values | Where-Object { $_ -like '*notesSlides/*' } | Select-Object -First 1))
    $notesText = ''
    $notesXml = Read-Entry $notesPath
    if ($notesXml) {
      [xml]$notes = $notesXml
      $notesNs = Get-Namespaces $notes
      $notesText = ($notes.SelectNodes('//a:t', $notesNs) | ForEach-Object { $_.InnerText }) -join "`n"
    }
    $slides += @{ number = $slideNumber; path = $slidePath; shapes = $shapes; notes = $notesText }
  }
  $size = $presentation.SelectSingleNode('//p:sldSz', $presentationNs)
  $result = @{ source = $Source; width = [long]$size.cx; height = [long]$size.cy; media = $media; slides = $slides }
  $json = $result | ConvertTo-Json -Depth 15
  [System.IO.File]::WriteAllText((Join-Path $reviewRoot 'inventory.json'), $json, [System.Text.UTF8Encoding]::new($false))
  Write-Output "Extracted $($media.Count) media assets from $($slides.Count) slides into $reviewRoot"
} finally { $archive.Dispose() }
