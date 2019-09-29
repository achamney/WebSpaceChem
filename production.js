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
    window.curReactor = "standard";
    window.currentDragPipe = null;
    makeProdBottomButtons();
    makeProdBuildButtons(canvas);
    document.addEventListener("mouseup", function () {
        currentDragPipe = null;
    });
}
function makeSource(sq, inData) {
    var source = makesq("div", sq, "building source", 0, 0, inData.w * mapsizex / gridNumX, inData.h * mapsizey / gridNumY);
    setGrid(source, sq, sq);
    source.inData = inData;
    source.w = inData.w;
    source.h = inData.h;
    source.innerHTML = "<div class='buildingtext'>" + inData.inProb[0].elements[0].name + " &#9654;&#9654;</div>"
    source.produceElement = function () {
        var els = makeElement(inData.inProb, get('elements'), gridNumX, gridNumY, 5, 5); 
        for (var el of els) {
            el.dir = source.downstream.dir;
            el.style.left = (parseInt(source.downstream.parent.left) + el.gridx * 4)+"px";
            el.style.top = (parseInt(source.downstream.parent.top) + el.gridy * 4) + "px";
        }
    }
    sources.push(source);
}
function makeOut(sq, outData) {
    var outEl = makesq("div", sq, "building out", 0, 0, outData.w * mapsizex / gridNumX, outData.h * mapsizey / gridNumY);
    setGrid(outEl, sq, sq);
    outEl.outData = outData;
    outEl.w = outData.w;
    outEl.h = outData.h;
    outEl.innerHTML = "<div class='buildingtext'>" + outData.elements[0].name + "&#9654;</div>"
    outs.push(outEl);
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
    pipe.dir = direction;
    parent.canMakeMore = false;
    pipe.canMakeMore = true;
    pipe.draggable = false;
    pipe.onmousedown = function () {
        if (pipe.canMakeMore)
            window.currentDragPipe = pipe;
        return false;
    }
    pipes.push(pipe);
    return pipe;
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
            curReactor = symbol.name;
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
}
function setProdSqListeners(sq) {
    sq.onclick = function () {
        var sym = window["reactor" + curReactor].place(sq);
        if (sym) {
            reactors.push(sym);
            saveProd();
        }
    }
    sq.onmousemove = function () {
        if (currentDragPipe) {
            var pipeOnSq = symAtCoords(pipes, { x: sq.gridx, y: sq.gridy });
            var dir = {
                x: currentDragPipe.gridx - sq.gridx,
                y: currentDragPipe.gridy - sq.gridy
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
window.reactorstandard = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor standard', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.w = 4;
        sym.h = 4;
        sym.innerHTML = "<div class='buildingtext'>&#9654; &#8478; &#9654;</div>";
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        return sym;
    }
};
function makereactor(parent, classes, selectFunction) {
    var ret = makesq("div", parent, classes, 0, 0, 4 * mapsizex / gridNumX, 4 * mapsizey / gridNumY);
    ret.onclick = function (event) {
        ret.selected = true;
        selectFunction(ret);
        event.stopImmediatePropagation();
        return false;
    }
    ret.draggable = true;
    ret.ondragstart = function (event) {
        deleteDrag();
        deleteReactorPipes(ret);
        window.setTimeout(function () {
            ret.style['z-index'] = "-1";
        });
        window.setTimeout(function () {
            ret.style['z-index'] = "1";
        },1000);
        event.dataTransfer.setData("text", ret.id);
    }
    return ret;
    
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
            return true;
        }
    }
    return false;
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
        curReactor = "standard";
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
    makeProdBuildButtons(canvas);
    for (var outReq of config.outReqs) {
        outReq.count = outReq.maxCount;
    }
    cycles = 0;
}
window.runProd = function (canvas, moveTime, symbolTime) {

    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();
    for (var source of sources) {
        source.counter = 9;
    }

    // Move
    if (moveTime < symbolTime) {
        var elements = get('elements');
        var xDistTick = mapsizex / gridNumX / moveTime,
            yDistTick = mapsizey / gridNumY / moveTime;
        window.moveInterval = window.setInterval(function () {
            for (var element of elements.childNodes) {
                incLeft(element, element.dir.x * xDistTick);
                incTop(element, element.dir.y * yDistTick);
            }
        }, moveTime);
    }

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {    
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