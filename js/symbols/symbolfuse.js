import * as symsrv from './symbolservice.js';
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol fuseSym ' + greek.mode, 0, 0, 50, 50, makeFuseButtons(greek));
        sym.greek = greek.mode;
        sym.performAction = function (greekName, g) {
            var elements = get("elements" + curReactor.id);
            if (curReactor.reactorFeatures.fuser) {
                var lelement = getElOnFuser(elements, curReactor.reactorFeatures.fuser);
                var relement = getElOnFuser(elements, curReactor.reactorFeatures.fuser,1);
                if (lelement && relement) {
                    delElement(lelement);
                    var pElr = periodicTable.filter(el => el[0] == relement.symbol)[0];
                    var indr = periodicTable.indexOf(pElr);
                    var pEll = periodicTable.filter(el => el[0] == lelement.symbol)[0];
                    var indl = periodicTable.indexOf(pEll);
                    var nextEl = periodicTable[indr + indl + 1];
                    relement.innerHTML = nextEl[0];
                    relement.symbol = nextEl[0];
                    for (var i = 0; i < 10; i++) {
                        makeParticle(lelement.gridx * mapsizex / 10 + 25, lelement.gridy * mapsizey / 8 + 25, "((()))", greek);
                    }
                }
            }
        };
        sym.name = "Fuse";
        setGrid(sym, sq, sq);
        return sym;
    }
},"Fuse");
function getElOnFuser(elements, sen, offset) {
    offset = offset || 0;
    for (var el of elements.childNodes) {
        if (el.gridx == sen.gridx + offset && el.gridy == sen.gridy) {
            return el;
        }
    }
    return null;
}
function makeFuseButtons(greek) {
    return function () {
        var butList = [], parent = get("symButtons" + curReactor.id);
        var selSym = greek.symbols.filter(s => s.selected)[0];
        var xoffset = -100;
        clear(parent);
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            delElement(selSym);
            clear(parent);
            var symInd = greek.symbols.indexOf(selSym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            save();
        }, 100, 50));
    };
}
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    return ret;
},"Fuse");
symsrv.registerLoad(function (symEl, saveState) {
},"Fuse");
