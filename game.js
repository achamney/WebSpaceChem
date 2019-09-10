window.onload = function () {
    var beginButton = get("begin");
    beginButton.onclick = function () {
        var config = get("config");
        try {
            var configJson = JSON.parse(config.value);
            beginButton.style.display = "none";
            config.style.display = "none";
            get("configContainer").style.display = "none";
            loadGame(configJson);
        } catch (e) {
            alert("Error parsing configuration file, try again");
        }
    }
    var levels = get("levels");
    for (var levelId in configs) {
        var level = configs[levelId];
        var btn = makebtn("button", levels, level.name, 0, 0, setConfig(configs[levelId]));
        btn.style.width = "100%";
    }
}
function setConfig(config) {
    return function () {
        get("config").value = JSON.stringify(config, null, 4);
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
        inBonds: config.alpha.inBonds,
        mode: "Alpha"
    };
    window.beta = {
        paths: [], symbols: [], in: config.beta.in, outReqs: config.beta.outReqs,
        inBonds: config.beta.inBonds,
        mode: "Beta"
    };
    window.reactorFeatures = {
        bonderData: config.bonders || [],
        bonders: [],
        sensor: config.sensor
    }
    if (alpha.outReqs) {
        alpha.outReqs.maxCount = alpha.outReqs.count;
    }
    if (beta.outReqs) {
        beta.outReqs.maxCount = beta.outReqs.count;
    }
    window.mode = alpha;

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
            for (var bonder of reactorFeatures.bonderData) {
                if (bonder.x == i && bonder.y == j) {
                    makeBonder(sq);
                }
            }
            if (reactorFeatures.sensor && reactorFeatures.sensor.x == i && reactorFeatures.sensor.y == j) {
                makeSensor(sq);
            }
        }
    }
    var reqDiv = get("reqs");
    makeInOutBox(reqDiv, alpha.in, alpha.inBonds, alpha.mode, 0);
    makeInOutBox(reqDiv, beta.in, beta.inBonds, beta.mode, 100);
    makeInOutBox(reqDiv, alpha.outReqs.elements, alpha.outReqs.bonds, alpha.mode, 300);
    makeInOutBox(reqDiv, beta.outReqs.elements, beta.outReqs.bonds, beta.mode, 400);
    document.addEventListener('keydown', (e) => {
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
function makeInOutBox(container, elements, bonds, greekMode, offsetx) {
    var syms = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var sq = makesq('div', container, 'square ' + greekMode, i * 20 + offsetx, j * 20, 20, 20);
            if (elements) {
                for (var el of elements) {
                    if (i == el.x && j == el.y) {
                        var sym = makesym('div', sq, 'element ' + el.name,
                            0,
                            0,
                            20, 20, function () { });
                        sym.gridx = i;
                        sym.gridy = j;
                        sym.innerHTML = el.name;
                        sym.elId = el.id;
                        syms.push(sym);
                    }
                }
            }
        }
    }
    if (bonds && bonds.length > 0) {
        for (var sym of syms) {
            var elBonds = bonds.filter(b => b.left == sym.elId);
            for (var bond of elBonds) {
                for (var i = 0; i < bond.count; i++) {
                    sym.bonds.push(syms.filter(s => s.elId == bond.right)[0]);
                }
            }
            adjustBondBars(sym, 3);
        }
    }
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
    reactorFeatures.bonders.push(bonder);
    bonder.innerHTML = "+ - <sup>" + reactorFeatures.bonders.length+"</sup>";
}
function makeSensor(sq) {
    var sensor = makesq('div', sq, 'sensor', 0, 0, (mapsizex / 10) - 13, (mapsizey / 8) - 12);
    sensor.gridx = sq.gridx;
    sensor.gridy = sq.gridy;
    sensor.type = "sensor";
    sensor.draggable = true;
    sensor.ondragstart = function () {
        event.dataTransfer.setData("text", sensor.id);
    }
    sensor.ondragover = null;
    sensor.ondrop = null;
    sensor.innerHTML = "<div class='innersensor'>O</div>";
    reactorFeatures.sensor = sensor;
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
    var ret = "";
    ret += greekSymbol + " ";
    if (greek.outReqs.elements) {
        ret += "outs remaining : " + greek.outReqs.count;
    }
    return ret;
}

