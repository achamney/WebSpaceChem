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
    window.mapsizex = 600;
    window.mapsizey = 480;
    window.elementRadius = 20;
    var canvas = get('canvas');
    window.curSymbol = 'Start';
    window.greekMode = "Alpha";
    window.cycles = 0;
    window.alpha = {
        paths: [], symbols: [], in: config.alpha.in, outReqs: config.alpha.outReqs
    };
    window.beta = {
        paths: [], symbols: [], in: config.beta.in, outReqs: config.beta.outReqs
    };

    makeBuildButtons(canvas);

    window.headerBeta = make("h2", get('body'), '', true);
    headerBeta.innerHTML = makeHeader(beta, "β");
    window.headerAlpha = make("h2", get('body'), '', true);
    headerAlpha.innerHTML = makeHeader(alpha, "α");

    makesq('div', canvas, 'blk toplblock', 0, 0, mapsizex / 2, mapsizey / 2);
    makesq('div', canvas, 'blk toprblock', mapsizex / 2, 0, mapsizex / 2, mapsizey / 2);
    makesq('div', canvas, 'blk bottomlblock', 0, mapsizey / 2, mapsizex / 2, mapsizey / 2);
    makesq('div', canvas, 'blk bottomrblock', mapsizex / 2, mapsizey / 2, mapsizex / 2, mapsizey / 2);

    for (var i = 0; i < 8; i++) {

        for (var j = 0; j < 8; j++) {
            var sq = makesq('div', canvas, 'square', i * (mapsizex / 8), j * (mapsizey / 8), mapsizex / 8, mapsizey / 8);
            setSqListeners(sq);
            sq.gridx = i;
            sq.gridy = j;
        }
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
            clear(sq);
            if (greek().startSymbol) {
                clear(greek().startSymbol.parentSquare);
            }
            sym = makesym('div', sq, 'symbol start ' + greekMode, 0, 0, 50, 50, createStartSubButtons(greek()));
            sym.direction = { x: -1, y: 0 };
            sym.performAction = function () { };
            setGrid(sym, sq, sq);
            greek().startSymbol = sym;
        } else if (curSymbol == "Left") {
            sym = makesym('div', arrows, 'symbol left ' + greekMode, sq.gridx * mapsizex / 8, sq.gridy * mapsizey / 8,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, arrows);
            sym.arrow = true;
            sym.direction = { x: -1, y: 0 };
        } else if (curSymbol == "Right") {
            sym = makesym('div', arrows, 'symbol right ' + greekMode, sq.gridx * mapsizex / 8, sq.gridy * mapsizey / 8,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, arrows);
            sym.arrow = true;
            sym.direction = { x: 1, y: 0 };
        } else if (curSymbol == "Up") {
            sym = makesym('div', arrows, 'symbol up ' + greekMode, sq.gridx * mapsizex / 8, sq.gridy * mapsizey / 8,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, arrows);
            sym.arrow = true;
            sym.direction = { x: 0, y: -1 };
        } else if (curSymbol == "Down") {
            sym = makesym('div', arrows, 'symbol down ' + greekMode, sq.gridx * mapsizex / 8, sq.gridy * mapsizey / 8,
                20, 20, makeDelButton(greek()));
            setGrid(sym, sq, arrows);
            sym.arrow = true;
            sym.direction = { x: 0, y: 1 };
        } else if (curSymbol == "In") {
            sym = makesym('div', sq, 'symbol in In' + greekMode+' ' +greekMode, 0, 0, 50, 50, createInSubButtons(greek()));
            sym.greek = greekMode;
            sym.performAction = function (greekName, greekMode) {
                for (var inEl of greek(sym.greek).in) {
                    var element = makesym('div', elements, 'element ' + inEl.name,
                        inEl.location.x * mapsizex / 8,
                        inEl.location.y * mapsizey / 8,
                        20, 20, function () { });
                    element.gridx = inEl.location.x;
                    element.gridy = inEl.location.y;
                    element.symbol = inKey;
                }
            };
            setGrid(sym, sq, sq);
        } else if (curSymbol == "Out") {
            sym = makesym('div', sq, 'symbol out Out' + greekMode + ' ' + greekMode, 0, 0, 50, 50, createOutSubButtons(greek()));
            sym.greek = greekMode;
            sym.performAction = function (greekName, g) {
                for (var i = 0; i < elements.childNodes.length; i++) {
                    var element = elements.childNodes[i];
                    if (!element.grabbed) {
                        if (sym.greek == "Alpha" && element.gridx > 3 && element.gridy < 4) {
                            delElement(element);
                            alpha.outReqs[element.symbol]--;
                        }
                        else if (sym.greek == "Beta" && element.gridx > 3 && element.gridy >= 4) {
                            delElement(element);
                        }
                    }
                }
            };
            setGrid(sym, sq, sq);
        } else if (curSymbol == "Grab") {
            sym = makesym('div', sq, 'symbol grabdrop ' + greekMode, 0, 0, 50, 50, createGrabSubButtons(greek()));
            sym.greek = greekMode;
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
        }
        greek().symbols.push(sym);
        if (greek().startSymbol) {
            makePath(greek().startSymbol.parentSquare, greek());
        }
    }
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
function makePath(start, greek) {
    var curLoc = { x: start.gridx, y: start.gridy, dir: greek.startSymbol.direction },
        curSym,
        newCurLoc = curLoc;
    deletePath(greek);
    while (newCurLoc.x >= 0 && newCurLoc.x < 8 && newCurLoc.y >= 0 && newCurLoc.y < 8) {
        var path, newCurLoc;
        curSym = symAtCoords(greek.symbols, curLoc, "arrow");
        if (curSym && curSym.arrow) {
            curLoc.dir = curSym.direction;
        }
        if (hasThisPath(greek.paths, curLoc)) {
            break;
        }
        if (curLoc.dir.x != 0)
            path = makesq('div', start.parentNode, 'blk line ' + greekMode, curLoc.x * mapsizex / 8, curLoc.y * mapsizey / 8, mapsizex / 8, 10);
        else
            path = makesq('div', start.parentNode, 'blk line ' + greekMode, curLoc.x * mapsizex / 8, curLoc.y * mapsizey / 8, 10, mapsizey / 8);
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
    if (name == "Alpha" || greekMode == "Alpha")
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
    buttonContainer.id = "buttonContainer";
    makebtns(greekMode, 'button', buttonContainer, 'Start (r)', mapsizex + 10, buttonpos += 50, function () { curSymbol = "Start" });
    makebtns(greekMode, 'button', buttonContainer, 'In (i)', mapsizex + 10, buttonpos += 50,
        function () { curSymbol = "In" }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Out (o)', mapsizex + 85, buttonpos,
        function () { curSymbol = "Out" }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Grab (g)', mapsizex + 10, buttonpos += 50,
        function () { curSymbol = "Grab" });
    makebtns(greekMode, 'button', buttonContainer, 'Bond (b)', mapsizex + 10, buttonpos += 50,
        function () { curSymbol = "Bond" });
    makebtns(greekMode, 'button', buttonContainer, '^ (w)', mapsizex + 10, buttonpos += 50,
        function () { curSymbol = "Up" }, 40);
    makebtns(greekMode, 'button', buttonContainer, 'v (s)', mapsizex + 10 + 40, buttonpos,
        function () { curSymbol = "Down" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '<- (a)', mapsizex + 10 + 80, buttonpos,
        function () { curSymbol = "Left" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '-> (d)', mapsizex + 10 + 120, buttonpos,
        function () { curSymbol = "Right" }, 40);
    makebtns(greekMode, 'button', buttonContainer, 'Switch (t)', mapsizex + 10, buttonpos += 50, function () {
        if (greekMode == 'Alpha') {
            greekMode = 'Beta';
        } else {
            greekMode = 'Alpha'
        }
        makeBuildButtons(canvas);
    });
    makebtn('button', buttonContainer, 'Simulate', mapsizex, buttonpos += 60, function () {
        makeRunButtons(canvas);
        run(canvas);
    });
}
function makeRunButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = get('buttonContainer');
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
    }
    clear(buttonContainer);
    buttonContainer.id = "buttonContainer";
    
    makebtn('button', buttonContainer, 'Stop', mapsizex, buttonpos += 50, function () {
        stopGame(canvas);
    });
    makebtn('button', buttonContainer, 'Pause', mapsizex, buttonpos += 50, function () {
        clearIntervals();
    });
    makebtn('button', buttonContainer, 'Speed x 1', mapsizex, buttonpos += 50, function () {
        run(canvas);
    });
    makebtn('button', buttonContainer, 'Speed x 2', mapsizex, buttonpos += 50, function () {
        run(canvas, 20, 500);
    });
    makebtn('button', buttonContainer, 'Speed x 5', mapsizex, buttonpos += 50, function () {
        run(canvas, 20, 200);
    });
    makebtn('button', buttonContainer, 'Speed x 50', mapsizex, buttonpos += 50, function () {
        run(canvas, 2000, 20);
    });
    makebtn('button', buttonContainer, 'Speed x 500', mapsizex, buttonpos += 50, function () {
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
function makebtns(greekMode, tagname, parent, text, left, top, funct, width, height) {
    var ret = makebtn(tagname, parent, text, left, top, funct, width, height);
    ret.classList.add('btn' + greekMode);
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
    return ret;
}
function showSymSpecificButtons(buttons, element) {
    if (buttons)
        buttons(element);
}

function run(canvas, moveTime, symbolTime) {
    runSetup(canvas, alpha, "Alpha");
    runSetup(canvas, beta, "Beta");

    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();

    // Move
    window.moveInterval = window.setInterval(function () {
        moveRunTimer(alpha, "Alpha", timeInterval);
        moveRunTimer(beta, "Beta", timeInterval);
        checkCollisions();
    }, moveTime);

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {
        activateRunTimer(alpha, "Alpha");
        activateRunTimer(beta, "Beta");
        checkCollisions();
        cycles++;
        checkWin();
    }, symbolTime);
}
function checkCollisions() {
    var elementParent = get("elements");
    for (var el of elementParent.childNodes) {
        for (var el2 of elementParent.childNodes) {
            if (el == el2)
                continue;
            if (el.style.left < el2.style.left + 42 && el.style.left + 42 > el2.style.left &&
                el.style.top < el2.style.top + 42 && el.style.top + 42 > el2.style.top) {
                stopGame(get('canvas'));
                alert("Collision between elements!");
            }
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
            greek.startSymbol.gridx * mapsizex / 8,
            greek.startSymbol.gridy * mapsizey / 8,
            mapsizex / 8 - 12, mapsizey / 8 - 12);
        greek.waldo.direction = greek.startSymbol.direction;
        greek.waldo.gridx = greek.startSymbol.gridx;
        greek.waldo.gridy = greek.startSymbol.gridy;
    }
}
function moveRunTimer(greek, greekMode, timeInterval) {

    var xDistTick = mapsizex / 8 / timeInterval,
        yDistTick = mapsizey / 8 / timeInterval;
    incLeft(greek.waldo, greek.waldo.direction.x * xDistTick);
    incTop(greek.waldo, greek.waldo.direction.y * yDistTick);
    if (greek.waldo.grabbedElement) {
        incLeft(greek.waldo.grabbedElement, greek.waldo.direction.x * xDistTick);
        incTop(greek.waldo.grabbedElement, greek.waldo.direction.y * yDistTick);
    }
}
function activateRunTimer(greek, greekMode) {
    greek.waldo.gridx += greek.waldo.direction.x;
    greek.waldo.gridy += greek.waldo.direction.y;
    if (greek.waldo.gridx < 0) greek.waldo.gridx = 0;
    if (greek.waldo.gridy < 0) greek.waldo.gridy = 0;
    if (greek.waldo.gridx > 7) greek.waldo.gridx = 7;
    if (greek.waldo.gridy > 7) greek.waldo.gridy = 7;
    greek.waldo.style.left = mapsizex / 8 * greek.waldo.gridx + "px";
    greek.waldo.style.top = mapsizey / 8 * greek.waldo.gridy + "px";
    if (greek.waldo.grabbedElement) {
        greek.waldo.grabbedElement.gridx = greek.waldo.gridx;
        greek.waldo.grabbedElement.gridy = greek.waldo.gridy;
        greek.waldo.grabbedElement.style.left = greek.waldo.style.left;
        greek.waldo.grabbedElement.style.top = greek.waldo.style.top;
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
    }
    if (window.activateInterval) {
        window.clearInterval(activateInterval);
    }
}