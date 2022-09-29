import * as symsrv from './symbolservice.js';
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow left ' + greek.mode, 0, 0,
            20, 20, symsrv.makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: -1, y: 0 };
        sym.name = "Left";
        sym.innerHTML = "&#9664;"
        return sym;
    }
},"Left");
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow right ' + greek.mode, 0, 0,
            20, 20, symsrv.makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 1, y: 0 };
        sym.name = "Right";
        sym.innerHTML = "&#9654;"
        return sym;
    }
},"Right");
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow up ' + greek.mode, 0, 0,
            20, 20, symsrv.makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 0, y: -1 };
        sym.name = "Up";
        sym.innerHTML = "&#9650;"
        return sym;
    }
},"Up");
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
        var sym = makesym('div', sq, 'symbol arrow down ' + greek.mode, 0, 0,
            20, 20, symsrv.makeDelButton(greek));
        setGrid(sym, sq, sq);
        sym.arrow = true;
        sym.direction = { x: 0, y: 1 };
        sym.name = "Down";
        sym.innerHTML = "&#9660;"
        return sym;
    }
},"Down");
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
}, 'Left');
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
}, 'Right');
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
}, 'Up');
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    ret.arrow = true;
    return ret;
}, 'Down');
let loadFn = function (symEl, saveState) {
    symEl.direction = saveState.direction;
    symEl.arrow = saveState.arrow;
};
symsrv.registerLoad(loadFn,"Left");
symsrv.registerLoad(loadFn,"Right");
symsrv.registerLoad(loadFn,"Up");
symsrv.registerLoad(loadFn,"Down");
