window.onload = function () {
    get("begin").onclick = beginButtonFn;
    var levels = get("levels");
    for (var levelId in configs) {
        var level = configs[levelId];
        var btn = makebtn("button", levels, level.name, 0, 0, setConfig(configs[levelId]));
        btn.style.width = "100%";
    }
    window.levelName = "Water";
    var uniqueNameInput = get("uniqueNameInput");
    window.uniqueName = localStorage.getItem("uniqueName");
    uniqueNameInput.value = uniqueName;
    $.get("https://api.myjson.com/bins/p370d", function (data, textStatus, jqXHR) {
        window.levelWebData = data;
        if (!uniqueName) {
            window.uniqueName = Math.floor(Math.random() * 1000000)+"";
            localStorage.setItem("uniqueName", uniqueName);
            data.uniqueNames = data.uniqueNames || [];
            data.uniqueNames.push(uniqueName);
            updateWebData();
            uniqueNameInput.value = uniqueName;
        }
    });
    
}
window.changeUniqueName = function (un) {
    var newName = un.value;
    if (levelWebData.uniqueNames.indexOf(uniqueName)>=0) {
        levelWebData.uniqueNames.splice(levelWebData.uniqueNames.indexOf(uniqueName), 1);
        levelWebData.uniqueNames.push(newName);
        localStorage.setItem("uniqueName", newName);
        for (var level of configs) {
            if (levelWebData[level.name][uniqueName]) {
                levelWebData[level.name][newName] = levelWebData[level.name][uniqueName];
                delete levelWebData[level.name][uniqueName];
            }
        }
        uniqueName = newName;
        updateWebData();
    }
}
function beginButtonFn() {
    var beginButton = get("begin");
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
function setConfig(config) {
    return function () {
        window.levelName = config.name;
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
        sensor: config.sensor,
        fuser: config.fuser
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
    if (alpha.outReqs && alpha.outReqs.size == "large") {
        makesq('div', canvas, 'blk toprblock', mapsizex / 2 + mapsizex / 10, 0, mapsizex / 2 - mapsizex / 10, mapsizey);
    } else {
        makesq('div', canvas, 'blk toprblock', mapsizex / 2 + mapsizex / 10, 0, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
        makesq('div', canvas, 'blk bottomrblock', mapsizex / 2 + mapsizex / 10, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    }
    makesq('div', canvas, 'blk bottomlblock', 0, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    window.levelSquares = [];
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
            if (reactorFeatures.fuser && reactorFeatures.fuser.x == i && reactorFeatures.fuser.y == j) {
                makeFuser(sq);
            }
            levelSquares.push(sq);
        }
    }
    var reqDiv = get("reqs");
    var extra = makeInBox(reqDiv, alpha.in, alpha.mode, 0);
    makeInBox(reqDiv, beta.in, beta.mode, 100 + extra);
    makeInOutBox(reqDiv, alpha.outReqs.elements, alpha.outReqs.bonds, alpha.mode, 300, alpha.outReqs.size);
    if (!alpha.outReqs.size) {
        makeInOutBox(reqDiv, beta.outReqs.elements, beta.outReqs.bonds, beta.mode, 400);
    }
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
        else if (e.code === "KeyY") curSymbol = "Sync";
        else if (e.code === "KeyN") curSymbol = "Sensor";
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
    load();
    makeBottomButtons();
    makeDragSelectListeners();
}
function makeInBox(container, inProbs, greekMode, offsetx) {
    var extra = 0;
    for (var prob of inProbs) {
        if (prob.probability != 100) {
            var percent = make("div", container, "");
            percent.innerHTML = prob.probability + "%";
            percent.style.position = "absolute";
            percent.style.left = (offsetx+extra - 20) + "px";
        }
        makeInOutBox(container, prob.elements, prob.bonds, greekMode, offsetx + extra);
        extra += 100;
    }
    return extra - 100;
}
function makeInOutBox(container, elements, bonds, greekMode, offsetx, size) {
    var syms = [];
    var extra = size == "large" ? 4 : 0;
    for (var i = 0; i < 4 + extra; i++) {
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
function makeBottomButtons() {
    var buttonContainer = get('canvas'),
        buttonpos = -100;
    makebtn('button', buttonContainer, 'Back', -50 + (buttonpos += 155), mapsizey + 60, function () {
        location.reload();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Clear All', -50 + (buttonpos += 55), mapsizey + 60, function () {
        deleteAll(alpha);
        deleteAll(beta);
        save();
    });
    makebtn('button', buttonContainer, 'Swap Waldo Colors', -50 + (buttonpos += 155), mapsizey + 60, function () {
        var symswap = alpha.symbols;
        alpha.symbols = beta.symbols;
        beta.symbols = symswap;
        save();
        load();
    });
    makebtn('button', buttonContainer, 'Undo', -50 + (buttonpos += 155), mapsizey + 60, function () {
        var lastSave = localStorage.getItem(window.levelName + "last");
        lastSave--;
        if (lastSave < 1) {
            lastSave = 19;
        }
        localStorage.setItem(window.levelName + "last", lastSave);
        load();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Redo', -50 + (buttonpos += 55), mapsizey + 60, function () {
        var lastSave = localStorage.getItem(window.levelName + "last");
        lastSave++;
        if (lastSave >= 20) {
            lastSave = 1;
        }
        localStorage.setItem(window.levelName + "last", lastSave);
        load();
    }).style.width = "50px";
    var checkA = makecheck(buttonContainer, "visibleSymbols alpha",
        -50 + (buttonpos += 55), mapsizey + 60, "Alpha Visible");
    checkA.onclick = function () {
        toggleGreekVisibility(this, alpha);
    }
    var checkB = makecheck(buttonContainer, "visibleSymbols beta",
        -50 + (buttonpos), mapsizey + 85, "Beta Visible");
    checkB.onclick = function () {
        toggleGreekVisibility(this, beta);
    }
}
function makecheck(container, classes, x, y, text) {
    var checkContainer = make("div", container, "checkcontainer");
    var ret = make("input", checkContainer, "");
    var checkstyle = make("span", checkContainer, classes);
    var checkText = make("span", checkContainer, "");
    checkText.innerHTML = text;
    checkContainer.style.left = x + "px";
    checkContainer.style.top = y + "px";
    ret.checked = true;
    ret.type = "checkbox";

    return ret;
}
function toggleGreekVisibility(input, greek) {
    var newVisible = input.checked ? "block" : "none";
    for (var sym of greek.symbols) {
        sym.style.display = newVisible;
    }
    $(".line." + greek.mode).css("display", newVisible);
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
function makeFuser(sq) {
    var fuser = makesq('div', sq, 'sensor', 0, 0, (mapsizex / 5) - 13, (mapsizey / 8) - 12);
    fuser.gridx = sq.gridx;
    fuser.gridy = sq.gridy;
    fuser.type = "fuser";
    fuser.draggable = true;
    fuser.ondragstart = function () {
        event.dataTransfer.setData("text", fuser.id);
    }
    fuser.ondragover = null;
    fuser.ondrop = null;
    fuser.innerHTML = "<div class='innerfuser'>&#9654;</div><div class='innerfuser'>O</div>";
    reactorFeatures.fuser = fuser;
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
        if (symbol.nodeName == "BUTTON") {
            curSymbol = symbol.name;
            $(dropTarget).click();
            deselBtns(get("buttonContainer"));
            symbol.classList.add("selected");
        } else {
            if (!symbol.selected) {
                dropSymbolOnSquare(dropTarget, symbol);
            } else {
                var xdiff = dropTarget.gridx - symbol.gridx,
                    ydiff = dropTarget.gridy - symbol.gridy,
                    combinedSym = alpha.symbols.concat(beta.symbols);
                for (var sym of combinedSym) {
                    if (sym.selected) {
                        var diffDropSq = symAtCoords(levelSquares, {
                            x: sym.gridx + xdiff,
                            y: sym.gridy + ydiff
                        });
                        dropSymbolOnSquare(diffDropSq, sym);
                    }
                }
            }
        }
    }
}
function dropSymbolOnSquare(dropTarget, symbol) {
    dropTarget.appendChild(symbol);
    symbol.gridx = dropTarget.gridx;
    symbol.gridy = dropTarget.gridy;
    symbol.parentSquare = dropTarget;
    alpha.startSymbol && makePath(alpha.startSymbol.parentSquare, alpha);
    beta.startSymbol && makePath(beta.startSymbol.parentSquare, beta);
    save();
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
            save();
        }
    }
}

window.save = function() {
    var saveState = {
        alpha: saveGreek(alpha),
        beta: saveGreek(beta),
        reactorFeatures: saveReactorFeatures()
    };
    window.saveNumber = window.saveNumber || 0;
    saveNumber++;
    if (saveNumber >= 20) {
        saveNumber = 1;
    }
    localStorage.setItem(window.levelName + (saveNumber), JSON.stringify(saveState));
    localStorage.setItem(levelName + "last", saveNumber);
}
function saveReactorFeatures() {
    var saveFeatures = { bonders: []};
    if (reactorFeatures.bonders) {
        for (var bonder of reactorFeatures.bonders) {
            saveFeatures.bonders.push({ gridx: bonder.gridx, gridy: bonder.gridy });
        }
    }
    if (reactorFeatures.sensor) {
        saveFeatures.sensor = {
            gridx: reactorFeatures.sensor.gridx,
            gridy: reactorFeatures.sensor.gridy
        };
    }
    if (reactorFeatures.fuser) {
        saveFeatures.fuser = {
            gridx: reactorFeatures.fuser.gridx,
            gridy: reactorFeatures.fuser.gridy
        };
    }
    return saveFeatures;
}
function deleteAll(greek) {
    for (var i = greek.symbols.length - 1; i >= 0; i--) {
        var sym = greek.symbols[i];
        delElement(sym);
        greek.symbols.splice(i, 1);
    }
    deletePath(greek);
    greek.startSymbol = null;
}
function load() {
    var lastSave = localStorage.getItem(window.levelName + "last");
    window.saveNumber = parseInt(lastSave);
    var saveStateJSON = localStorage.getItem(window.levelName + lastSave);
    var saveState = JSON.parse(saveStateJSON);
    deleteAll(alpha);
    deleteAll(beta);
    if (saveState) {
        alpha.symbols = loadGreek(alpha, saveState.alpha);
        beta.symbols = loadGreek(beta, saveState.beta);
        alpha.startSymbol && makePath(alpha.startSymbol.parentSquare, alpha);
        beta.startSymbol && makePath(beta.startSymbol.parentSquare, beta);
        saveState.reactorFeatures = saveState.reactorFeatures || {};
        if (saveState.reactorFeatures.bonders) {
            for (var bonderId in saveState.reactorFeatures.bonders) {
                var dropTarget = symAtCoords(levelSquares, {
                    x: saveState.reactorFeatures.bonders[bonderId].gridx,
                    y: saveState.reactorFeatures.bonders[bonderId].gridy
                });
                dropSymbolOnSquare(dropTarget, reactorFeatures.bonders[bonderId]);
            }
        }
        if (saveState.reactorFeatures.sensor) {
            var dropTarget = symAtCoords(levelSquares, {
                x: saveState.reactorFeatures.sensor.gridx,
                y: saveState.reactorFeatures.sensor.gridy
            });
            dropSymbolOnSquare(dropTarget, reactorFeatures.sensor);
        }
        if (saveState.reactorFeatures.fuser) {
            var dropTarget = symAtCoords(levelSquares, {
                x: saveState.reactorFeatures.fuser.gridx,
                y: saveState.reactorFeatures.fuser.gridy
            });
            dropSymbolOnSquare(dropTarget, reactorFeatures.fuser);
        }
    }
}
function saveGreek(greek) {
    var symbols = [];
    for (var sym of greek.symbols) {
        var saveSym = window["saveSym" + sym.name](sym);
        symbols.push(saveSym);
    }
    return symbols;
}
function loadGreek(greek, saveState) {
    var symbols = [];
    for (var sym of saveState) {
        var sq = symAtCoords(levelSquares, { x: sym.gridx, y: sym.gridy }, false);
        var symEl = window["symbol" + sym.name].place(greek, sq);
        window["symLoad" + sym.name](symEl, sym);
        if (symEl) {
            symbols.push(symEl);
        }
    }
    return symbols;
}
window.saveBase = function (sym) {
    var ret = { gridx: sym.gridx, gridy: sym.gridy, name: sym.name };
    return ret;
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
            var oldDir = curLoc.dir;
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
            createPathEl(curLoc, oldDir, curLoc.dir);
        }
    }
    function createPathEl(curLoc, dir1, dir2) {
        var path;
        path = makesq('img', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, mapsizex / 10, mapsizey / 8);
        path.src = getPathSrc(dir1, dir2, greek.mode);
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
    function getPathSrc(d1, d2, greek) {
        var base = "img/";
        d1 = d1 || {};
        if ((!d1 || d1.y == 0) && d2.y == 0) return `${base}lr${greek}.png`;
        if ((!d1 || d1.x == 0) && d2.x == 0) return `${base}ud${greek}.png`;
        if (d1.x == 1 && d2.y == 1) return `${base}bl${greek}.png`;
        if (d1.x == -1 && d2.y == 1) return `${base}br${greek}.png`;
        if (d1.x == 1 && d2.y == -1) return `${base}tl${greek}.png`;
        if (d1.x == -1 && d2.y == -1) return `${base}tr${greek}.png`;
        if (d1.y == 1 && d2.x == 1) return `${base}tr${greek}.png`;
        if (d1.y == -1 && d2.x == 1) return `${base}br${greek}.png`;
        if (d1.y == 1 && d2.x == -1) return `${base}tl${greek}.png`;
        if (d1.y == -1 && d2.x == -1) return `${base}bl${greek}.png`;
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
    makebtns(greekMode, 'button', buttonContainer, 'Grab/Drop (g)', mapsizex + 10, buttonpos += 50, "Grab",
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
    if (reactorFeatures.fuser) {
        makebtns(greekMode, 'button', buttonContainer, 'Fuse (f)', mapsizex + 10, buttonpos += 50, "Fuse",
            function () { curSymbol = "Fuse" });
    }
    makebtns(greekMode, 'button', buttonContainer, '&#9650; (w)', mapsizex + 10, buttonpos += 50, "Up",
        function () { curSymbol = "Up" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '&#9660; (s)', mapsizex + 10 + 36, buttonpos, "Down",
        function () { curSymbol = "Down" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '&#9664; (a)', mapsizex + 10 + 37 + 36, buttonpos, "Left",
        function () { curSymbol = "Left" }, 40);
    makebtns(greekMode, 'button', buttonContainer, '&#9654; (d)', mapsizex + 10 + 37 + 36 + 37, buttonpos, "Right",
        function () { curSymbol = "Right" }, 40);
    makebtns(greekMode, 'button', buttonContainer, 'Switch (tab)', mapsizex + 10, buttonpos += 50, "",
        function () {
            switchGreek(greekMode, canvas);
        });
    makebtn('button', buttonContainer, 'Run', mapsizex + 10, buttonpos += 60, function () {
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
    ret.draggable = true;
    ret.onclick = function () {
        deselBtns(get("buttonContainer"));
        ret.classList.add("selected");
        funct();
    }
    ret.ondragstart = function (event) {
        event.dataTransfer.setData("text", ret.id);
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
        if (!ret.selected) {
            deselectAll();
        }
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
            activateMoveRunTimer(alpha, "Alpha");
        if (beta.startSymbol)
            activateMoveRunTimer(beta, "Beta");
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
        var symbols = alpha.symbols.length + beta.symbols.length;
        clearIntervals();
        $.get("https://api.myjson.com/bins/p370d", function (data, textStatus, jqXHR) {
            window.levelWebData = data;
            levelWebData[levelName] = levelWebData[levelName] || {};
            var records = levelWebData[levelName][uniqueName] || {};
            if (records.symbols) {
                if (symbols < records.symbols) {
                    records.symbols = symbols;
                }
                if (cycles < records.cycles) {
                    records.cycles = cycles;
                }
            } else {
                records.cycles = cycles;
                records.symbols = symbols;
            }
            levelWebData[levelName][uniqueName] = records;
            openHighScores();
            updateWebData();
            stopGame(get("canvas"));
        });
    }
}
function updateWebData() {
    $.ajax({
        url: "https://api.myjson.com/bins/p370d",
        type: "PUT",
        data: JSON.stringify(levelWebData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            window.levelWebData = data;
        }
    }); 
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
function activateMoveRunTimer(greek, greekMode) {
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
    }
}
function activateRunTimer(greek, greekMode) {
    if (greek.waldo.action == "move") {
        
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
