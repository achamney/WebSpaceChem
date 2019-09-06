window.symbolBond = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol bond ' + greek.mode, 0, 0, 50, 50, createBondSubButtons(greek));
        sym.greek = greek.mode;
        sym.bond = "bond";
        sym.performAction = function (greekName, g) {
            var bonders = reactorFeatures.filter(feat => feat.type == "bonder");
            var bonded = [];
            for (var b1 of bonders) {
                for (var b2 of bonders) {
                    if (b1 == b2) continue;
                    if (adjacent(b1, b2) && !alreadyBonded(bonded, b1, b2)) {
                        var b1e = getElOnSquare(elements, b1);
                        var b2e = getElOnSquare(elements, b2);
                        if (b1e && b2e) {
                            if (sym.bond == "bond") {
                                traverseBonds(b1e, b => {
                                    addAllBonds(b, b2e);
                                });
                                traverseBonds(b2e, b => {
                                    addAllBonds(b, b1e);
                                });
                                if (b1e.grabbed || b2e.grabbed) {
                                    b1e.grabbed = b2e.grabbed = true;
                                }

                            } else if (sym.bond == "debond") {
                                traverseBonds(b1e, b => {
                                    removeBonds(b, b2e);
                                });
                                traverseBonds(b2e, b => {
                                    removeBonds(b, b1e);
                                });
                            }
                            bonded.push({ b1: b1, b2: b2 });
                        }
                    }
                }
            }
        };
        setGrid(sym, sq, sq);
        return sym;
    }
}
function removeBonds(element, orphan) {
    var ind = element.bonds.indexOf(orphan);
    if (~ind) {
        element.bonds.splice(ind, 1);
    }
}
function createBondSubButtons(greek) {
    return function (sym) {
        var butList = [], parent = get("symButtons");
        var xoffset = -200;
        var selSym = greek.symbols.filter(s => s.selected)[0];
        clear(parent);

        butList.push(makebtn('button', parent, 'Bond +', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.bond);
            selSym.bond = "bond";
            selSym.classList.add(selSym.bond);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Bond -', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.bond);
            selSym.bond = "debond";
            selSym.classList.add(selSym.bond);
        }, 100, 50));
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
function addAllBonds(el1, el2) {
    if (el1.bonds.indexOf(el2) == -1 && el1 != el2) {
        el1.bonds.push(el2);
    }
    for (var el of el2.bonds) {
        if (el1.bonds.indexOf(el) == -1 && el != el1)
            el1.bonds.push(el);
    }
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
function alreadyBonded(bonded, b1, b2) {
    for (var bond of bonded) {
        if ((bond.b1 == b1 && bond.b2 == b2) ||
            (bond.b1 == b2 && bond.b2 == b1)) {
            return true;
        }
    }
    return false;
}
function getElOnSquare(elements, sq) {
    for (var el of elements.childNodes) {
        if (el.gridx == sq.gridx && el.gridy == sq.gridy) {
            return el;
        }
    }
    return null;
}
function adjacent(el1, el2) {
    var difx = Math.abs(el1.gridx - el2.gridx),
        dify = Math.abs(el1.gridy - el2.gridy);
    if ((difx == 1 && dify == 0) || (difx == 0 && dify == 1)) {
        return true;
    }
    return false;
}