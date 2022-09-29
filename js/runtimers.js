import {stopGame, makeHeader} from "./game.js"
window.run = function(canvas, moveTime, symbolTime) {
    if (curReactor.alpha.startSymbol)
        runSetup(canvas, curReactor.alpha, "Alpha");
    if (curReactor.beta.startSymbol)
        runSetup(canvas, curReactor.beta, "Beta");

    moveTime = moveTime || 30;
    symbolTime = symbolTime || 1000;
    var timeInterval = symbolTime / moveTime;

    clearIntervals();

    // Move
    if (moveTime < symbolTime) {
        window.moveInterval = window.setInterval(function () {
            if (curReactor.alpha.startSymbol)
                moveRunTimer(curReactor.alpha, "Alpha", timeInterval);
            if (curReactor.beta.startSymbol)
                moveRunTimer(curReactor.beta, "Beta", timeInterval);
            checkCollisions(curReactor);
        }, moveTime);
    }

    // ActivateSymbol
    window.activateInterval = window.setInterval(function () {
        if (curReactor.alpha.startSymbol)
            activateMoveRunTimer(curReactor.alpha, "Alpha");
        if (curReactor.beta.startSymbol)
            activateMoveRunTimer(curReactor.beta, "Beta");
        if (curReactor.alpha.startSymbol)
            activateRunTimer(curReactor.alpha, "Alpha");
        if (curReactor.beta.startSymbol)
            activateRunTimer(curReactor.beta, "Beta");
        checkCollisions(curReactor);
        curReactor.headerAlpha.innerHTML = makeHeader(curReactor.alpha, "&alpha;");
        curReactor.headerBeta.innerHTML = makeHeader(curReactor.beta, "&beta;");
        cycles++;
        checkWin();
    }, symbolTime);
}
export function runSetup(canvas, greek, greekMode) {
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
export function moveRunTimer(greek, greekMode, timeInterval) {

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
export function activateMoveRunTimer(greek, greekMode) {
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
export function activateRunTimer(greek, greekMode) {
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
    }
    else if (greek.waldo.action == "in") {
        var sym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy });
        var entranceGreek = window.greek(sym.greek);
        if (entranceGreek.entrance.length > 0) {
            var yMod = sym.greek == curReactor.beta.mode ? 4 : 0;
            var elements = get("elements" + greek.reactorId);
            var elContainer = entranceGreek.entrance[0];
            var inData = makeInDataFromElements(elContainer);
            var pipe = symAtCoords(pipes, { x: elContainer.prodx, y: elContainer.prody });
            pipe.curElement = null;
            makeElement(inData, elements, 10, 8, 20, 20, yMod);
            greek.waldo.action = "move";
            delElement(elContainer);
            entranceGreek.entrance.shift();
        }
    }
    else {
        var actionSym = symAtCoords(greek.symbols, { x: greek.waldo.gridx, y: greek.waldo.gridy }, false);
        if (actionSym) {
            actionSym.performAction(greek, greekMode);
        }
    }
}
window.clearIntervals = function() {
    if (window.moveInterval) {
        window.clearInterval(moveInterval);
        window.moveInterval = null;
    }
    if (window.activateInterval) {
        window.clearInterval(activateInterval);
        window.activateInterval = null;
    }
}

export function checkCollisions(reactor) {
    var elementParent = get("elements"+reactor.id);
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
                alert("Collision between elements! "+reactor.id);
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
    if (curReactor.alpha.outReqs.count && curReactor.alpha.outReqs.count > 0) {
        winGame = false;
    }

    if (curReactor.beta.outReqs.count && curReactor.beta.outReqs.count  > 0) {
        winGame = false;
    }
    if (winGame) {
        var symbols = curReactor.alpha.symbols.length + curReactor.beta.symbols.length;
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
        netService.set(personalData, personalData._id);
        stopGame(get("canvas"));

    }
}
