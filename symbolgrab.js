window.symbolGrab = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol grabdrop ' + greek.mode, 0, 0, 50, 50, createGrabSubButtons(greek));
        sym.greek = greek.mode;
        sym.grab = "grabdrop";
        sym.name = "Grab";
        sym.performAction = function (greekName, g) {

            var grabbed = window.greek(sym.greek).waldo.grabbedElement;
            if (grabbed && (sym.grab == "grabdrop" || sym.grab == "drop")) {
                grabbed.grabbed = false;
                window.greek(sym.greek).waldo.grabbedElement = null;
            }
            else if (sym.grab == "grabdrop" || sym.grab == "grab") {
                for (var i = 0; i < elements.childNodes.length; i++) {
                    var element = elements.childNodes[i];
                    if (element.gridx == window.greek(sym.greek).waldo.gridx &&
                        element.gridy == window.greek(sym.greek).waldo.gridy) {
                        window.greek(sym.greek).waldo.grabbedElement = element;
                        element.grabbed = true;
                    }
                }
            }
        };
        setGrid(sym, sq, sq);
        return sym;
    }
}
function createGrabSubButtons(greek) {
    return function (sym) {
        var butList = [], parent = get("symButtons");
        var xoffset = -200;
        var selSym = greek.symbols.filter(s => s.selected)[0];
        clear(parent);

        butList.push(makebtn('button', parent, 'Grab/Drop', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "grabdrop";
            selSym.classList.add(selSym.grab);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Grab', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "grab";
            selSym.classList.add(selSym.grab);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Drop', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.grab);
            selSym.grab = "drop";
            selSym.classList.add(selSym.grab);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Delete', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            delElement(selSym);
            clear(parent);
            var symInd = greek.symbols.indexOf(selSym);
            if (~symInd) {
                greek.symbols.splice(symInd, 1);
            }
            save();
        }, 100, 50));
    }
}
window.saveSymGrab = function (sym) {
    var ret = saveBase(sym);
    ret.greek = sym.greek;
    ret.grab = sym.grab;
    return ret;
};
window.symLoadGrab = function (symEl, saveState) {
    symEl.greek = saveState.greek;
    if (saveState.grab != symEl.grab) {
        symEl.classList.remove(symEl.grab);
        symEl.classList.add(saveState.grab);
    }
    symEl.grab = saveState.grab;
};