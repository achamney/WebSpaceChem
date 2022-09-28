window.symbolSync = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol sync ' + greek.mode, 0, 0, 50, 50, makeDelButton(greek));
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
}
window.saveSymSync = function (sym) {
    var ret = saveBase(sym);
    return ret;
};
window.symLoadSync = function (symEl, saveState) {
};