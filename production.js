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
                    makeOut(sq, out);
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
    window.curReactorType = "standard";
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
    pipes.push(pipe);
    resetEntrancePipes();
    return pipe;
}
function resetEntrancePipes() {
    for (var pipe of pipes) {
        if (pipe.downstream && pipe.downstream.alpha) {
            pipe.downstream = null;
        }
        var building = prodCollide({ gridx: pipe.gridx + 1, gridy: pipe.gridy },
            pipe, { x: 1, y: 1 });
        if (building && building.getEntrance) {
            var entrance = building.getEntrance(pipe.gridx, pipe.gridy);
            if (entrance) {
                pipe.downstream = building;
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
            var pipeOnSq = symAtCoords(pipes, { x: sq.gridx, y: sq.gridy });
            var dir = {
                x: -currentDragPipe.gridx + sq.gridx,
                y: -currentDragPipe.gridy + sq.gridy
            };
            var collided = prodCollide(sq, null, { x: 1, y: 1 });
            if (!pipeOnSq && !collided) {
                currentDragPipe = makePipe(sq, dir, currentDragPipe);
            } else if (pipeOnSq != currentDragPipe && pipeOnSq != currentDragPipe.upstream) {
                currentDragPipe = null;
            } else if (pipeOnSq == currentDragPipe.upstream) {
                delElement(currentDragPipe);
                pipes.splice(pipes.indexOf(currentDragPipe), 1);
                currentDragPipe = pipeOnSq;
                currentDragPipe.canMakeMore = true;
            }
        }
    }
}
function makeProdBottomButtons() {
    var buttonContainer = get("canvas"),
        buttonpos = -100;
    makebtn('button', buttonContainer, 'Back', -50 + (buttonpos += 155), mapsizey + 60, function () {
        location.reload();
    }).style.width = "50px";
    makebtn('button', buttonContainer, 'Clear All', -50 + (buttonpos += 55), mapsizey + 60, function () {
        //deleteAll(alpha);
        //deleteAll(beta);
        //save();
    });
}
function saveProd() {
}

function deleteReactorPipes(reactor) {
    for (var outPipe of reactor.outPipes) {
        var curPipe = outPipe.downstream;
        outPipe.canMakeMore = true;
        while (curPipe) {
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
            delElement(selected);
            var symInd = reactors.indexOf(selected);
            if (~symInd) {
                reactors.splice(symInd, 1);
            }
            delElement(get("reactorModal" + selected.id));
            clear(parent);
            if (selected.outPipes) {
                deleteReactorPipes(selected);
                for (var pipe of selected.outPipes) {
                    pipes.splice(pipes.indexOf(pipe), 1);
                    delElement(pipe);
                }
            }
            saveProd();
        }, 100, 50);
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
    makeProdbtns('button', buttonContainer, 'Standard Reactor', "standard", mapsizex + 10, buttonpos += 60, function () {
        curReactorType = "standard";
    });
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
    cycles = 0;
}
function getReactorCanvas(reactor) {
    return get(`modaltext${reactor.id}`);
}
window.runProd = function (canvas, moveTime, symbolTime) {

    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();
    for (var source of sources) {
        source.counter = 9;
    }
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
                if(element.state == "move"){
                    incLeft(element, element.direction.x * xDistTick);
                    incTop(element, element.direction.y * yDistTick);
                }
            }
        }, moveTime);
    }

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {    
        for (var reactor of reactors) {
            curBuilding = reactor;
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
        for (var el of elements.childNodes) {
            if (el.state == "move") {
                var lastPipe = symAtCoords(pipes, {x: el.prodx, y: el.prody});
                el.prodx += el.direction.x;
                el.prody += el.direction.y;
                var curPipe = symAtCoords(pipes, {x: el.prodx, y: el.prody});
                /*if (curPipe && curPipe.curElement) {
                    el.prodx -= el.direction.x;
                    el.prody -= el.direction.y;
                    curPipe = lastPipe;
                } else {
                    lastPipe.curElement = null;
                }*/
                el.style.left = (el.prodx*mapsizex/gridNumX)+"px";
                el.style.top = (el.prody*mapsizey/gridNumY) + "px";
                var curBuilding = prodCollide({ gridx: el.prodx+1, gridy: el.prody },
                    el, { x: 1, y: 1 });
                var buildingEntrance = curBuilding && curBuilding.getEntrance(el.prodx, el.prody);
                if (!buildingEntrance) {
                    curBuilding = null;
                }
                if (curPipe && curPipe.downstream && (!curBuilding || !curBuilding.alpha)) {
                    curPipe.curElement = el;
                    el.direction = curPipe.downstream.direction || { x: 0, y: 0 };
                } else if (curBuilding && buildingEntrance) {
                    buildingEntrance.push(el);
                    el.state = "stop";
                } else {
                    el.state = "stop";
                }
            }
        }
        for (var source of sources) {
            source.counter++;
            if (source.counter == 10) {
                source.produceElement();
                source.counter = 0;
            }
        }
        cycles++;
        checkProdWin();
    }, symbolTime);
}
function checkProdWin() {
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
    var inData = [{
        probability: 100,
        elements: [],
        bonds: []
    }];
    for (var el of elContainer.childNodes) {
        var data = inData[0];
        var boldData = el.bonds.map(b => b.id);
        data.elements.push({ name: el.symbol, x: el.gridx - xmod, y: el.gridy, id: el.id, bonds: boldData });
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
    return inData;
}
function makeProdElement(parentSquare, inData) {
    var elements = get('elements');
    var elContainer = make("div", elements, "prodElContainer");
    var pipe = symAtCoords(pipes, {
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
}