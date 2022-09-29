import * as symsrv from './symbolservice.js';
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol sync ' + greek.mode, 0, 0, 50, 50, symsrv.makeDelButton(greek));
        sym.greek = greek.mode;
        sym.name = "Sync";
        sym.performAction = function () {
            greek.waldo.action = "sync";
            var oppoGreek = greekOpposite(greek.mode);
            if (oppoGreek.waldo.action == "sync") {
                greek.waldo.action = "move";
                if (greek.mode == "Beta") {
                    oppoGreek.waldo.action = "move";
                } else {
                    setTimeout(function () { oppoGreek.waldo.action = "move"; });
                }
            }
        }
        setGrid(sym, sq, sq);
        return sym;
    }
},"Sync");
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    return ret;
},"Sync");
symsrv.registerLoad(function (symEl, saveState) {
},"Sync");
