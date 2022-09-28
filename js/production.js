
window.curReactor = null;
window.saveCurReactor = null;
window.loadProduction = function (config) {
    var canvas = get("canvas");
    window.config = config;
	window.gridNumX = config.gridNumX || 32;
	window.gridNumY = config.gridNumY || 24;
	config.sources = config.sources || [];
    window.productionSquares = [];
    window.reactors = [];
    window.sources = [];
    window.outs = [];
    window.pipes = [];
    for (var i = 0; i < gridNumX; i++) {

        for (var j = 0; j < gridNumY; j++) {
            var sq = makesq('div', canvas, 'square', 
				i * (mapsizex / gridNumX), j * (mapsizey / gridNumY), 
				mapsizex / gridNumX, mapsizey / gridNumY,
                dropSymProdSq(sq));
            setProdSqListeners(sq);
            sq.gridx = i;
            sq.gridy = j;
            for (var source of config.in) {
                if (source.x == i && source.y == j) {
                    makeSource(sq, source);
                }
            }
            for (var out of config.outReqs) {
                if (out.x == i && out.y == j) {
                    makeDeposit(sq, out);
                }
            }
            productionSquares.push(sq);
        }
    }
    for (var source of sources) {
        var pipeEl = symAtCoords(productionSquares, {
            x: source.gridx + source.inData.w,
            y: Math.round(source.gridy + source.inData.h / 2)
        });
        makePipe(pipeEl, { x: 1, y: 0 }, source);
    }
    for (var outReq of config.outReqs) {
        outReq.maxCount = outReq.count;
    }
    window.outDisplays = [];
    for (var depo of outs) {
        outDisplays.push(make("h2", canvas, 'req', true));
        outDisplays[outDisplays.length - 1].innerHTML = makeProdHeader(depo);
    }
    window.curReactorType = config.reactors[0];
    window.currentDragPipe = null;
    makeProdBottomButtons();
    makeProdBuildButtons(canvas);
    document.addEventListener("mouseup", function () {
        currentDragPipe = null;
    });
    window.save = saveProd;
    window.run = runProd;
    window.makeInPerfActionFn = prodInFn;
    window.outFn = prodOutFn;
    window.stopReactor = stopGame;
    window.stopGame = stopProdGame;
    window.load = loadProdSave;
    delElement(get('reqs'));
    loadProdSave();
    saveProd();
}
function makeProdHeader(depo) {
    return "Molecules Remaining: " + depo.outData.count;
}
function makePipe(container, direction, parent) {
    var pipe = makesq("div", container, "pipe", 0, 0, mapsizex / gridNumX, mapsizey / gridNumY);
    setGrid(pipe, container, container);
    if (direction.x != 0) {
        pipe.innerHTML = "=";
    } else {
        pipe.innerHTML = "||";
    }
    pipe.upstream = parent;
    parent.downstream = pipe;
    pipe.w = 1;
    pipe.h = 1;
    pipe.direction = direction;
    parent.canMakeMore = false;
    pipe.canMakeMore = true;
    pipe.draggable = false;
    pipe.onmousedown = function () {
        if (pipe.canMakeMore)
            window.currentDragPipe = pipe;
        return false;
    }
    pipe.getEntrance = function () {
        return null;
    }
    pipes.push(pipe);
    resetEntrancePipes();
    return pipe;
}
function resetEntrancePipes() {
    for (var pipe of pipes) {
        if (pipe.downstream && pipe.downstream.hasEntrance) {
            pipe.downstream = null;
            pipe.classList.remove("link");
        }
        var building = prodCollide({ gridx: pipe.gridx + 1, gridy: pipe.gridy },
            pipe, { x: 1, y: 1 });
        if (building && building.getEntrance) {
            var entrance = building.getEntrance(pipe.gridx, pipe.gridy);
            if (entrance) {
                pipe.downstream = building;
                pipe.classList.add("link");
                building.link(pipe, entrance);
            }
        }
    }
}
function dropSymProdSq(sq){
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
            curReactorType = symbol.name;
            $(dropTarget).click();
            deselBtns(get("buttonContainer"));
            symbol.classList.add("selected");
        } else {
            if (!symbol.selected) {
                if (!prodCollide(dropTarget, symbol, { x: 4, y: 4 })) {
                    dropReactorOnSquare(dropTarget, symbol);
                }
                symbol.style['z-index'] = 1;
            } else {
                var xdiff = dropTarget.gridx - symbol.gridx,
                    ydiff = dropTarget.gridy - symbol.gridy;
                for (var sym of reactors) {
                    if (sym.selected) {
                        var diffDropSq = symAtCoords(productionSquares, {
                            x: sym.gridx + xdiff,
                            y: sym.gridy + ydiff
                        });
                        dropReactorOnSquare(diffDropSq, sym);
                    }
                }
            }
        }
    }
}

