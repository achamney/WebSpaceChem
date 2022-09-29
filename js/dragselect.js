
var dragId, enableDrag, dragTimeout;
window.doubleClick = 0;
window.primeDragSelect = function (e, canvas) {
    if (dragId) {
        deleteDrag();
    }
    var selectBox = make('div', canvas, 'selectBox');
    selectBox.x = e.x;
    selectBox.y = e.y - 100;
    selectBox.style.left = selectBox.x + "px";
    selectBox.style.top = selectBox.y + "px";
    selectBox.style.right = selectBox.x + "px";
    selectBox.style.bottom = selectBox.y + "px";
    selectBox.style.display = "none";
    dragId = selectBox.id;
    enableDrag = false;
    dragTimeout = window.setTimeout(function () {
        deleteDrag();
    }, 5000);
}
window.moveDragSelect = function (e,canvas) {
    if (dragId) {
        var selectBox = get(dragId);
        if (!selectBox) {
            dragId = null;
            return;
        }
        var newX = e.x, newY = e.y - 100;
        if (newX < selectBox.x) {
            selectBox.style.left = newX + "px";
            selectBox.style.width = (selectBox.x - newX)+"px";
        } else {
            selectBox.style.width = (newX - selectBox.x)+ "px";
        }
        if (newY < selectBox.y) {
            selectBox.style.top = newY + "px";
            selectBox.style.height = (selectBox.y - newY) + "px";
        } else {
            selectBox.style.height = (newY - selectBox.y) + "px";
        }
        if (Math.abs(newX - selectBox.x) + Math.abs(newY - selectBox.y) > 10) {
            enableDrag = true;
            selectBox.style.display = "block";
        }
    }
}
window.selectSymbols = function (e, canvas) {
    window.clearInterval(dragTimeout);
    if (dragId) {
        var selectBox = get(dragId);
        if (!enableDrag) {
            deleteDrag();
            return;
        }
        var allSyms = curReactor.alpha.symbols.concat(curReactor.beta.symbols);
        deselectAll();
        var elLeft = parseInt(selectBox.style.left),
            elTop = parseInt(selectBox.style.top),
            elWidth = parseInt(selectBox.style.width),
            elHeight = parseInt(selectBox.style.height);
        for (var el2 of allSyms) {
            var el2Left = parseInt(el2.parentNode.style.left),
                el2Top = parseInt(el2.parentNode.style.top);
            if (el == el2)
                continue;
            if (elLeft < el2Left + 42 && elLeft + elWidth > el2Left &&
                elTop < el2Top + 42 && elTop + elHeight > el2Top && el2.style.display != "none") {
                el2.selected = true;
                el2.classList.add("selected");
                e.stopImmediatePropagation();
                makeDragDelButton(canvas);
            }
        }

        deleteDrag();
    }

}
export function deleteDrag() {
    if (get(dragId)) {
        delElement(get(dragId));
        dragId = null;
    }
}
export function deselectAll() {
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
window.makeDragDelButton = function (canvas) {
    var parent = $(canvas).find(".symButtons")[0];
    clear(parent);
    makebtn('button', parent, 'Delete', mapsizex / 2 - 50, mapsizey, function () {
        deleteAllSelected(curReactor.alpha);
        deleteAllSelected(curReactor.beta);
        curReactor.alpha.startSymbol && makePath(curReactor.alpha.startSymbol.parentSquare, curReactor.alpha);
        curReactor.beta.startSymbol && makePath(curReactor.beta.startSymbol.parentSquare, curReactor.beta);
        clear(parent);
        save();
    }, 100, 50);
}

function deleteAllSelected(greek) {
    for (var i = greek.symbols.length - 1; i >= 0; i--) {
        var sym = greek.symbols[i];
        if (sym.selected) {
            delElement(sym);
            greek.symbols.splice(i, 1);
            if (sym == greek.startSymbol) {
                greek.startSymbol = null;
                deletePath(greek);
            }
        }
    }
}
window.makeDragSelectListeners = function (canvas) {
    document.addEventListener("mousedown", function (e) {
        primeDragSelect(e, canvas);
    });
    document.addEventListener("mouseup", function (e) {
        selectSymbols(e,canvas);
    });
    document.addEventListener("mousemove", function (e) {
        moveDragSelect(e, canvas);
    });
}
