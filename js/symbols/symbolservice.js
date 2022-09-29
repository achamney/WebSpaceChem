let symbols = {},
  saves = {},
  loads = {};
export function registerSymbol(sym, name) {
  symbols[name] = sym;
}
export function registerSave(save, name) {
  saves[name] = save;
}
export function registerLoad(load, name) {
  loads[name] = load;
}
export function getSymbol(name) {
  return symbols[name]
}
export function getSave(name) {
  return saves[name];
}
export function getLoad(name) {
  return loads[name];
}

export let makeDelButton = function(greek) {
    return function (sym) {
        var parent = get("symButtons" + curReactor.id);
        clear(parent);
        makebtn('button', parent, 'Delete', mapsizex / 2 - 50, mapsizey, function () {
            delElement(sym);
            var symInd = greek.symbols.indexOf(sym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            if (greek.startSymbol) {
                makePath(greek.startSymbol.parentSquare, greek);
            }
            clear(parent);
            save();
        }, 100, 50);
    }
}
