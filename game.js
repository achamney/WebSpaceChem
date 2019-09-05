window.onload = function () {
    var beginButton = get("begin");
    beginButton.onclick = function () {
        var config = get("config");
        try {
            var configJson = JSON.parse(config.value);
            beginButton.style.display = "none";
            config.style.display = "none";
            loadGame(configJson);
        } catch (e) {
            alert("Error parsing configuration file, try again");
        }
    }
}
function loadGame(config) {
    window.mapsizex = 750;
    window.mapsizey = 480;
    window.elementRadius = 20;
    var canvas = get('canvas');
    window.curSymbol = 'Start';
    window.cycles = 0;
    window.alpha = {
        paths: [], symbols: [], in: config.alpha.in, outReqs: config.alpha.outReqs,
        mode: "Alpha"
    };
    window.beta = {
        paths: [], symbols: [], in: config.beta.in, outReqs: config.beta.outReqs,
        mode: "Beta"
    };
    window.mode = alpha;
    window.reactorFeatures = [];

    makeBuildButtons(canvas);

    window.headerBeta = make("h2", get('body'), '', true);
    headerBeta.innerHTML = makeHeader(beta, "β");
    window.headerAlpha = make("h2", get('body'), '', true);
    headerAlpha.innerHTML = makeHeader(alpha, "α");

    makesq('div', canvas, 'blk toplblock', 0, 0, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    makesq('div', canvas, 'blk toprblock', mapsizex / 2 + mapsizex / 10, 0, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    makesq('div', canvas, 'blk bottomlblock', 0, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    makesq('div', canvas, 'blk bottomrblock', mapsizex / 2 + mapsizex / 10, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);

    for (var i = 0; i < 10; i++) {

        for (var j = 0; j < 8; j++) {
            var sq = makesq('div', canvas, 'square', i * (mapsizex / 10), j * (mapsizey / 8), mapsizex / 10, mapsizey / 8,
                dropSymSq(sq));
            setSqListeners(sq);
            sq.gridx = i;
            sq.gridy = j;
            if (i >= 4 && i <= 5 && j >= 3 && j <= 4) {
                makeBonder(sq);
            }
        }
    }
    document.addEventListener('keyup', (e) => {
        if (e.code === "KeyW") curSymbol = "Up";
        else if (e.code === "KeyS") curSymbol = "Down";
        else if (e.code === "KeyA") curSymbol = "Left";
        else if (e.code === "KeyD") curSymbol = "Right";
        else if (e.code === "KeyI") curSymbol = "In";
        else if (e.code === "KeyO") curSymbol = "Out";
        else if (e.code === "KeyR") curSymbol = "Start";
        else if (e.code === "KeyB") curSymbol = "Bond";
        else if (e.code === "KeyG") curSymbol = "Grab";
        else if (e.code === "Tab") switchGreek(mode.mode, canvas);
        else if (e.code === "Space") {
            if (alpha.waldo && activateInterval) {
                clearIntervals();
            } else {
                makeRunButtons(canvas);
                run(canvas);
            }
        }
        else if (e.code === "Digit1") {
            if (alpha.waldo) {
                run(canvas);
            }
        }
        else if (e.code === "Digit2") {
            if (alpha.waldo) {
                run(canvas, 20, 500);
            }
        }
        else if (e.code === "Digit3") {
            if (alpha.waldo) {
                run(canvas, 20, 200);
            }
        }
        else if (e.code === "Digit4") {
            if (alpha.waldo) {
                run(canvas, 2000, 20);
            }
        }
        else if (e.code === "Digit5") {
            if (alpha.waldo) {
                run(canvas, 2000, 2);
            }
        }
        var buttonContainer = get("buttonContainer");
        deselBtns(buttonContainer);
        for (var child of buttonContainer.childNodes) {
            if (child.name == curSymbol) {
                child.classList.add("selected");
            }
        }
    });
}
function makeBonder(sq) {
    var bonder = makesq('div', sq, 'bonder', 0, 0, (mapsizex / 10)-13, (mapsizey / 8)-12);
    bonder.gridx = sq.gridx;
    bonder.gridy = sq.gridy;
    bonder.type = "bonder";
    bonder.draggable = true;
    bonder.ondragstart = function () {
        event.dataTransfer.setData("text", bonder.id);
    }
    bonder.ondragover = null;
    bonder.ondrop = null;
    reactorFeatures.push(bonder);
}
function dropSymSq(sq) {
    return function (ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var symbol = get(data);
        var dropTarget = ev.target;
        while (dropTarget && !dropTarget.classList.contains("square")) {
            dropTarget = dropTarget.parentNode;
        }
        if (!dropTarget) return;
        dropTarget.appendChild(symbol);
        symbol.gridx = dropTarget.gridx;
        symbol.gridy = dropTarget.gridy;
        symbol.parentSquare = dropTarget;
        alpha.startSymbol && makePath(alpha.startSymbol.parentSquare, alpha);
        beta.startSymbol && makePath(beta.startSymbol.parentSquare, beta);
    }
}
function makeHeader(greek, greekSymbol) {
    var ret = "In ";
    ret += greekSymbol + " ";
    for (var inEl of greek.in) {
        ret += "location (" + inEl.name + "): (" + (inEl.location.x+1) + ", " + (inEl.location.y+1)+") ";
    }
    for (var outEl in greek.outReqs) {
        ret += ". Out " + greekSymbol + " requirements (" + outEl + "): " + greek.outReqs[outEl];
    }
    return ret;
}
function setSqListeners(sq) {
    var arrows = get("arrows");
    var elements = get("elements");
    sq.onclick = function () {
        var sym;
        if (curSymbol == "Start") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
            if (greek().startSymbol) {
                clear(greek().startSymbol.parentSquare);
                var symInd = greek().symbols.indexOf(greek().startSymbol);
                if (~symInd) {
                    greek().symbols.splice(symInd, 1);
                }
            }
            sym = makesym('div', sq, 'symbol start ' + greek().mode, 0, 0, 50, 50, createStartSubButtons(greek()));
            sym.direction = { x: -1, y: 0 };
            sym.performAction = function () { };
            setGrid(sym, sq, sq);
            greek().startSymbol = sym;
        } else if (curSymbol == "Left") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
            sym = makesym('div', sq, 'symbol arrow left ' + greek().mode, 0, 0,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, sq);
            sym.arrow = true;
            sym.direction = { x: -1, y: 0 };
        } else if (curSymbol == "Right") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
            sym = makesym('div', sq, 'symbol arrow right ' + greek().mode, 0, 0,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, sq);
            sym.arrow = true;
            sym.direction = { x: 1, y: 0 };
        } else if (curSymbol == "Up") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
            sym = makesym('div', sq, 'symbol arrow up ' + greek().mode, 0, 0,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, sq);
            sym.arrow = true;
            sym.direction = { x: 0, y: -1 };
        } else if (curSymbol == "Down") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, true)) return;
            sym = makesym('div', sq, 'symbol arrow down ' + greek().mode, 0, 0,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, sq);
            sym.arrow = true;
            sym.direction = { x: 0, y: 1 };
        } else if (curSymbol == "In") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
            sym = makesym('div', sq, 'symbol in In' + greek().mode + ' ' + greek().mode, 0, 0, 50, 50, createInSubButtons(greek()));
            sym.greek = greek().mode;
            sym.performAction = function (greekName, greekMode) {
                for (var inEl of greek(sym.greek).in) {
                    var element = makesym('div', elements, 'element ' + inEl.name,
                        inEl.location.x * mapsizex / 10,
                        inEl.location.y * mapsizey / 8,
                        20, 20, function () { });
                    element.innerHTML = inEl.name;
                    element.gridx = inEl.location.x;
                    element.gridy = inEl.location.y;
                    element.symbol = inEl.name;
                    element.bonds = [];
                }
            };
            setGrid(sym, sq, sq);
        } else if (curSymbol == "Out") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
            sym = makesym('div', sq, 'symbol out Out' + greek().mode + ' ' + greek().mode, 0, 0, 50, 50, createOutSubButtons(greek()));
            sym.greek = greek().mode;
            sym.performAction = function (greekName, g) {
                for (var i = 0; i < elements.childNodes.length; i++) {
                    var element = elements.childNodes[i];
                    if (!element.grabbed) {
                        if (sym.greek == "Alpha" && element.gridx > 5 && element.gridy < 4) {
                            delElement(element);
                            alpha.outReqs[element.symbol]--;
                        }
                        else if (sym.greek == "Beta" && element.gridx > 5 && element.gridy >= 4) {
                            delElement(element);
                            beta.outReqs[element.symbol]--;
                        }
                    }
                }
            };
            setGrid(sym, sq, sq);
        } else if (curSymbol == "Grab") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
            sym = makesym('div', sq, 'symbol grabdrop ' + greek().mode, 0, 0, 50, 50, createGrabSubButtons(greek()));
            sym.greek = greek().mode;
            sym.grab = "grabdrop";
            sym.performAction = function (greekName, g) {

                var grabbed = greek(sym.greek).waldo.grabbedElement;
                if (grabbed && (sym.grab == "grabdrop" || sym.grab == "drop")) {
                    grabbed.grabbed = false;
                    greek(sym.greek).waldo.grabbedElement = null;
                }
                else if (sym.grab == "grabdrop" || sym.grab == "grab") {
                    for (var i = 0; i < elements.childNodes.length; i++) {
                        var element = elements.childNodes[i];
                        if (element.gridx == greek(sym.greek).waldo.gridx &&
                            element.gridy == greek(sym.greek).waldo.gridy) {
                            greek(sym.greek).waldo.grabbedElement = element;
                            element.grabbed = true;
                        }
                    }
                }
            };
            setGrid(sym, sq, sq);
        } else if (curSymbol == "Bond") {
            if (symAtCoords(greek().symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
            sym = makesym('div', sq, 'symbol bond ' + greek().mode, 0, 0, 50, 50, createBondSubButtons(greek()));
            sym.greek = greek().mode;
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
                                traverseBonds(b1e, b => {
                                    addAllBonds(b, b2e);
                                });
                                traverseBonds(b2e, b => {
                                    addAllBonds(b, b1e);
                                });
                                if (b1e.grabbed || b2e.grabbed) {
                                    b1e.grabbed = b2e.grabbed = true;
                                }
                            }
                            bonded.push({ b1: b1, b2: b2 });
                        }
                    }
                }
            };
            setGrid(sym, sq, sq);
        }
        greek().symbols.push(sym);
        if (greek().startSymbol) {
            makePath(greek().startSymbol.parentSquare, greek());
        }
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
function createStartSubButtons(greek) {
    return function () {
        var butList = [], parent = get("symButtons");
        var xoffset = -400;
        clear(parent);
        butList.push(makebtn('button', parent, 'Left', mapsizex / 2 + (xoffset+=100), mapsizey, function () {
            greek.startSymbol.direction = { x: -1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Right', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Up', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 0, y: -1 };
            makePath(greek.startSymbol.parentSquare, greek);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Down', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            greek.startSymbol.direction = { x: 0, y: 1 };
            makePath(greek.startSymbol.parentSquare, greek);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            deletePath(greek);
            var symInd = greek.symbols.indexOf(greek.startSymbol);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            clear(greek.startSymbol.parentSquare);
            clear(parent);
            greek.startSymbol = null;
        }, 100, 50));
    };
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
function createGrabSubButtons(greek) {
    return function (sym) {
        var butList = [], parent = get("symButtons");
        var xoffset = -200;
        var selSym = greek.symbols.filter(s => s.selected)[0];
        clear(parent);

        butList.push(makebtn('button', parent, 'Grab/Drop', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "grabdrop";
            selSym.classList.add(selSym.grab);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Grab', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "grab";
            selSym.classList.add(selSym.grab);
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Drop', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "drop";
            selSym.classList.add(selSym.grab);
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
function makeDelButton(greek) {
    return function (sym) {
        var parent = get("symButtons");
        clear(parent);
        makebtn('button', parent, 'Delete', mapsizex / 2 - 50, mapsizey, function () {
            delElement(sym);
            var symInd = greek.symbols.indexOf(sym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            if (greek.startSymbol) {
                makePath(greek.startSymbol.parentSquare, greek);
            }
            clear(parent);
        }, 100, 50);
    }
}
function setGrid(sym, sq, parent) {
    sym.parentSquare = parent;
    sym.gridx = sq.gridx;
    sym.gridy = sq.gridy;
}
function deletePath(greek) {
    for (var path in greek.paths) {
        delElement(greek.paths[path].path);
    }
    greek.paths = [];
}
function makePath(start, greek, greekMode) {
    var curLoc = { x: start.gridx, y: start.gridy, dir: greek.startSymbol.direction },
        curSym,
        newCurLoc = curLoc;
    deletePath(greek);
    while (curLoc.x >= 0 && curLoc.x < 10 && curLoc.y >= 0 && curLoc.y < 8) {
        var path, newCurLoc;
        curSym = symAtCoords(greek.symbols, curLoc, "arrow");
        if (curSym && curSym.arrow) {
            curLoc.dir = curSym.direction;
        }
        if (hasThisPath(greek.paths, curLoc)) {
            break;
        }
        if (curLoc.dir.x != 0)
            path = makesq('div', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, mapsizex / 10, 10);
        else
            path = makesq('div', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, 10, mapsizey / 8);
        curLoc.path = path;
        newCurLoc = clone(curLoc);
        greek.paths.push(newCurLoc);
        curLoc.x += curLoc.dir.x;
        curLoc.y += curLoc.dir.y;
    }
    function hasThisPath(paths, curLoc) {
        for (var path of paths) {
            if (curLoc.x == path.x && curLoc.y == path.y &&
                curLoc.dir.x == path.dir.x && curLoc.dir.y == path.dir.y) {
                return true;
            }
        }
        return false;
    }
}
function symAtCoords(symbols, location, arrow) {
    for (var i = 0; i < symbols.length; i++) {
        var curSym = symbols[i];
        if (curSym.gridx == location.x && curSym.gridy == location.y) {
            if (arrow && !curSym.arrow) {
                continue;
            } else if (!arrow && curSym.arrow) {
                continue;
            }
            return curSym;
        }
    }
    return null;
}
function greek(name) {
    if (name == "Beta")
        return beta;
    if (name == "Alpha" || mode == alpha)
        return alpha;
    return beta;
}
function makeBuildButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = get('buttonContainer');
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
    }
    clear(buttonContainer);
    var greekMode = greek().mode;
    buttonContainer.id = "buttonContainer";
    makebtns(greekMode, 'button', buttonContainer, 'Start (r)', mapsizex + 10, buttonpos += 50, "Start",
        function () { curSymbol = "Start" });
    makebtns(greekMode, 'button', buttonContainer, 'In (i)', mapsizex + 10, buttonpos += 50, "In",
        function () { curSymbol = "In"; }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Out (o)', mapsizex + 85, buttonpos, "Out",
        function () { curSymbol = "Out" }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Grab (g)', mapsizex + 10, buttonpos += 50, "Grab",
        function () { curSymbol = "Grab" });
    makebtns(greekMode, 'button', buttonContainer, 'Bond (b)', mapsizex + 10, buttonpos += 50, "Bond",
        function () { curSymbol = "Bond" });
    makebtns(greekMode, 'button', buttonContainer, '^ (w)', mapsizex + 10, buttonpos += 50, "Up",
        function () { curSymbol = "Up" }, 40);
    makebtns(greekMode, 'button', buttonContainer, 'v (s)', mapsizex + 10 + 36, buttonpos, "Down",
        function () { curSymbol = "Down" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '<- (a)', mapsizex + 10 + 37 + 36, buttonpos, "Left",
        function () { curSymbol = "Left" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '-> (d)', mapsizex + 10 + 37 + 36 + 37, buttonpos, "Right",
        function () { curSymbol = "Right" }, 40);
    makebtns(greekMode, 'button', buttonContainer, 'Switch (tab)', mapsizex + 10, buttonpos += 50, "",
        function () {
            switchGreek(greekMode, canvas);
        });
    makebtn('button', buttonContainer, 'Simulate', mapsizex + 10, buttonpos += 60, function () {
        makeRunButtons(canvas);
        run(canvas);
    });
}
function switchGreek(greekMode, canvas) {
    if (greekMode == 'Alpha') {
        mode = beta;
    } else {
        mode = alpha;
    }
    makeBuildButtons(canvas);
}
function deselBtns(container) {
    for (var child of container.childNodes) {
        child.classList.remove("selected");
    }
}
function makeRunButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = get('buttonContainer');
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
    }
    clear(buttonContainer);
    buttonContainer.id = "buttonContainer";
    
    makebtn('button', buttonContainer, 'Stop', mapsizex + 10, buttonpos += 50, function () {
        stopGame(canvas);
    });
    makebtn('button', buttonContainer, 'Pause', mapsizex + 10, buttonpos += 50, function () {
        clearIntervals();
    });
    makebtn('button', buttonContainer, 'Speed x 1', mapsizex + 10, buttonpos += 50, function () {
        run(canvas);
    });
    makebtn('button', buttonContainer, 'Speed x 2', mapsizex + 10, buttonpos += 50, function () {
        run(canvas, 20, 500);
    });
    makebtn('button', buttonContainer, 'Speed x 5', mapsizex + 10, buttonpos += 50, function () {
        run(canvas, 20, 200);
    });
    makebtn('button', buttonContainer, 'Speed x 50', mapsizex + 10, buttonpos += 50, function () {
        run(canvas, 2000, 20);
    });
    makebtn('button', buttonContainer, 'Speed x 500', mapsizex + 10, buttonpos += 50, function () {
        run(canvas, 2000, 2);
    });
}
function stopGame(canvas) {
    clearIntervals();
    delElement(alpha.waldo);
    delElement(beta.waldo);
    clear(get("elements"));
    alpha.waldo = null;
    beta.waldo = null;
    makeBuildButtons(canvas);
    for (var sym in alpha.outReqs) {
        alpha.outReqs[sym] = 40;
    }
    for (var sym in beta.outReqs) {
        beta.outReqs[sym] = 40;
    }
}
function makebtns(greekMode, tagname, parent, text, left, top, name, funct, width, height) {
    var ret = makebtn(tagname, parent, text, left, top, funct, width, height);
    ret.classList.add('btn' + greekMode);
    ret.onclick = function () {
        deselBtns(get("buttonContainer"));
        ret.classList.add("selected");
        funct();
    }
    if (curSymbol == name) {
        ret.classList.add("selected");
    }
    ret.name = name;
    return ret;
}
function deselectAll() {
    for (var i = 0; i < alpha.symbols.length; i++) {
        var sym = alpha.symbols[i];
        sym.selected = false;
        sym.classList.remove("selected");
    }
    for (var i = 0; i < beta.symbols.length; i++) {
        var sym = beta.symbols[i];
        sym.selected = false;
        sym.classList.remove("selected");
    }
}
function makesym(tagname, parent, clazz, left, top, width, height, butts) {
    var ret = makesq(tagname, parent, clazz, left, top, width, height);
    ret.onclick = function (event) {
        deselectAll();
        ret.selected = true;
        ret.classList.add("selected");
        event.stopImmediatePropagation();
        showSymSpecificButtons(butts, ret);
        return false;
    }
    ret.draggable = true;
    ret.ondragstart = function (event) {
        event.dataTransfer.setData("text", ret.id);
    }
    return ret;
}
function showSymSpecificButtons(buttons, element) {
    if (buttons)
        buttons(element);
}

function run(canvas, moveTime, symbolTime) {
    if (alpha.startSymbol)
        runSetup(canvas, alpha, "Alpha");
    if (beta.startSymbol)
        runSetup(canvas, beta, "Beta");

    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();

    // Move
    window.moveInterval = window.setInterval(function () {
        if (alpha.startSymbol)
            moveRunTimer(alpha, "Alpha", timeInterval);
        if (beta.startSymbol)
            moveRunTimer(beta, "Beta", timeInterval);
        checkCollisions();
    }, moveTime);

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {
        if (alpha.startSymbol)
            activateRunTimer(alpha, "Alpha");
        if (beta.startSymbol)
            activateRunTimer(beta, "Beta");
        checkCollisions();
        cycles++;
        checkWin();
    }, symbolTime);
}
function checkCollisions() {
    var elementParent = get("elements");
    for (var el of elementParent.childNodes) {
        var elLeft = parseInt(el.style.left),
            elTop = parseInt(el.style.top);
        for (var el2 of elementParent.childNodes) {
            var el2Left = parseInt(el2.style.left),
                el2Top = parseInt(el2.style.top);
            if (el == el2)
                continue;
            if (elLeft < el2Left + 42 && elLeft + 42 > el2Left &&
                elTop < el2Top + 42 && elTop + 42 > el2Top) {
                stopGame(get('canvas'));
                alert("Collision between elements!");
            }
        }
        if (elLeft < 0 || elLeft + 42 > mapsizex ||
            elTop < 0 || elTop + 42 > mapsizey) {
            stopGame(get('canvas'));
            alert("Element outside of reactor!");
        }
    }
}
function checkWin() {
    var winGame = true;
    for (var symbol in alpha.outReqs) {
        if (alpha.outReqs[symbol] > 0) {
            winGame = false;
        }
    }
    for (var symbol in beta.outReqs) {
        if (beta.outReqs[symbol]  > 0) {
            winGame = false;
        }
    }
    if (winGame) {
        stopGame();
        alert("Mission successful. Total symbols: [" + (alpha.symbols.length + beta.symbols.length) +
            "]. Total cycles: [" + cycles + "]");
    }
}
function runSetup(canvas, greek, greekMode) {
    // don't recreate the waldo if changing timer intervals
    if (!greek.waldo) {
        greek.waldo = makesq('div', canvas, 'waldo ' + greekMode,
            greek.startSymbol.gridx * mapsizex / 10,
            greek.startSymbol.gridy * mapsizey / 8,
            mapsizex / 10 - 12, mapsizey / 8 - 12);
        greek.waldo.direction = greek.startSymbol.direction;
        greek.waldo.gridx = greek.startSymbol.gridx;
        greek.waldo.gridy = greek.startSymbol.gridy;
    }
}
function moveRunTimer(greek, greekMode, timeInterval) {

    var xDistTick = mapsizex / 10 / timeInterval,
        yDistTick = mapsizey / 8 / timeInterval;
    incLeft(greek.waldo, greek.waldo.direction.x * xDistTick);
    incTop(greek.waldo, greek.waldo.direction.y * yDistTick);
    if (greek.waldo.grabbedElement) {
        incLeft(greek.waldo.grabbedElement, greek.waldo.direction.x * xDistTick);
        incTop(greek.waldo.grabbedElement, greek.waldo.direction.y * yDistTick);
        for (var bonded of greek.waldo.grabbedElement.bonds) {
            incLeft(bonded, greek.waldo.direction.x * xDistTick);
            incTop(bonded, greek.waldo.direction.y * yDistTick);
        }
    }
}
function activateRunTimer(greek, greekMode) {
    greek.waldo.gridx += greek.waldo.direction.x;
    greek.waldo.gridy += greek.waldo.direction.y;
    if (greek.waldo.gridx < 0) greek.waldo.gridx = 0;
    if (greek.waldo.gridy < 0) greek.waldo.gridy = 0;
    if (greek.waldo.gridx > 9) greek.waldo.gridx = 9;
    if (greek.waldo.gridy > 9) greek.waldo.gridy = 9;
    greek.waldo.style.left = mapsizex / 10 * greek.waldo.gridx + "px";
    greek.waldo.style.top = mapsizey / 8 * greek.waldo.gridy + "px";
    if (greek.waldo.grabbedElement) {
        greek.waldo.grabbedElement.gridx = greek.waldo.gridx;
        greek.waldo.grabbedElement.gridy = greek.waldo.gridy;
        greek.waldo.grabbedElement.style.left = greek.waldo.style.left;
        greek.waldo.grabbedElement.style.top = greek.waldo.style.top;

        for (var bonded of greek.waldo.grabbedElement.bonds) {
            bonded.gridx += greek.waldo.direction.x;
            bonded.gridy += greek.waldo.direction.y;
            bonded.style.left = mapsizex / 10 * bonded.gridx + "px";
            bonded.style.top = mapsizey / 8 * bonded.gridy + "px";
        }
    }
    var arrowSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, true);
    var actionSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, false);
    if (arrowSym) {
        greek.waldo.direction = arrowSym.direction;
    }
    if (actionSym) {
        actionSym.performAction(greek, greekMode);
    }
    headerAlpha.innerHTML = makeHeader(alpha, "α");
    headerBeta.innerHTML = makeHeader(beta, "β");
    
}
function clearIntervals() {
    if (window.moveInterval) {
        window.clearInterval(moveInterval);
        window.moveInterval = null;
    }
    if (window.activateInterval) {
        window.clearInterval(activateInterval);
        window.activateInterval = null;
    }
}