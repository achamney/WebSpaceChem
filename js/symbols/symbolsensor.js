import * as symsrv from './symbolservice.js';
symsrv.registerSymbol({
    place: function (greek, sq) {
        if (symAtCoords(greek.symbols, { x: sq.gridx, y: sq.gridy }, false)) return;
        var sym = makesym('div', sq, 'symbol sensorSym ' + greek.mode, 0, 0, 50, 50, makeSensorButtons(greek));
        sym.greek = greek.mode;
        sym.performAction = function (greekName, g) {
            var elements = get("elements" + curReactor.id);
            if (curReactor.reactorFeatures.sensor) {
                var element = getElOnSensor(elements, curReactor.reactorFeatures.sensor);
                if (element && element.symbol == sym.input.value) {
                    greek.waldo.direction = sym.direction;
                }
            }
        };
        sym.sensor = true;
        sym.direction = { x: -1, y: 0 };
        sym.name = "Sensor";
        setGrid(sym, sq, sq);
        var elInput = make('input', sym, '');
        sym.input = elInput;
        return sym;
    }
},"Sensor");
function getElOnSensor(elements, sen) {
    for (var el of elements.childNodes) {
        if (el.gridx == sen.gridx && el.gridy == sen.gridy) {
            return el;
        }
    }
    return null;
}
function makeSensorButtons(greek) {
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
symsrv.registerSave(function (sym) {
    var ret = saveBase(sym);
    ret.sensor = true;
    ret.direction = sym.direction;
    ret.input = sym.input.value;
    return ret;
},"Sensor");
symsrv.registerLoad(function (symEl, saveState) {
    symEl.direction = saveState.direction;
    symEl.input.value = saveState.input;
},"Sensor");
