window.symbolRotate = {
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        
        var sym = makesym('div', sq, 'symbol rotate clock ' + greek.mode, 0, 0, 50, 50, createRotateSubButtons(greek));
        sym.direction = "clock";
        sym.name = "Rotate";
        sym.performAction = function () {
            greek.waldo.action = sym.direction;
            greek.waldo.rotatePercent = 0;
        };
        setGrid(sym, sq, sq);
        return sym;
    }
}
function createRotateSubButtons(greek) {
    return function () {
        var butList = [], parent = get("symButtons");
        var selSym = greek.symbols.filter(s => s.selected)[0];
        var xoffset = -300;
        clear(parent);
        butList.push(makebtn('button', parent, 'Clockwise', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.direction);
            selSym.direction = "clock";
            selSym.classList.add(selSym.direction);
            save();
        }, 100, 50));
        butList.push(makebtn('button', parent, 'Counter Clockwise', mapsizex / 2 + (xoffset += 100), mapsizey, function () {
            selSym.classList.remove(selSym.direction);
            selSym.direction = "counter";
            selSym.classList.add(selSym.direction);
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
    };
}
window.rotateMoveElements = function (greek, timeInterval) {
    greek.waldo.rotatePercent += (100 / timeInterval);
    var ratio = greek.waldo.rotatePercent / 100;
    var moveAngle = (greek.waldo.action == "counter" ? -Math.PI / 2 * ratio : Math.PI / 2 * ratio);
    rotateElByAmount(greek.waldo, moveAngle, false);
}
window.rotateActionElements = function (greek) {
    var moveAngle = (greek.waldo.action == "counter" ? -Math.PI / 2 : Math.PI / 2);
    rotateElByAmount(greek.waldo, moveAngle, true);
    updateBondBars(greek.waldo);
}
function rotateElByAmount(waldo, moveAngle, updateGrid) {
    var sx = waldo.gridx;
    var sy = waldo.gridy;
    if (waldo.grabbedElement) {
        traverseBonds(waldo.grabbedElement, function (element) {
            var ex = element.gridx,
                ey = element.gridy,
                distance = Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy));
            var angle = Math.atan2(ey - sy, ex - sx),
                newAngle = angle + moveAngle,
                newX = Math.cos(newAngle) * distance + sx,
                newY = Math.sin(newAngle) * distance + sy;
            if (updateGrid) {
                element.gridx = Math.round(newX);
                element.gridy = Math.round(newY);
            }
            element.style.left = mapsizex / 10 * newX + "px";
            element.style.top = mapsizey / 8 * newY + "px";
        });
    }
}
function updateBondBars(waldo) {
    if (waldo.grabbedElement) {
        var bonds = [];
        traverseBonds(waldo.grabbedElement, function (element) {
            for (var bond of element.bonds) {
                if (!identicalBond(bonds, element, bond)) {
                    var bCount = element.bonds.filter(b => b == bond).length;
                    bonds.push({ count: bCount, left: element, right: bond });
                }
            }
        });
        for (var bond of bonds) {
            adjustBondBars(bond.left, 1, bond.right);
        }
    }
}
function identicalBond(bonds, el1, el2) {
    return bonds.filter(b => (b.left == el1 && b.right == el2) ||
        (b.right == el1 && b.left == el2)).length > 0;
}
window.saveSymRotate = function (sym) {
    var ret = saveBase(sym);
    ret.direction = sym.direction;
    return ret;
};
window.symLoadRotate = function (symEl, saveState) {
    if (saveState.direction != symEl.direction) {
        symEl.classList.remove(symEl.direction);
        symEl.classList.add(saveState.direction);
    }
    symEl.direction = saveState.direction;
};
