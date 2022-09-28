window.symbolFlipFlop = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        
        var sym = makesym('div', sq, 'symbol flipflop flip ' + greek.mode, 0, 0, 50, 50, createFFSubButtons(greek));
        sym.direction = {x:1,y:0};
        sym.name = "FlipFlop";
        sym.flip = false;
        sym.performAction = function () {
            if(sym.flip) {
                greek.waldo.direction = sym.direction;
            }
            sym.flip = !sym.flip;
            if(sym.flip) {
                sym.classList.remove("flip");
                sym.classList.add("flop");
            } else {
                sym.classList.remove("flop");
                sym.classList.add("flip");
            }
        };
        sym.reset = function () {
            sym.flip = false;
            sym.classList.remove("flop");
            sym.classList.add("flip");
        };
        setGrid(sym, sq, sq);
        return sym;
    }
}
function createFFSubButtons(greek) {
    return function () {
        var butList = [], parent = get("symButtons" + curReactor.id);
        var selSym = greek.symbols.filter(s => s.selected)[0];
        var xoffset = -400;
        clear(parent);
        butList.push(makebtn('button', parent, 'Left', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.direction = { x: -1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Right', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.direction = { x: 1, y: 0 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Up', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.direction = { x: 0, y: -1 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Down', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.direction = { x: 0, y: 1 };
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            delElement(selSym);
            clear(parent);
            var symInd = greek.symbols.indexOf(selSym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            makePath(greek.startSymbol.parentSquare, greek);
            save();
        }, 100, 50));
    };
}

window.saveSymFlipFlop = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    return ret;
};
window.symLoadFlipFlop = function (symEl, saveState) {
    symEl.direction = saveState.direction;
};
