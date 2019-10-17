window.onload = function () {
    get("begin").onclick = beginButtonFn;
    var levels = get("levels");
    var sections = {};
    for (var levelId in configs) {
        var level = configs[levelId];
        if (!sections[level.section]) {
            makeSection(level);
        }
        sections[level.section] = true;
    }
    for (var levelId in configs) {
        var level = configs[levelId];
        var section = $("div[data-id='levelSection" + level.section + "']")[0]
        var btn = makebtn("button", section, level.name, 0, 0, setConfig(configs[levelId]));
        btn.style.width = "100%";
    }
    window.levelName = "Water";
    var uniqueNameInput = get("uniqueNameInput");
    window.uniqueName = localStorage.getItem("uniqueName");
    uniqueNameInput.value = uniqueName;
    getLevelWebData(data => {
        window.levelWebData = data;
        if (!uniqueName) {
            window.uniqueName = Math.floor(Math.random() * 1000000) + "";
            localStorage.setItem("uniqueName", uniqueName);
            uniqueNameInput.value = uniqueName;
            makeNewSave(uniqueName);
        }
        getPersonalData();
    });
    function makeNewSave(uniqueName) {
        window.personalData = { levels: [] };
        $.ajax({
            url: "https://api.myjson.com/bins",
            type: "POST",
            data: JSON.stringify(personalData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var uri = data.uri.split("/");
                levelWebData.uniqueNames.push({ name: uniqueName, id: uri[uri.length - 1] });
                updateWebData();
            }
        });
    }
    function makeSection(level) {
        var levels = get("levels");
        var sectionHeader = make("div", levels, "sectionHeader");
        sectionHeader.innerHTML = level.section + " <span style='float:right'>&#9660;</span>";
        sectionHeader.onclick = function () {
            var sectionCont = $("div[data-id='levelSection" + level.section + "']")[0];
            if(sectionCont.style.display == "none") {
                sectionCont.style.display = "block";
            } else {
                sectionCont.style.display = "none";
            }
        };
        var sectionCont = $(make("div", levels, "levelSection"));
        sectionCont.attr("data-id", "levelSection" + level.section);
        sectionCont.css("display", "none");
    }
}
window.changeUniqueName = function (un) {
    var newName = un.value;
    var user = levelWebData.uniqueNames.filter(n => n.name == uniqueName)[0];
    var newUser = levelWebData.uniqueNames.filter(n => n.name == newName)[0];
    if (user && !newUser) {
        user.name = newName;
        uniqueName = newName;
        updateWebData();
    } else if (newUser) {
        localStorage.setItem("uniqueName", newName);
        location.reload();
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
        loadGame(configJson, 'canvas', { id: "" });
        if (!configJson.production) {
            load();
        }
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
window.cycles = 0;
function loadGame(config, container, reactor) {
    var canvas = get(container);
    window.mapsizex = 750;
    window.mapsizey = 480;
    window.elementRadius = 20;
    window.curSymbol = 'Start';
    cycles = 0;
    if (config.production) {
        return loadProduction(config);
    }
    if (!reactor.alpha) {
        reactor.alpha = {
            paths: [], symbols: [], in: config.alpha.in, outReqs: config.alpha.outReqs,
            inBonds: config.alpha.inBonds,
            mode: "Alpha",
            reactorId: reactor.id
        };
        reactor.beta = {
            paths: [], symbols: [], in: config.beta.in, outReqs: config.beta.outReqs,
            inBonds: config.beta.inBonds,
            mode: "Beta",
            reactorId: reactor.id
        };
        reactor.reactorFeatures = {
            bonderData: config.bonders || [],
            bonders: [],
            sensor: config.sensor,
            fuser: config.fuser
        }
        if (reactor.alpha.outReqs) {
            reactor.alpha.outReqs.maxCount = reactor.alpha.outReqs.count;
        }
        if (reactor.beta.outReqs) {
            reactor.beta.outReqs.maxCount = reactor.beta.outReqs.count;
        }
        reactor.mode = reactor.alpha;
    } else {
        reactor.reactorFeatures.bonders = [];
    }
    window.curReactor = reactor;
    makeUI(reactor, canvas);
    makeKeyListeners(reactor, canvas);
}
function makeUI(reactor, canvas) {

    makeBottomButtons(canvas);
    makeBuildButtons(canvas);

    reactor.headerBeta = make("h2", canvas, 'req2', true);
    reactor.headerBeta.innerHTML = makeHeader(reactor.beta, "&beta;");
    reactor.headerAlpha = make("h2", canvas, 'req1', true);
    reactor.headerAlpha.innerHTML = makeHeader(reactor.alpha, "&alpha;");

    makesq('div', canvas, 'blk toplblock', 0, 0, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    if (reactor.alpha.outReqs && reactor.alpha.outReqs.size == "large") {
        makesq('div', canvas, 'blk toprblock', mapsizex / 2 + mapsizex / 10, 0, mapsizex / 2 - mapsizex / 10, mapsizey);
    } else {
        makesq('div', canvas, 'blk toprblock', mapsizex / 2 + mapsizex / 10, 0, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
        makesq('div', canvas, 'blk bottomrblock', mapsizex / 2 + mapsizex / 10, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    }
    makesq('div', canvas, 'blk bottomlblock', 0, mapsizey / 2, mapsizex / 2 - mapsizex / 10, mapsizey / 2);
    reactor.levelSquares = [];
    for (var i = 0; i < 10; i++) {

        for (var j = 0; j < 8; j++) {
            var sq = makesq('div', canvas, 'square', i * (mapsizex / 10), j * (mapsizey / 8), mapsizex / 10, mapsizey / 8,
                dropSymSq(sq));
            setSqListeners(sq);
            sq.gridx = i;
            sq.gridy = j;
            for (var bonder of reactor.reactorFeatures.bonderData) {
                if (bonder.x == i && bonder.y == j) {
                    makeBonder(sq, bonder);
                }
            }
            if (reactor.reactorFeatures.sensor && reactor.reactorFeatures.sensor.x == i && reactor.reactorFeatures.sensor.y == j) {
                makeSensor(sq);
            }
            if (reactor.reactorFeatures.fuser && reactor.reactorFeatures.fuser.x == i && reactor.reactorFeatures.fuser.y == j) {
                makeFuser(sq);
            }
            reactor.levelSquares.push(sq);
        }
    }
    makeRequirements(canvas, reactor);
}
window.makeRequirements = function (canvas, reactor) {
    var reqDiv = $(canvas).find('.reqs')[0];
    clear(reqDiv);
    var extra = makeInBox(reqDiv, reactor.alpha.in, reactor.alpha.mode, 0);
    makeInBox(reqDiv, reactor.beta.in, reactor.beta.mode, 100 + extra);
    makeInOutBox(reqDiv, reactor.alpha.outReqs.elements, reactor.alpha.outReqs.bonds, reactor.alpha.mode, 300, reactor.alpha.outReqs.size);
    if (!reactor.alpha.outReqs.size) {
        makeInOutBox(reqDiv, reactor.beta.outReqs.elements, reactor.beta.outReqs.bonds, reactor.beta.mode, 400);
    }
}
function makeKeyListeners(reactor, canvas) {
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
        else if (e.code === "Tab") switchGreek(reactor.mode.mode, canvas);
        else if (e.code === "Space") {
            if (reactor.alpha.waldo && activateInterval) {
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
        var buttonContainer = $(canvas).find('.buttonContainer')[0];
        deselBtns(buttonContainer);
        for (var child of buttonContainer.childNodes) {
            if (child.name == curSymbol) {
                child.classList.add("selected");
            }
        }
    });
    makeDragSelectListeners(canvas);
}
function makeInBox(container, inProbs, greekMode, offsetx) {
    var extra = 0;
    for (var prob of inProbs) {
        if (prob.probability != 100) {
            var percent = make("div", container, "");
            percent.innerHTML = prob.probability + "%";
            percent.style.position = "absolute";
            percent.style.left = (offsetx + extra - 20) + "px";
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
                        sym.draggable = false;
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
function makeBottomButtons(parentContainer) {
    var buttonContainer = parentContainer,
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
        var symswap = curReactor.alpha.symbols;
        curReactor.alpha.symbols = curReactor.beta.symbols;
        curReactor.beta.symbols = symswap;
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
        saveCurReactor = curReactor;
        load();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Redo', -50 + (buttonpos += 55), mapsizey + 60, function () {
        var lastSave = localStorage.getItem(window.levelName + "last");
        lastSave++;
        if (lastSave >= 20) {
            lastSave = 1;
        }
        localStorage.setItem(window.levelName + "last", lastSave);
        saveCurReactor = curReactor;
        load();
    }).style.width = "50px";
    var checkA = makecheck(buttonContainer, "visibleSymbols alpha",
        -50 + (buttonpos += 55), mapsizey + 60, "Alpha Visible");
    checkA.onclick = function () {
        toggleGreekVisibility(this, curReactor.alpha);
    }
    var checkB = makecheck(buttonContainer, "visibleSymbols beta",
        -50 + (buttonpos), mapsizey + 85, "Beta Visible");
    checkB.onclick = function () {
        toggleGreekVisibility(this, curReactor.beta);
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
function makeBonder(sq, data) {
    var bonder = makesq('div', sq, 'bonder', 0, 0, (mapsizex / 10) - 13, (mapsizey / 8) - 12);
    bonder.gridx = sq.gridx;
    bonder.gridy = sq.gridy;
    bonder.type = "bonder";
    bonder.draggable = true;
    bonder.ondragstart = function () {
        event.dataTransfer.setData("text", bonder.id);
        deleteDrag();
    }
    bonder.ondragover = null;
    bonder.ondrop = null;
    bonder.capability = data.type ? data.type : "full";
    curReactor.reactorFeatures.bonders.push(bonder);
    var bondText = "+ -";
    if (data.type == "a") {
        bondText = "+";
    } else if (data.type == "d") {
        bondText = "-";
    }
    bonder.innerHTML = bondText + " <sup>" + curReactor.reactorFeatures.bonders.length + "</sup>";
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
        if (!dropTarget || !symbol) return;
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
                    combinedSym = curReactor.alpha.symbols.concat(curReactor.beta.symbols);
                for (var sym of combinedSym) {
                    if (sym.selected) {
                        var diffDropSq = symAtCoords(curReactor.levelSquares, {
                            x: sym.gridx + xdiff,
                            y: sym.gridy + ydiff
                        });
                        dropSymbolOnSquare(diffDropSq, sym);
                    }
                }
            }
            save();
        }
    }
}
function dropSymbolOnSquare(dropTarget, symbol) {
    dropTarget.appendChild(symbol);
    symbol.gridx = dropTarget.gridx;
    symbol.gridy = dropTarget.gridy;
    symbol.parentSquare = dropTarget;
    curReactor.alpha.startSymbol && makePath(curReactor.alpha.startSymbol.parentSquare, curReactor.alpha);
    curReactor.beta.startSymbol && makePath(curReactor.beta.startSymbol.parentSquare, curReactor.beta);
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

window.save = function () {
    var saveState = {
        alpha: saveGreek(curReactor.alpha),
        beta: saveGreek(curReactor.beta),
        reactorFeatures: saveReactorFeatures(curReactor)
    };
    window.saveNumber = window.saveNumber || 0;
    saveNumber++;
    if (saveNumber >= 20) {
        saveNumber = 1;
    }
    var stringSave = JSON.stringify(saveState);
    localStorage.setItem(window.levelName + (saveNumber), stringSave);
    localStorage.setItem(levelName + "last", saveNumber);
    var level = personalData.levels.filter(l => l.name == levelName)[0];
    if (!level) {
        level = { name: levelName };
        personalData.levels.push(level);
    }
    level.save = saveState;
    updatePersonalData();
}
function saveReactorFeatures(reactor) {
    var saveFeatures = { bonders: [] };
    if (reactor.reactorFeatures.bonders) {
        for (var bonder of reactor.reactorFeatures.bonders) {
            saveFeatures.bonders.push({ gridx: bonder.gridx, gridy: bonder.gridy });
        }
    }
    if (reactor.reactorFeatures.sensor) {
        saveFeatures.sensor = {
            gridx: reactor.reactorFeatures.sensor.gridx,
            gridy: reactor.reactorFeatures.sensor.gridy
        };
    }
    if (reactor.reactorFeatures.fuser) {
        saveFeatures.fuser = {
            gridx: reactor.reactorFeatures.fuser.gridx,
            gridy: reactor.reactorFeatures.fuser.gridy
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
window.load = function () {
    var lastSave = localStorage.getItem(window.levelName + "last");
    window.saveNumber = parseInt(lastSave);
    var saveStateJSON = localStorage.getItem(window.levelName + lastSave);
    var saveState = JSON.parse(saveStateJSON);
    if (!saveState) {
        var level = personalData.levels.filter(l => l.name == levelName)[0];
        if (level && level.save) {
            saveState = level.save;
        }
    }
    deleteAll(curReactor.alpha);
    deleteAll(curReactor.beta);
    if (saveState) {
        loadReactor(saveState, curReactor);
    }
}
window.loadReactor = function (saveState, reactor) {
    reactor.alpha.symbols = loadGreek(reactor.alpha, saveState.alpha);
    reactor.beta.symbols = loadGreek(reactor.beta, saveState.beta);
    reactor.alpha.startSymbol && makePath(reactor.alpha.startSymbol.parentSquare, reactor.alpha);
    reactor.beta.startSymbol && makePath(reactor.beta.startSymbol.parentSquare, reactor.beta);
    saveState.reactorFeatures = saveState.reactorFeatures || {};
    if (saveState.reactorFeatures.bonders) {
        for (var bonderId in saveState.reactorFeatures.bonders) {
            var dropTarget = symAtCoords(reactor.levelSquares, {
                x: saveState.reactorFeatures.bonders[bonderId].gridx,
                y: saveState.reactorFeatures.bonders[bonderId].gridy
            });
            dropSymbolOnSquare(dropTarget, reactor.reactorFeatures.bonders[bonderId]);
        }
    }
    if (saveState.reactorFeatures.sensor) {
        var dropTarget = symAtCoords(reactor.levelSquares, {
            x: saveState.reactorFeatures.sensor.gridx,
            y: saveState.reactorFeatures.sensor.gridy
        });
        dropSymbolOnSquare(dropTarget, reactor.reactorFeatures.sensor);
    }
    if (saveState.reactorFeatures.fuser) {
        var dropTarget = symAtCoords(reactor.levelSquares, {
            x: saveState.reactorFeatures.fuser.gridx,
            y: saveState.reactorFeatures.fuser.gridy
        });
        dropSymbolOnSquare(dropTarget, reactor.reactorFeatures.fuser);
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
        var sq = symAtCoords(curReactor.levelSquares, { x: sym.gridx, y: sym.gridy }, false);
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

window.symAtCoords = function (symbols, location, arrow) {
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
window.symsAtCoords = function (symbols, location, arrow) {
    var retArray = [];
    for (var i = 0; i < symbols.length; i++) {
        var curSym = symbols[i];
        if (curSym.gridx == location.x && curSym.gridy == location.y) {
            if (arrow && !curSym.arrow) {
                continue;
            } else if (!arrow && curSym.arrow) {
                continue;
            }
            retArray.push(curSym);
        }
    }
    if (retArray.length == 1)
        return retArray[0];
    if (retArray.length == 0)
        return null;
    return retArray;
}
window.greek = function (name) {
    if (name == "Beta")
        return curReactor.beta;
    if (name == "Alpha" || curReactor.mode == curReactor.alpha)
        return curReactor.alpha;
    return curReactor.beta;
}
window.greekOpposite = function (name) {
    if (name == "Beta")
        return curReactor.alpha;
    if (name == "Alpha")
        return curReactor.beta;
}
function makeBuildButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = $(canvas).find('.buttonContainer')[0];
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
        buttonContainer.classList.add("buttonContainer");
    }
    clear(buttonContainer);
    var greekMode = greek().mode;
    makebtns(greekMode, 'button', buttonContainer, 'Start (r)', mapsizex + 10, buttonpos += 50, "Start",
        function () { curSymbol = "Start" });
    makebtns(greekMode, 'button', buttonContainer, 'In (i)', mapsizex + 10, buttonpos += 50, "In",
        function () { curSymbol = "In"; }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Out (o)', mapsizex + 85, buttonpos, "Out",
        function () { curSymbol = "Out" }, 75);
    makebtns(greekMode, 'button', buttonContainer, 'Grab/Drop (g)', mapsizex + 10, buttonpos += 50, "Grab",
        function () { curSymbol = "Grab" });
    if (curReactor.reactorFeatures.bonderData && curReactor.reactorFeatures.bonderData.length > 0) {
        makebtns(greekMode, 'button', buttonContainer, 'Bond (b)', mapsizex + 10, buttonpos += 50, "Bond",
            function () { curSymbol = "Bond" });
    }
    makebtns(greekMode, 'button', buttonContainer, 'Rotate (t)', mapsizex + 10, buttonpos += 50, "Rotate",
        function () { curSymbol = "Rotate" });
    makebtns(greekMode, 'button', buttonContainer, 'Sync (y)', mapsizex + 10, buttonpos += 50, "Sync",
        function () { curSymbol = "Sync" });
    if (curReactor.reactorFeatures.sensor) {
        makebtns(greekMode, 'button', buttonContainer, 'Sensor (n)', mapsizex + 10, buttonpos += 50, "Sensor",
            function () { curSymbol = "Sensor" });
    }
    if (curReactor.reactorFeatures.fuser) {
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
        curReactor.mode = curReactor.beta;
    } else {
        curReactor.mode = curReactor.alpha;
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
    var buttonContainer = $(canvas).find('.buttonContainer')[0];
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
        buttonContainer.classList.add("buttonContainer");
    }
    clear(buttonContainer);

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
    delElement(curReactor.alpha.waldo);
    delElement(curReactor.beta.waldo);
    clear(get("elements" + curReactor.id));
    curReactor.alpha.waldo = null;
    curReactor.beta.waldo = null;
    makeBuildButtons(canvas);
    curReactor.alpha.outReqs.count = curReactor.alpha.outReqs.maxCount;
    curReactor.beta.outReqs.count = curReactor.beta.outReqs.maxCount;
    curReactor.alpha.entrance = [];
    curReactor.beta.entrance = [];
    cycles = 0;
}
function makebtns(greekMode, tagname, parent, text, left, top, name, funct, width, height) {
    var ret = makebtn(tagname, parent, text, left, top, funct, width, height);
    ret.classList.add('btn' + greekMode);
    ret.draggable = true;
    ret.onclick = function () {
        deselBtns($(".buttonContainer")[0]);
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
    for (var i = 0; i < curReactor.alpha.symbols.length; i++) {
        var sym = curReactor.alpha.symbols[i];
        sym.selected = false;
        sym.classList.remove("selected");
    }
    for (var i = 0; i < curReactor.beta.symbols.length; i++) {
        var sym = curReactor.beta.symbols[i];
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
        deleteDrag();
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

function updatePersonalData() {
    var user = levelWebData.uniqueNames.filter(u => u.name == uniqueName)[0];
    var url = "https://api.myjson.com/bins/" + user.id;
    $.ajax({
        url: url,
        type: "PUT",
        data: JSON.stringify(personalData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
        }
    });
}
function updateWebData() {
    var url = localStorage.getItem("devStats");
    url = url || "https://api.myjson.com/bins/olxbt";
    $.ajax({
        url: url,
        type: "PUT",
        data: JSON.stringify(levelWebData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            window.levelWebData = data;
        }
    });
}

window.traverseBonds = function (el, visit) {
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
window.getLevelWebData = function (callback) {
    var url = localStorage.getItem("devStats");
    url = url || "https://api.myjson.com/bins/olxbt";
    $.get(url, function (data, textStatus, jqXHR) {
        callback(data);
    });
}
window.getPersonalData = function () {
    var me = levelWebData.uniqueNames.filter(u => u.name == uniqueName)[0];
    var url = "https://api.myjson.com/bins/" + me.id;
    $.get(url, function (data, textStatus, jqXHR) {
        window.personalData = data;
    });
}
window.fixStats = function () {
    var uniqueNames = levelWebData.uniqueNames.concat([]);
    levelWebData.uniqueNames = [];
    for (var name of uniqueNames) {
        runSave(name);
    }
    function runSave(person) {
        var myUserData = { levels: [], name: person.name };
        for (var level of configs) {
            var levelData = levelWebData[level.name][person.name];
            if (levelData) {
                levelData.name = level.name;
                myUserData.levels.push(levelData);
            }
        }
        $.ajax({
            url: "https://api.myjson.com/bins",
            type: "POST",
            data: JSON.stringify(myUserData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var uri = data.uri.split("/");
                console.log(data);
                levelWebData.uniqueNames.push({ name: person.name, id: uri[uri.length - 1] });
                //updateWebData();
            }
        });
    }
}