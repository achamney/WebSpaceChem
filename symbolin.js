window.symbolIn = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol in In' + greek.mode + ' ' + greek.mode, 0, 0, 50, 50, createInSubButtons(greek));
        sym.greek = greek.mode;
        sym.name = "In";
        sym.performAction = makeInPerfActionFn(sym, greek);
        setGrid(sym, sq, sq);
        return sym;
    }
}
window.makeInPerfActionFn = function(sym, greek) {
    return function (greekName, greekMode) {
        var yMod = sym.greek == curReactor.beta.mode ? 4 : 0;
        var elements = get("elements"+greek.reactorId);
        var inData = window.greek(sym.greek).in;
        makeElement(inData, elements,
            10, 8, 20, 20, yMod);
    };
}
window.makeElement = function (inData, container, x, y, w, h, ymod) {
    ymod = ymod || 0;
    var randomChoose = Math.random();
    var chosenProb;
    var outElements = [];
    for (var inProb of inData) {
        if (inProb.probability / 100 < randomChoose) {
            randomChoose = 0;
            continue;
        }
        chosenProb = inProb;
        for (var inEl of inProb.elements) {
            var element = makesym('div', container, 'element ' + inEl.name,
                inEl.x * mapsizex / x, (inEl.y + ymod) * mapsizey / y, w, h, function () { });
            element.innerHTML = inEl.name;
            element.gridx = inEl.x;
            element.gridy = (inEl.y + ymod);
            element.symbol = inEl.name;
            element.elId = inEl.id;
            outElements.push(element);
        }
        randomChoose = 1;
    }
    // Add bonds after adding all elements
    for (var inEl of chosenProb.elements) {
        var element = outElements.filter(o => o.gridx == inEl.x && o.gridy == inEl.y + ymod)[0];
        if (inEl.bonds && inEl.bonds.length > 0) {
            for (var elId of inEl.bonds) {
                var bondingElData = chosenProb.elements.filter(d => d.id == elId)[0];
                var bondData = chosenProb.bonds.filter(b => (b.left == element.elId && b.right == bondingElData.id) ||
                    (b.right == element.elId && b.left == bondingElData.id))[0];
                var bondingEl = outElements.filter(o =>o.gridx ==
                    bondingElData.x && o.gridy == bondingElData.y + ymod)[0];
                for (var i = 0; i < bondData.count; i++) {
                    element.bonds.push(bondingEl);
                }
            }
            adjustBondBars(element);
        }
    }
    return outElements;
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
        var butList = [], parent = get("symButtons"+curReactor.id);
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
    if (symEl.greek == "Alpha") {
        symEl.classList.add("InAlpha");
        symEl.classList.remove("InBeta");
    }
    if (symEl.greek == "Beta") {
        symEl.classList.add("InBeta");
        symEl.classList.remove("InAlpha");
    }
};

window.prodInFn = function (sym, greek) {
    return function (greekName, greekMode) {
        var entranceGreek = window.greek(sym.greek); 
        if (entranceGreek.entrance.length > 0) {
            var elContainer = entranceGreek.entrance[0];
            var pipe = symAtCoords(pipes, { x: elContainer.prodx, y: elContainer.prody });
            pipe.curElement = null;
            var inData = makeInDataFromElements(elContainer);
            var elements = get("elements" + greek.reactorId);
            var yMod = sym.greek == curReactor.beta.mode ? 4 : 0;
            makeElement(inData, elements, 10, 8, 20, 20, yMod);
            delElement(elContainer);
            entranceGreek.entrance.shift();
        } else {
            greek.waldo.action = "in";
        }
    };
}