window.symbolIn = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol in In' + greek.mode + ' ' + greek.mode, 0, 0, 50, 50, createInSubButtons(greek));
        sym.greek = greek.mode;
        sym.name = "In";
        sym.performAction = makePerfActionFn(sym, greek);
        setGrid(sym, sq, sq);
        return sym;
    }
}
function makePerfActionFn(sym, greek) {
    return function (greekName, greekMode) {
        var yMod = sym.greek == beta.mode ? 4 : 0;
        var elements = get("elements");
        var inData = window.greek(sym.greek).in;
        var inBonds = window.greek(sym.greek).inBonds;
        var randomChoose = Math.random();
        for (var inEl of inData) {
            if (inEl.probability / 100 < randomChoose) {
                randomChoose = 0;
                continue;
            }
            var element = makesym('div', elements, 'element ' + inEl.name,
                inEl.x * mapsizex / 10,
                (inEl.y + yMod) * mapsizey / 8,
                20, 20, function () { });
            element.innerHTML = inEl.name;
            element.gridx = inEl.x;
            element.gridy = (inEl.y + yMod);
            element.symbol = inEl.name;
            element.elId = inEl.id;
            randomChoose = 1;
        }
        // Add bonds after adding all elements
        for (var inEl of inData) {
            var element = getElByGrid(elements.childNodes, inEl.x, (inEl.y + yMod));
            if (inEl.bonds && inEl.bonds.length > 0) {
                for (var elId of inEl.bonds) {
                    var bondingElData = inData.filter(d => d.id == elId)[0];
                    var bondData = inBonds.filter(b => (b.left == element.elId && b.right == bondingElData.id) ||
                        (b.right == element.elId && b.left == bondingElData.id))[0];
                    var bondingEl = getElByGrid(elements.childNodes,
                        bondingElData.x, bondingElData.y + yMod);
                    for (var i= 0; i < bondData.count;i++) {
                        element.bonds.push(bondingEl);
                    }
                }
                adjustBondBars(element);
            }
        }
    };
}
function getElByGrid(elements, x, y) {
    for (var el of elements) {
        if (el.gridx == x && el.gridy == y) {
            return el;
        }
    }
    return null;
}
function createInSubButtons(greek) {
    return function (sym) {
        var butList = [], parent = get("symButtons");
        var xoffset = -200;
        var selSym = greek.symbols.filter(s => s.selected)[0];
        clear(parent);
        if (selSym.greek == "Alpha") {
            butList.push(makebtn('button', parent, 'In β', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Beta";
                selSym.classList.add("InBeta");
                selSym.classList.remove("InAlpha");
                clear(parent);
                createInSubButtons();
                save();
            }, 100, 50));
        } else {
            butList.push(makebtn('button', parent, 'In α', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Alpha";
                selSym.classList.remove("InBeta");
                selSym.classList.add("InAlpha");
                clear(parent);
                createInSubButtons();
                save();
            }, 100, 50));
        }
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            delElement(selSym);
            clear(parent);
            var symInd = greek.symbols.indexOf(selSym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            save();
        }, 100, 50));
    }
}
window.saveSymIn = function (sym) {
    var ret = saveBase(sym);
    ret.greek = sym.greek;
    return ret;
};
window.symLoadIn = function (symEl, saveState) {
    symEl.greek = saveState.greek;
    if (symEl.greek != "Alpha") {
        symEl.classList.add("InBeta");
        symEl.classList.remove("InAlpha");
    }
};