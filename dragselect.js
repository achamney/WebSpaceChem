var dragId, enableDrag;
window.primeDragSelect = function (e) {
    if (dragId) {
        deleteDrag();
    }
    var container = get('canvas');
    var selectBox = make('div', container, 'selectBox');
    selectBox.x = e.x;
    selectBox.y = e.y - 100;
    selectBox.style.left = selectBox.x + "px";
    selectBox.style.top = selectBox.y + "px";
    selectBox.style.right = selectBox.x + "px";
    selectBox.style.bottom = selectBox.y + "px";
    selectBox.style.display = "none";
    dragId = selectBox.id;
    enableDrag = false;
    window.setTimeout(function () {
        deleteDrag();
    }, 5000);
}
window.moveDragSelect = function (e) {
    if (dragId) {
        var selectBox = get(dragId);
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
window.selectSymbols = function (e) {
    if (dragId) {
        var selectBox = get(dragId);
        if (!enableDrag) {
            deleteDrag();
            return;
        }
        var allSyms = alpha.symbols.concat(beta.symbols);
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
                elTop < el2Top + 42 && elTop + elHeight > el2Top) {
                el2.selected = true;
                el2.classList.add("selected");
                e.stopImmediatePropagation();
                makeDragDelButton();
            }
        }

        deleteDrag();
    }
    
}
function deleteDrag() {
    if (get(dragId)) {
        delElement(get(dragId));
        dragId = null;
    }
}
window.makeDragDelButton = function () {
    var parent = get("symButtons");
    clear(parent);
    makebtn('button', parent, 'Delete', mapsizex / 2 - 50, mapsizey, function () {
        deleteAllSelected(alpha);
        deleteAllSelected(beta);
        alpha.startSymbol && makePath(alpha.startSymbol.parentSquare, alpha);
        beta.startSymbol && makePath(beta.startSymbol.parentSquare, beta);
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
window.makeDragSelectListeners = function () {
    document.addEventListener("mousedown", function (e) {
        primeDragSelect(e);
    });
    document.addEventListener("mouseup", function (e) {
        selectSymbols(e);
    });
    document.addEventListener("mousemove", function (e) {
        moveDragSelect(e);
    });
}