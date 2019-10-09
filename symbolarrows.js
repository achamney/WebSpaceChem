window.symbolLeft = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow left ' + greek.mode, 0, 0,
            20, 20, makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: -1, y: 0 };
        sym.name = "Left";
        sym.innerHTML = "&#9664;"
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
        sym.name = "Right";
        sym.innerHTML = "&#9654;"
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
        sym.name = "Up";
        sym.innerHTML = "&#9650;"
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
        sym.name = "Down";
        sym.innerHTML = "&#9660;"
        return sym;
    }
};
window.makeDelButton = function(greek) {
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
window.saveSymLeft = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
};
window.saveSymRight = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
};
window.saveSymUp = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
};
window.saveSymDown = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
};
window.symLoadUp = window.symLoadDown = window.symLoadLeft = window.symLoadRight = function (symEl, saveState) {
    symEl.direction = saveState.direction;
    symEl.arrow = saveState.arrow;
}