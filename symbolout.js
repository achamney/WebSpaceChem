window.symbolOut = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol out Out' + greek.mode + ' ' + greek.mode, 0, 0, 50, 50, createOutSubButtons(greek));
        sym.greek = greek.mode;
        sym.performAction = function (greekName, g) {
            for (var i = 0; i < elements.childNodes.length; i++) {
                var element = elements.childNodes[i];
                if (!element.grabbed) {
                    if (sym.greek == "Alpha") {
                        if (checkAllInBounds(element, (x, y) => x > 5 && y < 4)
                            && meetsRequirements(element, alpha)) {
                            traverseBonds(element, b => {
                                delElement(b);
                            });
                            alpha.outReqs.count--;
                        }
                    }
                    else if (sym.greek == "Beta") {
                        if (checkAllInBounds(element, (x, y) => x > 5 && y >= 4)
                            && meetsRequirements(element, beta)) {
                            traverseBonds(element, b => {
                                delElement(b);
                            });
                            beta.outReqs.count--;
                        }
                    }
                }
            }
        };
        setGrid(sym, sq, sq);
        return sym;
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
    //TODO: check bond count
    return els.length == 0;
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
        var butList = [], parent = get("symButtons");
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
            }, 100, 50));
        } else {
            butList.push(makebtn('button', parent, 'Out α', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
                selSym.greek = "Alpha";
                selSym.classList.remove("OutBeta");
                selSym.classList.add("OutAlpha");
                clear(parent);
                createOutSubButtons();
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