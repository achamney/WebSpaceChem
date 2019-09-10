window.symbolBond = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol bond ' + greek.mode, 0, 0, 50, 50, createBondSubButtons(greek));
        sym.greek = greek.mode;
        sym.bond = "bond";
        sym.performAction = function (greekName, g) {
            var bonders = reactorFeatures.bonders.filter(feat => feat.type == "bonder");
            var bonded = [];
            for (var b1 of bonders) {
                for (var b2 of bonders) {
                    if (b1 == b2) continue;
                    if (adjacent(b1, b2) && !alreadyBonded(bonded, b1, b2)) {
                        var b1e = getElOnSquare(elements, b1);
                        var b2e = getElOnSquare(elements, b2);
                        if (b1e && b2e) {
                            if (sym.bond == "bond" && !maxBonds(b1e) && !maxBonds(b2e)) {
                                b1e.bonds.push(b2e);
                                b2e.bonds.push(b1e);
                                for (var i = 0; i < 10; i++) {
                                    makeParticle(b1e.gridx * mapsizex / 10 + 25, b1e.gridy * mapsizey / 8 + 25, "+", greek);
                                }
                                if (b1e.grabbed || b2e.grabbed) {
                                    traverseBonds(b1e, function (b) {
                                        b.grabbed = true;
                                    });
                                }
                            } else if (sym.bond == "debond") {
                                removeBonds(b1e, b2e);
                                removeBonds(b2e, b1e);
                                for (var i = 0; i < 10; i++) {
                                    makeParticle(b1e.gridx * mapsizex / 10 + 25, b1e.gridy * mapsizey / 8 + 25, "-", greek);
                                }
                            }
                            adjustBondBars(b1e, 1, b2e);
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
window.adjustBondBars = function (element, divisor, secondEl) {
    divisor = divisor || 1;
    for (var bondbar of element.bondBars) {
        delElement(bondbar);
    }
    element.bondBars = [];
    if (secondEl) {
        for (var bondbar of secondEl.bondBars) {
            delElement(bondbar);
        }
        secondEl.bondBars = [];
    }
    for (var bond of element.bonds) {
        var count = element.bonds.filter(b => b == bond).length;
        var difx = Math.round(bond.gridx - element.gridx);
        var dify = Math.round(bond.gridy - element.gridy);
        var width = difx != 0 ? 20 / divisor : 5 / divisor;
        var height = dify != 0 ? 20 / divisor : 5 / divisor; 
        var spread = 7 / divisor,
            startSpread = -count/2*spread/2;
        for (var i = 0; i < count; i++) {
            var bondBar = makesq("div", element, "bondbar", 0, 0, width, height);
            if (difx > 0) {
                bondBar.style.left = (50 / divisor) + "px";
                bondBar.style.top = (startSpread + 20/divisor) + "px";
            } else if (difx < 0) {
                bondBar.style.left = (-15 / divisor) + "px";
                bondBar.style.top = (startSpread + 20 / divisor) + "px";
            } else if (dify > 0) {
                bondBar.style.top = (50 / divisor) + "px";
                bondBar.style.left = (startSpread + 20 / divisor) + "px";
            } else if (dify < 0) {
                bondBar.style.top = (-20 / divisor) + "px";
                bondBar.style.left = (startSpread + 20 / divisor) + "px";
            } 
            element.bondBars.push(bondBar);
            startSpread += spread;
        }
    }
}
function removeBonds(element, orphan) {
    var ind = element.bonds.indexOf(orphan);
    if (~ind) {
        element.bonds.splice(ind, 1);
        if (element.grabbed) {
            traverseBonds(orphan, function () {
                orphan.grabbed = false;
            });
        }
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