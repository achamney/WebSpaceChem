window.symbolLeft = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow left ' + greek.mode, 0, 0,
            20, 20, makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: -1, y: 0 };
        return sym;
    }
};
window.symbolRight = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow right ' + greek.mode, 0, 0,
            20, 20, makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 1, y: 0 };
        return sym;
    }
};
window.symbolUp = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow up ' + greek.mode, 0, 0,
            20, 20, makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 0, y: -1 };
        return sym;
    }
};
window.symbolDown = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow down ' + greek.mode, 0, 0,
            20, 20, makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 0, y: 1 };
        return sym;
    }
};
window.makeDelButton = function(greek) {
    return function (sym) {
        var parent = get("symButtons");
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
        }, 100, 50);
    }
}