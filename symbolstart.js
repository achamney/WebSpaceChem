window.symbolStart = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        if (greek.startSymbol) {
            clear(greek.startSymbol.parentSquare);
            var symInd = greek.symbols.indexOf(greek.startSymbol);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
        }
        var sym = makesym('div', sq, 'symbol start ' + greek.mode, 0, 0, 50, 50, createStartSubButtons(greek));
        sym.direction = { x: 1, y: 0 };
        sym.performAction = function () { };
        sym.name = "Start";
        setGrid(sym, sq, sq);
        greek.startSymbol = sym;
        return sym;
    }
}
function createStartSubButtons(greek) {
    return function () {
        var butList = [], parent = get("symButtons");
        var xoffset = -400;
        clear(parent);
        butList.push(makebtn('button', parent, 'Left', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: -1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Right', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Up', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 0, y: -1 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Down', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 0, y: 1 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            deletePath(greek);
            var symInd = greek.symbols.indexOf(greek.startSymbol);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            clear(greek.startSymbol.parentSquare);
            clear(parent);
            greek.startSymbol = null;
            save();
        }, 100, 50));
    };
}
window.saveSymStart = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    return ret;
};
window.symLoadStart = function (symEl, saveState) {
    symEl.direction = saveState.direction;
};