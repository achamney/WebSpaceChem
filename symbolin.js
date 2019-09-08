window.symbolIn = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol in In' + greek.mode + ' ' + greek.mode, 0, 0, 50, 50, createInSubButtons(greek));
        sym.greek = greek.mode;
        sym.performAction = makePerfActionFn(sym);
        setGrid(sym, sq, sq);
        return sym;
    }
}
function makePerfActionFn(sym) {
    return function (greekName, greekMode) {
        var elements = get("elements");
        var inData = window.greek(sym.greek).in;
        var inBonds = window.greek(sym.greek).inBonds;
        for (var inEl of inData) {
            var element = makesym('div', elements, 'element ' + inEl.name,
                inEl.location.x * mapsizex / 10,
                inEl.location.y * mapsizey / 8,
                20, 20, function () { });
            element.innerHTML = inEl.name;
            element.gridx = inEl.location.x;
            element.gridy = inEl.location.y;
            element.symbol = inEl.name;
            element.bonds = [];
            element.bondBars = [];
            element.elId = inEl.id;
        }
        // Add bonds after adding all elements
        for (var inEl of inData) {
            var element = getElByGrid(elements.childNodes, inEl.location.x, inEl.location.y);
            if (inEl.bonds) {
                for (var elId of inEl.bonds) {
                    var bondingElData = inData.filter(d => d.id == elId)[0];
                    var bondData = inBonds.filter(b => (b.left == element.elId && b.right == bondingElData.id) ||
                        (b.right == element.elId && b.left == bondingElData.id))[0];
                    var bondingEl = getElByGrid(elements.childNodes,
                        bondingElData.location.x, bondingElData.location.y);
                    for (var i= 0; i < bondData.count;i++) {
                        element.bonds.push(bondingEl);
                    }
                }
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
            }, 100, 50));
        } else {
            butList.push(makebtn('button', parent, 'In α', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Alpha";
                selSym.classList.remove("InBeta");
                selSym.classList.add("InAlpha");
                clear(parent);
                createInSubButtons();
            }, 100, 50));
        }
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            delElement(selSym);
            clear(parent);
            var symInd = greek.symbols.indexOf(selSym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
        }, 100, 50));
    }
}