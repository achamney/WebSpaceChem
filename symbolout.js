window.symbolOut = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol out Out' + greek.mode + ' ' + greek.mode, 0, 0, 50, 50, createOutSubButtons(greek));
        sym.greek = greek.mode;
        sym.name = "Out";
        sym.performAction = outFn(sym, greek);
        setGrid(sym, sq, sq);
        return sym;
    }
}
window.outFn = function (sym, greek) {
    var elements = get("elements" + greek.reactorId);
    return function (greekName, g) {
        var outed = false;
        for (var i = elements.childNodes.length - 1; i >= 0; i--) {
            var element = elements.childNodes[i];
            var boundsFn = (x, y) => x > 5 && y < 4;
            if (curReactor.alpha.outReqs.size == "large") {
                boundsFn = (x, y) => x > 5;
            }
            if (element && !elementsGrabbed(element)) {
                if (sym.greek == "Alpha") {
                    if (checkAllInBounds(element, boundsFn)
                        && meetsRequirements(element, curReactor.alpha)) {
                        performOut(curReactor.alpha, greek, element, outed);
                        outed = true;
                    }
                }
                else if (sym.greek == "Beta") {
                    if (checkAllInBounds(element, (x, y) => x > 5 && y >= 4)
                        && meetsRequirements(element, curReactor.beta)) {
                        performOut(curReactor.beta, greek, element, outed);
                        outed = true;
                    }
                }
            }
        }
    };
}
function elementsGrabbed(element) {
    var grabbed = false;
    traverseBonds(element, b => {
        if (b.grabbed)
            grabbed = true;
    });
    return grabbed;
}
function performOut(greek, walGreek, element, outed) {
    if (!outed) {
        traverseBonds(element, b => {
            delElement(b);
        });
        greek.outReqs.count--;
        walGreek.waldo.action = "move";
    } else {
        walGreek.waldo.action = "out";
    }
}
function meetsRequirements(el, greek) {
    var els = [];
    traverseBonds(el, b => {
        els.push(b.symbol);
    });
    if (greek.outReqs.elements.length != els.length) {
        return false;
    }
    for (var reqEl of greek.outReqs.elements) {
        var foundEl = els.filter(e => e == reqEl.name)[0];
        if (foundEl) {
            els.splice(els.indexOf(foundEl), 1);
        }
    }
    if (els.length > 0) {
        return false;
    }
    for (var bond of greek.outReqs.bonds) {
        var bondFound = false;
        var outReq1El = greek.outReqs.elements.filter(e => e.id == bond.left)[0];
        var outReq2El = greek.outReqs.elements.filter(e => e.id == bond.right)[0];
        traverseBonds(el, b => {
            for (var elBond of el.bonds) {
                if ((b.symbol == outReq1El.name && elBond.symbol == outReq2El.name) ||
                    (b.symbol == outReq2El.name && elBond.symbol == outReq1El.name)) {
                    var count = b.bonds.filter(b => b.symbol == outReq2El.name || b.symbol == outReq1El.name);
                    removeNonDupes(count);
                    if (bond.count == count.length) {
                        bondFound = true;
                    }
                }
            }
        });

        if (!bondFound) {
            return false;
        }
    }
    return true;
}
function removeNonDupes(bonds) {
    var first = bonds[0];
    for (var i = bonds.length-1; i >=1; i--) {
        var b = bonds[i];
        if (first.id != b.id) {
            bonds.splice(i, 1);
        }
    }
}
function checkAllInBounds(el, boundChecker) {
    var withinBounds = true;
    traverseBonds(el, function (b) {
        if (!boundChecker(b.gridx, b.gridy)) {
            withinBounds = false;
        }
    });
    return withinBounds;
}

function traverseBonds(el, visit) {
    traverseBondsIter(el, visit, []);
}
function traverseBondsIter(el, visit, visited) {
    visit(el);
    visited.push(el);
    for (var bond of el.bonds) {
        if (visited.indexOf(bond) == -1) {
            traverseBondsIter(bond, visit, visited);
        }
    }
}
function createOutSubButtons(greek) {
    return function (sym) {
        var butList = [], parent = get("symButtons"+greek.reactorId);
        var xoffset = -200;
        var selSym = greek.symbols.filter(s => s.selected)[0];
        clear(parent);
        if (selSym.greek == "Alpha") {
            butList.push(makebtn('button', parent, 'Out β', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Beta";
                selSym.classList.add("OutBeta");
                selSym.classList.remove("OutAlpha");
                clear(parent);
                createOutSubButtons();
                save();
            }, 100, 50));
        } else {
            butList.push(makebtn('button', parent, 'Out α', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Alpha";
                selSym.classList.remove("OutBeta");
                selSym.classList.add("OutAlpha");
                clear(parent);
                createOutSubButtons();
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
window.saveSymOut = function (sym) {
    var ret = saveBase(sym);
    ret.greek = sym.greek;
    return ret;
};
window.symLoadOut = function (symEl, saveState) {
    symEl.greek = saveState.greek;
    if (symEl.greek == "Alpha") {
        symEl.classList.add("OutAlpha");
        symEl.classList.remove("OutBeta");
    }
    if (symEl.greek == "Beta") {
        symEl.classList.add("OutBeta");
        symEl.classList.remove("OutAlpha");
    }
};

window.prodOutFn = function (sym, greek) {
    var elements = get("elements" + greek.reactorId);
    return function (greekName, greekMode) {
        var outed = false;
        for (var i = elements.childNodes.length - 1; i >= 0; i--) {
            var element = elements.childNodes[i];
            var boundsFn = (x, y) => x > 5 && y < 4;
            if (curReactor.alpha.outReqs.size == "large") {
                boundsFn = (x, y) => x > 5;
            }
            if (element && !elementsGrabbed(element)) {
                if (sym.greek == "Alpha") {
                    if (checkAllInBounds(element, boundsFn)) {
                        performProdOut(curReactor.alpha, greek, element, outed);
                        outed = true;
                    }
                }
                else if (sym.greek == "Beta") {
                    if (checkAllInBounds(element, (x, y) => x > 5 && y >= 4)) {
                        performProdOut(curReactor.beta, greek, element, outed);
                        outed = true;
                    }
                }
            }
        }
    };
}
function performProdOut(greek, walGreek, element, outed) {
    if (!outed) {
        var outElements = [];
        traverseBonds(element, b => {
            outElements.push(b);
            delElement(b);
        });
        var reactor = get(greek.reactorId);
        var outPipe = greek == reactor.alpha ? reactor.outPipes[0] : reactor.outPipes[1];
        var inData = makeInDataFromElements({ childNodes: outElements }, 6);
        makeProdElement(outPipe, inData);
        walGreek.waldo.action = "move";
    } else {
        walGreek.waldo.action = "out";
    }
}