function dropReactorOnSquare(dropTarget, symbol) {
    dropTarget.appendChild(symbol);
    symbol.gridx = dropTarget.gridx;
    symbol.gridy = dropTarget.gridy;
    symbol.parentSquare = dropTarget;
    if (symbol.outPipes) {
        var ydiff = 1;
        for (var outPipe of symbol.outPipes) {
            var outSq = symAtCoords(productionSquares, { x: symbol.gridx + 4, y: symbol.gridy + (ydiff++) });
            dropReactorOnSquare(outSq, outPipe);
        }
    }
    resetEntrancePipes();
}
function setProdSqListeners(sq) {
    sq.onclick = function () {
        var sym = window["reactor" + curReactorType].place(sq);
        if (sym) {
            reactors.push(sym);
            resetEntrancePipes();
            saveProd();
        }
    }
    sq.onmousemove = function () {
        if (currentDragPipe) {
            var pipeOnSq = symsAtCoords(pipes, { x: sq.gridx, y: sq.gridy });
            var dir = {
                x: -currentDragPipe.gridx + sq.gridx,
                y: -currentDragPipe.gridy + sq.gridy
            };
            if (pipeOnSq == currentDragPipe.upstream || (pipeOnSq && pipeOnSq.length == 2 && ~pipeOnSq.indexOf(currentDragPipe.upstream))) {
                delElement(currentDragPipe);
                pipes.splice(pipes.indexOf(currentDragPipe), 1);
                currentDragPipe = pipeOnSq.length == 2 ?
                    pipeOnSq.filter(p => p.direction.x == currentDragPipe.direction.x)[0] :
                    pipeOnSq;
                currentDragPipe.canMakeMore = true;
                saveProd();
            }
            else if ((!pipeOnSq || (pipeOnSq && !pipeOnSq.length && diffPipeDir(pipeOnSq.direction, dir)))
                && pipeOnSq != currentDragPipe) {
                var collided = prodCollide(sq, pipeOnSq, { x: 1, y: 1 });
                if (!collided) {
                    currentDragPipe = makePipe(sq, dir, currentDragPipe);
                    saveProd();
                }
            } else if (pipeOnSq != currentDragPipe && pipeOnSq != currentDragPipe.upstream && pipeOnSq.length != 2) {
                currentDragPipe = null;
                saveProd();
            } 
        }
    }
}
function diffPipeDir(dir1, dir2) {
    return (dir1.x == 0 && dir2.x != 0) || (dir1.x != 0 && dir2.x == 0);
}
function makeProdBottomButtons() {
    var buttonContainer = get("canvas"),
        buttonpos = -100;
    makebtn('button', buttonContainer, 'Back', -50 + (buttonpos += 155), mapsizey + 60, function () {
        location.reload();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Undo', -50 + (buttonpos += 55), mapsizey + 60, function () {
        var lastSave = localStorage.getItem(window.levelName + "last");
        lastSave--;
        if (lastSave < 1) {
            lastSave = undoStackSize - 1;
        }
        localStorage.setItem(window.levelName + "last", lastSave);
        loadProdSave();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Redo', -50 + (buttonpos += 55), mapsizey + 60, function () {
        var lastSave = localStorage.getItem(window.levelName + "last");
        lastSave++;
        if (lastSave >= undoStackSize) {
            lastSave = 1;
        }
        localStorage.setItem(window.levelName + "last", lastSave);
        loadProdSave();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Clear All', -50 + (buttonpos += 55), mapsizey + 60, function () {
        clearAll();
        save();
    });
}
function clearAll() {
    for (var i = reactors.length - 1; i >= 0; i--) {
        var reactor = reactors[i];
        deleteReactor(reactor);
    }
    for (var i = pipes.length-1;i>=0;i--) {
        var pipe = pipes[i];
        if(!pipe.upstream.inData) {
            delElement(pipe);
            pipes.splice(i, 1);
        } else {
            pipe.canMakeMore = true;
        }
    }
}
function saveProd() {
    window.saveNumber = window.saveNumber || 0;
    saveNumber++;
    if (saveNumber >= 20) {
        saveNumber = 1;
    }
    var saveState = {
        reactors: [],
        pipes: []
    }
    for (var reactor of reactors) {
        saveState.reactors.push({
            alpha: saveGreek(reactor.alpha),
            beta: saveGreek(reactor.beta),
            reactorFeatures: saveReactorFeatures(reactor),
            type: reactor.type,
            x: reactor.gridx,
            y: reactor.gridy
        });
    }
    for (var pipe of pipes) {
        var downstream = pipe.downstream;
        if (downstream && !pipe.downstream.direction) {
            downstream == null;
        }
        var upstream = pipe.upstream;
        if (upstream && !pipe.upstream.direction) {
            upstream == null;
        }
        saveState.pipes.push({
            x: pipe.gridx,
            y: pipe.gridy,
            id: pipe.id,
            downstream: downstream && { x: downstream.gridx, y: downstream.gridy },
            upstream: upstream && { x: upstream.gridx, y: upstream.gridy },
            direction: pipe.direction
        });
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

function deleteReactorPipes(reactor) {
    for (var outPipe of reactor.outPipes) {
        var curPipe = outPipe.downstream;
        outPipe.canMakeMore = true;
        while (curPipe && !curPipe.hasEntrance) {
            delElement(curPipe);
            pipes.splice(pipes.indexOf(curPipe), 1);
            curPipe = curPipe.downstream;
        }
    }
}
function prodCollide(sq, me, size) {
    var allEls = reactors.concat(pipes, sources, outs);
    for (var el of allEls) {
        if (me && el == me) continue;
        var rx = el.gridx,
            ry = el.gridy;
        if (sq.gridx < rx + el.w && sq.gridx + size.x > rx &&
            sq.gridy < ry + el.h && sq.gridy + size.y > ry) {
            return el;
        }
    }
    return null;
}
function makeProdDelButton() {
    return function (selected) {
        var parent = get("symButtons");
        clear(parent);
        makebtn('button', parent, 'Delete', mapsizex / 2 - 50, mapsizey, function () {
            deleteReactor(selected);
            saveProd();
        }, 100, 50);
    }
}
function deleteReactor(reactor) {
    delElement(reactor);
    var symInd = reactors.indexOf(reactor);
    if (~symInd) {
        reactors.splice(symInd, 1);
    }
    delElement(get("reactorModal" + reactor.id));
    clear(parent);
    if (reactor.outPipes) {
        deleteReactorPipes(reactor);
        for (var pipe of reactor.outPipes) {
            pipes.splice(pipes.indexOf(pipe), 1);
            delElement(pipe);
        }
    }
}
function makeProdBuildButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = get('buttonContainer');
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
        buttonContainer.id = "buttonContainer";
    }
    clear(buttonContainer);
    if (~config.reactors.indexOf("standard")) {
        makeProdbtns('button', buttonContainer, 'Standard Reactor', "standard", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "standard";
        });
    }
    if (~config.reactors.indexOf("assembly")) {
        makeProdbtns('button', buttonContainer, 'Assembly Reactor', "assembly", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "assembly";
        });
    }
    if (~config.reactors.indexOf("disassembly")) {
        makeProdbtns('button', buttonContainer, 'Disassembly Reactor', "disassembly", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "disassembly";
        });
    }
    if (~config.reactors.indexOf("sensor")) {
        makeProdbtns('button', buttonContainer, 'Sensor Reactor', "sensor", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "sensor";
        });
    }
    if (~config.reactors.indexOf("fuser")) {
        makeProdbtns('button', buttonContainer, 'Fuse Reactor', "fuser", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "fuser";
        });
    }
    if (~config.reactors.indexOf("flipflop")) {
        makeProdbtns('button', buttonContainer, 'FlipFlop Reactor', "flipflop", mapsizex + 10, buttonpos += 60, function () {
            curReactorType = "flipflop";
        });
    }
    makebtn('button', buttonContainer, 'Run', mapsizex + 10, buttonpos += 60, function () {
        makeProdRunButtons(canvas);
        runProd(canvas);
    });
}
function makeProdRunButtons(canvas) {
    var buttonpos = -40;
    var buttonContainer = get('buttonContainer');
    if (!buttonContainer) {
        buttonContainer = make('div', canvas, '');
    }
    clear(buttonContainer);
    buttonContainer.id = "buttonContainer";

    makebtn('button', buttonContainer, 'Stop', mapsizex + 10, buttonpos += 50, function () {
        stopProdGame(canvas);
    });
    makebtn('button', buttonContainer, 'Pause', mapsizex + 10, buttonpos += 50, function () {
        clearIntervals();
    });
    makebtn('button', buttonContainer, 'Speed x 1', mapsizex + 10, buttonpos += 50, function () {
        runProd(canvas);
    });
    makebtn('button', buttonContainer, 'Speed x 2', mapsizex + 10, buttonpos += 50, function () {
        runProd(canvas, 20, 500);
    });
    makebtn('button', buttonContainer, 'Speed x 5', mapsizex + 10, buttonpos += 50, function () {
        runProd(canvas, 20, 200);
    });
    makebtn('button', buttonContainer, 'Speed x 50', mapsizex + 10, buttonpos += 50, function () {
        runProd(canvas, 2000, 20);
    });
    makebtn('button', buttonContainer, 'Speed x 500', mapsizex + 10, buttonpos += 50, function () {
        runProd(canvas, 2000, 2);
    });
}
function makeProdbtns(tagname, parent, text, name, left, top, funct, width, height) {
    var ret = makebtn(tagname, parent, text, left, top, funct, width, height);
    ret.classList.add('btn');
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

function stopProdGame(canvas) {
    clearIntervals();
    clear(get('elements'));
    makeProdBuildButtons(get("canvas"));
    for (var outReq of config.outReqs) {
        outReq.count = outReq.maxCount;
    }
    for (var reactor of reactors) {
        curReactor = reactor;
        stopReactor(getReactorCanvas(reactor));
    }
    for (var source of sources) {
        source.counter = 9;
    }
    for (var pipe of pipes) {
        pipe.curElement = null;
    }
    curReactor = saveCurReactor;
    saveCurReactor = null;
    cycles = 0;
}
function getReactorCanvas(reactor) {
    return get(`modaltext${reactor.id}`);
}
window.runProd = function (canvas, moveTime, symbolTime) {
    if (!saveCurReactor)
        saveCurReactor = curReactor;
    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();
    for (var reactor of reactors) {
        if (reactor.alpha.startSymbol)
            runSetup(getReactorCanvas(reactor), reactor.alpha, "Alpha");
        if (reactor.beta.startSymbol)
            runSetup(getReactorCanvas(reactor), reactor.beta, "Beta");
    }

    // Move
    var elements = get('elements');
    if (moveTime < symbolTime) {
        var xDistTick = mapsizex / gridNumX / moveTime,
            yDistTick = mapsizey / gridNumY / moveTime;
        window.moveInterval = window.setInterval(function () {
            for (var reactor of reactors) {
                curReactor = reactor;
                if (reactor.alpha.startSymbol) 
                    moveRunTimer(reactor.alpha, "Alpha", timeInterval);
                if (reactor.beta.startSymbol)
                    moveRunTimer(reactor.beta, "Beta", timeInterval);
                checkCollisions(reactor);
            }
            for (var element of elements.childNodes) {
                if (element.state == "move") {
                    var nextPipe = symsAtCoords(pipes, {
                        x: element.prodx + element.direction.x,
                        y: element.prody + element.direction.y
                    });
                    if (nextPipe && nextPipe.length == 2) {
                        nextPipe = nextPipe.filter(p => p.direction.x == element.direction.x)[0];
                    }
                    if (nextPipe && !nextPipe.curElement) {
                        incLeft(element, element.direction.x * xDistTick);
                        incTop(element, element.direction.y * yDistTick);
                    }
                }
            }
        }, moveTime);
    }

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {    
        for (var el of elements.childNodes) {
            if (el.state == "move") {
                var lastPipe = symsAtCoords(pipes, { x: el.prodx, y: el.prody });
                if (lastPipe.length == 2) {
                    lastPipe = lastPipe.filter(p => p.direction.x == el.direction.x)[0];
                }
                el.prodx += el.direction.x;
                el.prody += el.direction.y;
                var curPipe = lastPipe.downstream;
                if (curPipe && curPipe.curElement) {
                    el.prodx -= el.direction.x;
                    el.prody -= el.direction.y;
                    curPipe = lastPipe;
                } else {
                    lastPipe.curElement = null;
                }
                el.style.left = (el.prodx*mapsizex/gridNumX)+"px";
                el.style.top = (el.prody*mapsizey/gridNumY) + "px";
                var curBuilding = prodCollide({ gridx: el.prodx+1, gridy: el.prody },
                    el, { x: 1, y: 1 });
                var buildingEntrance = curBuilding && curBuilding.getEntrance(el.prodx, el.prody);
                if (!buildingEntrance) {
                    curBuilding = null;
                }
                if (curPipe && curPipe.downstream && (!curBuilding || !curBuilding.hasEntrance)) {
                    curPipe.curElement = el;
                    el.direction = curPipe.downstream.direction || { x: 0, y: 0 };
                } else if (curBuilding && buildingEntrance) {
                    curPipe.curElement = el;
                    buildingEntrance.push(el);
                    el.state = "stop";
                } else {
                    el.state = "stop";
                }
            }
        }

        for (var reactor of reactors) {
            curReactor = reactor;
            if (reactor.alpha.startSymbol)
                activateMoveRunTimer(reactor.alpha, "Alpha");
            if (reactor.beta.startSymbol)
                activateMoveRunTimer(reactor.beta, "Beta");
            if (reactor.alpha.startSymbol)
                activateRunTimer(reactor.alpha, "Alpha");
            if (reactor.beta.startSymbol)
                activateRunTimer(reactor.beta, "Beta");
            checkCollisions(reactor);
            reactor.headerAlpha.innerHTML = makeHeader(reactor.alpha, "&alpha;");
            reactor.headerBeta.innerHTML = makeHeader(reactor.beta, "&beta;");
        }
        for (var source of sources) {
            source.counter++;
            if (source.counter == 10) {
                source.produceElement();
                source.counter = 0;
            }
        }

        var ymod = -100;
        for (var i = 0; i < outs.length; i++) {
            var depo = outs[i],
                disp = outDisplays[i];
            disp.innerHTML = makeProdHeader(depo);
            disp.style.top = ymod + "px";
            ymod += 30;
        }
        cycles++;
    }, symbolTime);
}
function openReactor(reactor) {
    var modal = document.getElementById("reactorModal" + reactor.id);
    curReactor = reactor;
    modal.style.display = "block";
}
function getSourceFromPipe(pipe) {
    while (pipe.upstream) {
        pipe = pipe.upstream;
    }
    return pipe;
}
window.makeInDataFromElements = function (elContainer, xmod) {
    xmod = xmod || 0;
    var ymod = 0;
    var inData = [{
        probability: 100,
        elements: [],
        bonds: []
    }];
    for (var el of elContainer.childNodes) {
        var data = inData[0];
        var bondData = el.bonds.map(b => b.id);
        if (el.gridy >= 4) {
            ymod = 4;
        }
        //remove dupes
        bondData = bondData.filter((item, pos) => bondData.indexOf(item) == pos);
        data.elements.push({ name: el.symbol, x: el.gridx - xmod, y: el.gridy - ymod, id: el.id, bonds: bondData });
        for (var bond of el.bonds) {
            var otherBond = data.bonds.filter(b =>
                (b.left == el.id && b.right == bond.id) ||
                (b.right == el.id && b.left == bond.id))[0];
            if (otherBond) {
                otherBond.count++;
            } else {
                data.bonds.push({ count: 1, left: el.id, right: bond.id });
            }
        }
    }
    // bonds are counted twice (once for each element). So divide count by 2
    for (var bond of data.bonds) {
        bond.count = bond.count / 2;
    }
    return inData;
}
function makeProdElement(parentSquare, inData) {
    var elements = get('elements');
    var elContainer = make("div", elements, "prodElContainer");
    var pipe = symsAtCoords(pipes, {
        x: parentSquare.gridx,
        y: parentSquare.gridy
    });
    elContainer.prodx = parentSquare.gridx;
    elContainer.prody = parentSquare.gridy;
    elContainer.style.left = (elContainer.prodx * mapsizex / gridNumX) + "px";
    elContainer.style.top = (elContainer.prody * mapsizey / gridNumY) + "px";
    elContainer.state = "move";
    elContainer.direction = { x: 1, y: 0 };
    if (pipe.downstream && pipe.downstream.direction) {
        elContainer.direction = pipe.downstream.direction;
    }
    var els = makeElement(inData, elContainer, gridNumX, gridNumY, 5, 5);
    for (var el of els) {
        el.classList.add('productionElement');
        el.style.left = (el.gridx * 4) + "px";
        el.style.top = (el.gridy * 4) + "px";
    }
    $(elContainer).find(".bondbar").remove();
    return elContainer;
}
window.prodDeposit = function (elContainer) {
    // meets requirements recursively parses the nodes, only need to grab the first element
    var el1 = elContainer.childNodes[0];
    var pipe = prodCollide({ gridx: elContainer.prodx, gridy: elContainer.prody }, null, { x: 1, y: 1 });
    var outReqs = pipe.downstream.outData;
    var meetsReqs = meetsRequirements(el1, { outReqs: outReqs });
    if (meetsReqs) {
        var pipe = symAtCoords(pipes, { x: elContainer.prodx, y: elContainer.prody });
        pipe.curElement = null;
        delElement(elContainer);
        outReqs.count--;
        checkProdWin();
    } else {
        alert("Error: Wrong molecule in out depot!");
        stopProdGame(get('canvas'));
    }
}
function checkProdWin() {
    var win = true;
    for (var out of outs) {
        if (out.outData.count > 0) {
            win = false;
        }
    }
    if (win) {
        var symbols = 0;
        for (var reactor of reactors) {
            symbols += reactor.alpha.symbols.length + reactor.beta.symbols.length;
        }
        clearIntervals();
        var level = personalData.levels.filter(l => l.name == levelName)[0];
        if (!level) {
            level = { name: levelName };
            personalData.levels.push(level);
        }
        if (!level.symbols) {
            level.cycles = cycles;
            level.symbols = symbols;
        }
        openHighScores(symbols);
        if (level.symbols) {

            if (symbols < level.symbols) {
                level.symbols = symbols;
            }
            if (cycles < level.cycles) {
                level.cycles = cycles;
            }
        }
        updatePersonalData();
        stopProdGame(get('canvas'));
    }
}
function loadProdSave() {
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
    if (saveState) {
        var saveReactorIndex = -1;
        if (saveCurReactor)
            saveReactorIndex = reactors.indexOf(saveCurReactor);
        clearAll()
        for (var reactor of saveState.reactors) {
            var sq = symAtCoords(productionSquares, { x: reactor.x, y: reactor.y });
            curReactorType = reactor.type;
            var sym = window["reactor" + curReactorType].place(sq);
            if (sym) {
                reactors.push(sym);
            }
            loadReactor(reactor, reactors[reactors.length - 1]);
        }
        if (saveCurReactor) {
            $(reactors[saveReactorIndex]).click();
            $(reactors[saveReactorIndex]).click();
            saveCurReactor = null;
        }
        try {
            for (var pipe of saveState.pipes) {
                var sq = symAtCoords(productionSquares, { x: pipe.x, y: pipe.y });
                var otherPipe = prodCollide(sq, null, { x: 1, y: 1 });
                var crossPipe = false;
                if (otherPipe && otherPipe.direction.x != pipe.direction.x)
                    crossPipe = true;
                if (!crossPipe || !pipe.upstream) {
                    if (otherPipe || !pipe.upstream) {
                        continue;
                    }
                }
                var parent = prodCollide({
                    gridx: pipe.upstream.x,
                    gridy: pipe.upstream.y
                }, null, { x: 1, y: 1 });
                var checkPipeParent = symsAtCoords(pipes, { x: pipe.upstream.x, y: pipe.upstream.y });
                if (checkPipeParent && checkPipeParent.length == 2) {
                    parent = checkPipeParent.filter(p => p.direction.x == pipe.direction.x)[0];
                }
                makePipe(sq, pipe.direction, parent);
            }
        } catch (e) {
            pipes.splice(pipes.length - 1, 1);
            console.log(e);
        }
        resetEntrancePipes();
    }
}