function setSqListeners(sq) {
    sq.onclick = function () {
        var sym = window["symbol" + curSymbol].place(greek(), sq);
        if (sym) {
            greek().symbols.push(sym);
            if (greek().startSymbol) {
                makePath(greek().startSymbol.parentSquare, greek());
            }
        }
    }
}

window.setGrid = function (sym, sq, parent) {
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
window.makePath = function(start, greek, greekMode) {
    var curLoc = { x: start.gridx, y: start.gridy, dir: greek.startSymbol.direction },
        curSym,
        newCurLoc = curLoc;
    deletePath(greek);
    function innerMakePath(curLoc, curSym) {
        while (curLoc.x >= 0 && curLoc.x < 10 && curLoc.y >= 0 && curLoc.y < 8) {
            curSym = symAtCoords(greek.symbols, curLoc, "arrow");
            var sensSym = symAtCoords(greek.symbols, curLoc);
            if (sensSym && sensSym.sensor) {
                var cloneCurLoc = clone(curLoc);
                cloneCurLoc.dir = sensSym.direction;
                createPathEl(cloneCurLoc);
                innerMakePath(cloneCurLoc, curSym);
            }
            if (curSym && curSym.arrow) {
                curLoc.dir = curSym.direction;
            }
            if (hasThisPath(greek.paths, curLoc)) {
                break;
            }
            createPathEl(curLoc);
        }
    }
    function createPathEl(curLoc) {
        var path;
        if (curLoc.dir.x != 0)
            path = makesq('div', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, mapsizex / 10, 10);
        else
            path = makesq('div', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, 10, mapsizey / 8);
        curLoc.path = path;
        var newCurLoc = clone(curLoc);
        greek.paths.push(newCurLoc);
        curLoc.x += curLoc.dir.x;
        curLoc.y += curLoc.dir.y;
    }
    innerMakePath(curLoc, curSym, newCurLoc);
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
window.symAtCoords = function(symbols, location, arrow) {
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
window.greek = function(name) {
    if (name == "Beta")
        return beta;
    if (name == "Alpha" || mode == alpha)
        return alpha;
    return beta;
}
window.greekOpposite = function (name) {
    if (name == "Beta")
        return alpha;
    if (name == "Alpha" )
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
    if (reactorFeatures.bonderData && reactorFeatures.bonderData.length > 0) {
        makebtns(greekMode, 'button', buttonContainer, 'Bond (b)', mapsizex + 10, buttonpos += 50, "Bond",
            function () { curSymbol = "Bond" });
    }
    makebtns(greekMode, 'button', buttonContainer, 'Rotate (t)', mapsizex + 10, buttonpos += 50, "Rotate",
        function () { curSymbol = "Rotate" });
    makebtns(greekMode, 'button', buttonContainer, 'Sync (y)', mapsizex + 10, buttonpos += 50, "Sync",
        function () { curSymbol = "Sync" });
    if (reactorFeatures.sensor) {
        makebtns(greekMode, 'button', buttonContainer, 'Sensor (n)', mapsizex + 10, buttonpos += 50, "Sensor",
            function () { curSymbol = "Sensor" });
    }
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
    alpha.outReqs.count = alpha.outReqs.maxCount;
    beta.outReqs.count = beta.outReqs.maxCount;
    cycles = 0;
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
    ret.bondBars = [];
    ret.bonds = [];
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
    if (moveTime < symbolTime) {
        window.moveInterval = window.setInterval(function () {
            if (alpha.startSymbol)
                moveRunTimer(alpha, "Alpha", timeInterval);
            if (beta.startSymbol)
                moveRunTimer(beta, "Beta", timeInterval);
            checkCollisions();
        }, moveTime);
    }

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {
        if (alpha.startSymbol)
            activateRunTimer(alpha, "Alpha");
        if (beta.startSymbol)
            activateRunTimer(beta, "Beta");
        checkCollisions();
        headerAlpha.innerHTML = makeHeader(alpha, "α");
        headerBeta.innerHTML = makeHeader(beta, "β");
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
        if (elLeft < -10 || elLeft + 42 > mapsizex ||
            elTop < -10 || elTop + 42 > mapsizey) {
            stopGame(get('canvas'));
            alert("Element outside of reactor!");
        }
    }
}
function checkWin() {
    var winGame = true;
    if (alpha.outReqs.count && alpha.outReqs.count > 0) {
        winGame = false;
    }
    
    if (beta.outReqs.count && beta.outReqs.count  > 0) {
        winGame = false;
    }
    
    if (winGame) {
        alert("Mission successful. Total symbols: [" + (alpha.symbols.length + beta.symbols.length) +
            "]. Total cycles: [" + cycles + "]");
        stopGame(get("canvas"));
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
        greek.waldo.action = "move";
    }
}
function moveRunTimer(greek, greekMode, timeInterval) {

    var xDistTick = mapsizex / 10 / timeInterval,
        yDistTick = mapsizey / 8 / timeInterval;
    if (greek.waldo.action == "move") {
        incLeft(greek.waldo, greek.waldo.direction.x * xDistTick);
        incTop(greek.waldo, greek.waldo.direction.y * yDistTick);
        if (greek.waldo.grabbedElement) {
            traverseBonds(greek.waldo.grabbedElement, function (bonded) {
                incLeft(bonded, greek.waldo.direction.x * xDistTick);
                incTop(bonded, greek.waldo.direction.y * yDistTick);
            });
        }
    } else if (greek.waldo.action == "clock" || greek.waldo.action == "counter") {
        rotateMoveElements(greek, timeInterval);
    }
}
function activateRunTimer(greek, greekMode) {
    if (greek.waldo.action == "move") {
        greek.waldo.gridx += greek.waldo.direction.x;
        greek.waldo.gridy += greek.waldo.direction.y;
        if (greek.waldo.gridx < 0) greek.waldo.gridx = 0;
        if (greek.waldo.gridy < 0) greek.waldo.gridy = 0;
        if (greek.waldo.gridx > 9) greek.waldo.gridx = 9;
        if (greek.waldo.gridy > 7) greek.waldo.gridy = 7;
        greek.waldo.style.left = mapsizex / 10 * greek.waldo.gridx + "px";
        greek.waldo.style.top = mapsizey / 8 * greek.waldo.gridy + "px";
        if (greek.waldo.grabbedElement) {
            traverseBonds(greek.waldo.grabbedElement, function (bonded) {
                bonded.gridx += greek.waldo.direction.x;
                bonded.gridy += greek.waldo.direction.y;
                bonded.style.left = mapsizex / 10 * bonded.gridx + "px";
                bonded.style.top = mapsizey / 8 * bonded.gridy + "px";
            });
        }
        var arrowSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, true);
        var actionSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, false);
        if (arrowSym) {
            greek.waldo.direction = arrowSym.direction;
        }
        if (actionSym) {
            actionSym.performAction(greek, greekMode);
        }
    } else if (greek.waldo.action == "counter" || greek.waldo.action == "clock") {
        rotateActionElements(greek);
        //adjustBondBars
        greek.waldo.action = "move";
    } else if (greek.waldo.action == "sync") {
        var oppoGreek = greekOpposite(greek.mode);
        if (oppoGreek.waldo.action == "sync") {
            greek.waldo.action = "move";
            oppoGreek.waldo.action = "move";
        }
    } else {
        var actionSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, false);
        if (actionSym) {
            actionSym.performAction(greek, greekMode);
        }
    }
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

window.traverseBonds = function(el, visit) {
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
