// Small test adapter: compile local TS/TSX using the project's existing compiler.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function createLoader(mocks = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(root, file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const loadedModule = { exports: {} };
    cache.set(absolute, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const localRequire = id => {
      if (id in mocks) return mocks[id];
      if (id.startsWith('@/') || id.startsWith('.')) {
        const target = id.startsWith('@/') ? path.resolve(root, id.slice(2)) : path.resolve(path.dirname(absolute), id);
        const resolved = [target, target + '.ts', target + '.tsx'].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (!resolved) throw new Error('Cannot resolve test module: ' + id);
        return load(resolved);
      }
      return require(id);
    };
    vm.runInNewContext(code, {
      exports: loadedModule.exports, module: loadedModule, require: localRequire,
      FormData, File, fetch, Request, Response, URL, process, console,
    }, { filename: absolute });
    return loadedModule.exports;
  }
  return load;
}
module.exports = { createLoader };
