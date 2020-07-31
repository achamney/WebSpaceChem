
window.makeSource = function (sq, inData) {
    var source = makesq("div", sq, "building source", 0, 0, inData.w * mapsizex / gridNumX, inData.h * mapsizey / gridNumY);
    setGrid(source, sq, sq);
    source.inData = inData;
    source.w = inData.w;
    source.h = inData.h;
    source.counter = 9;
    source.innerHTML = "<div class='buildingtext'>&#9654;&#9654;</div>"
    source.produceElement = function () {
        var parentSquare = source.downstream.parentSquare;
        makeProdElement(parentSquare, inData.inProb);
    }
    var xmod = -82;
    var ymod = 0;
    fixXmod();
    for (var prob of inData.inProb) {
        var inDetailBox = make("div", source, "inDetailBox");
        inDetailBox.style.left = xmod + "px";
        inDetailBox.style.top = ymod + "px";
        makeInOutBox(inDetailBox, prob.elements, prob.bonds, "", 0);
        xmod -= 82;
        fixXmod();
    }
    sources.push(source);
    function fixXmod(){
        var totalX = parseInt(sq.style.left) + xmod;
        if (totalX < -20) {
            xmod += 82;
            ymod += 82;
        }
    }
}
window.makeDeposit = function (sq, outData) {
    var outEl = makesq("div", sq, "building out", 0, 0, outData.w * mapsizex / gridNumX, outData.h * mapsizey / gridNumY);
    setGrid(outEl, sq, sq);
    outEl.outData = outData;
    outEl.w = outData.w;
    outEl.h = outData.h;
    outEl.hasEntrance = true;
    if (outData.count > 0) {
        outEl.innerHTML = "<div class='buildingtext'>" + outData.elements[0].name + "&#9654;</div>";
        outEl.entrance = {
            push: prodDeposit
        };
        outEl.getEntrance = function (x, y) {
            var diff = y - outEl.gridy;
            if (diff == 1) {
                return outEl.entrance;
            }
            return null;
        };
        var outReqBox = make("div", outEl, "outReqBox");
        makeInOutBox(outReqBox, outData.elements, outData.bonds, "", 0);
    } else {
        outEl.innerHTML = "<div class='buildingtext'>&#10006;</div>";
        outEl.entrance = {
            push: function (elContainer) {
                var pipe = symAtCoords(pipes, { x: elContainer.prodx, y: elContainer.prody });
                pipe.curElement = null;
                delElement(elContainer);
            }
        };
        outEl.getEntrance = function (x, y) {
            var diff = y - outEl.gridy;
            if (diff >= 2 && diff <= 4) {
                return outEl.entrance;
            }
            return null;
        };
    }
    outEl.link = function () { };
    outs.push(outEl);
}
window.reactorstandard = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor standard', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.innerHTML = "<div class='buildingtext'>&#9654; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }];
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym, "standard");
        sym.getEntrance = function (x, y) {
            var diffy = y - sym.gridy;
            if (diffy == 1) {
                return sym.alpha.entrance;
            }
            else if (diffy == 2) {
                return sym.beta.entrance;
            }
            return null;
        }
        sym.link = function (pipe, entrance) {
            var greekLoc = pipe.gridy - sym.gridy;
            var source = getSourceFromPipe(pipe);
            var greek = greekLoc == 1 ? sym.alpha : sym.beta;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(sym), sym);
        }
        return sym;
    }
};
window.reactorassembly = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor assembly', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.innerHTML = "<div class='buildingtext'>&#10010; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3, type: "a" }, { x: 4, y: 4, type: "a" }, { x: 5, y: 3, type: "a" }, { x: 5, y: 4, type: "a" }];
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym, "assembly");
        sym.getEntrance = function (x, y) {
            var diffy = y - sym.gridy;
            if (diffy == 1) {
                return sym.alpha.entrance;
            }
            else if (diffy == 2) {
                return sym.beta.entrance;
            }
            return null;
        }
        sym.link = function (pipe, entrance) {
            var greekLoc = pipe.gridy - sym.gridy;
            var source = getSourceFromPipe(pipe);
            var greek = greekLoc == 1 ? sym.alpha : sym.beta;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(sym), sym);
        }
        return sym;
    }
};
window.reactordisassembly = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor disassembly', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.innerHTML = "<div class='buildingtext'>&#10006; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3, type: "d" }, { x: 4, y: 4, type: "d" }, { x: 5, y: 3, type: "d" }, { x: 5, y: 4, type: "d" }];
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym, "disassembly");
        sym.getEntrance = function (x, y) {
            var diffy = y - sym.gridy;
            if (diffy == 1) {
                return sym.alpha.entrance;
            }
            return null;
        }
        sym.link = function (pipe, entrance) {
            var greekLoc = pipe.gridy - sym.gridy;
            var source = getSourceFromPipe(pipe);
            var greek = greekLoc == 1 ? sym.alpha : null;
            if (!greek) return;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(sym), sym);
        }
        return sym;
    }
};
window.reactorsensor = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor buildsensor', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.innerHTML = "<div class='buildingtext'>&#927; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }];
        sym.sensor = { x: 4, y: 1 };
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym, "sensor");
        sym.getEntrance = function (x, y) {
            var diffy = y - sym.gridy;
            if (diffy == 1) {
                return sym.alpha.entrance;
            }
            else if (diffy == 2) {
                return sym.beta.entrance;
            }
            return null;
        }
        sym.link = function (pipe, entrance) {
            var greekLoc = pipe.gridy - sym.gridy;
            var source = getSourceFromPipe(pipe);
            var greek = greekLoc == 1 ? sym.alpha : sym.beta;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(sym), sym);
        }
        return sym;
    }
};
window.reactorfuser = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor buildfuser', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.innerHTML = "<div class='buildingtext'>&#9901; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }];
        sym.fuser = { x: 4, y: 1 };
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym, "fuser");
        sym.getEntrance = function (x, y) {
            var diffy = y - sym.gridy;
            if (diffy == 1) {
                return sym.alpha.entrance;
            }
            else if (diffy == 2) {
                return sym.beta.entrance;
            }
            return null;
        }
        sym.link = function (pipe, entrance) {
            var greekLoc = pipe.gridy - sym.gridy;
            var source = getSourceFromPipe(pipe);
            var greek = greekLoc == 1 ? sym.alpha : sym.beta;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(sym), sym);
        }
        return sym;
    }
};
function reactorCommon(sym, name) {
    var contentContainer = getReactorCanvas(sym);
    make("div", contentContainer, "reqs");
    var els = make("div", contentContainer, "elementsProd");
    els.id = `elements${sym.id}`;
    sym.type = name;
    sym.w = 4;
    sym.h = 4;
    sym.hasEntrance = true;
    var config = {
        alpha: {
            in: [], outReqs: {}
        },
        beta: {
            in: [], outReqs: {}
        },
        bonders: sym.bonders,
        sensor: sym.sensor,
        fuser: sym.fuser
    };
    loadGame(config, contentContainer.id, sym);
    sym.alpha.entrance = sym.alpha.entrance || [];
    sym.beta.entrance = sym.beta.entrance || [];
}
function makereactor(parent, classes, selectFunction) {
    var ret = makesq("div", parent, classes, 0, 0, 4 * mapsizex / gridNumX, 4 * mapsizey / gridNumY);
    ret.onclick = function (event) {
        var currentTime = (new Date()).getTime();
        if (currentTime - doubleClick < 500) {
            openReactor(ret);
        }
        doubleClick = currentTime;
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
        }, 1000);
        event.dataTransfer.setData("text", ret.id);
    }
    var popup = make("div", document.body, "");
    popup.id = "reactorModal" + ret.id;
    popup.classList.add("modal");
    popup.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modaltext${ret.id}">
            </div>
        </div>`;
    setupModal(popup.id);
    var modalContainer = getReactorCanvas(ret);
    modalContainer.style.height = "580px";
    var symButtons = make("div", modalContainer, "symButtons");
    symButtons.id = "symButtons" + ret.id;
    return ret;
}