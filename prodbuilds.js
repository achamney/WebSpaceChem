
window.makeSource = function (sq, inData) {
    var source = makesq("div", sq, "building source", 0, 0, inData.w * mapsizex / gridNumX, inData.h * mapsizey / gridNumY);
    setGrid(source, sq, sq);
    source.inData = inData;
    source.w = inData.w;
    source.h = inData.h;
    source.innerHTML = "<div class='buildingtext'>" + inData.inProb[0].elements[0].name + " &#9654;&#9654;</div>"
    source.produceElement = function () {
        var parentSquare = source.downstream.parentSquare;
        makeProdElement(parentSquare, inData.inProb);
    }
    sources.push(source);
}
window.makeOut = function (sq, outData) {
    var outEl = makesq("div", sq, "building out", 0, 0, outData.w * mapsizex / gridNumX, outData.h * mapsizey / gridNumY);
    setGrid(outEl, sq, sq);
    outEl.outData = outData;
    outEl.w = outData.w;
    outEl.h = outData.h;
    outEl.innerHTML = "<div class='buildingtext'>" + outData.elements[0].name + "&#9654;</div>";
    outEl.entrance = [];
    outEl.getEntrance = function (x, y) {
        var diff = y - outEl.gridy;
        if (diff == 1) {
            return outEl.entrance;
        }
        return null;
    };
    outEl.link = function () { };
    outs.push(outEl);
}
window.reactorstandard = {
    place: function (sq) {
        if (prodCollide(sq, null, { x: 4, y: 4 })) return;
        var sym = makereactor(sq, 'building reactor standard', makeProdDelButton());
        setGrid(sym, sq, sq);
        sym.w = 4;
        sym.h = 4;
        sym.innerHTML = "<div class='buildingtext'>&#9654; &#8478; &#9654;</div>";
        sym.bonders = [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }];
        sym.outPipes = [];
        var pipe1Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 1 });
        var pipe2Spot = symAtCoords(productionSquares, { x: sq.gridx + 4, y: sq.gridy + 2 });
        sym.outPipes.push(makePipe(pipe1Spot, { x: 1, y: 0 }, sym));
        sym.outPipes.push(makePipe(pipe2Spot, { x: 1, y: 0 }, sym));
        reactorCommon(sym);
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
            var greek = greekLoc == 1 ? reactor.alpha : reactor.beta;
            if (source.inData) {
                greek.in = source.inData.inProb;
            } else {
                greek.in = [];
            }
            makeRequirements(getReactorCanvas(reactor), reactor);
        }
        return sym;
    }
};
function reactorCommon(sym) {
    var contentContainer = getReactorCanvas(sym);
    make("div", contentContainer, "requirements");
    var els = make("div", contentContainer, "elementsProd");
    els.id = `elements${sym.id}`;

    var config = {
        alpha: {
            in: [], outReqs: {}
        },
        beta: {
            in: [], outReqs: {}
        },
        bonders: sym.bonders
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