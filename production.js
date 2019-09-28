window.loadProduction = function(config){
	config.gridNumX = config.gridNumX || 32;
	config.gridNumY = config.gridNumY || 24;
	config.sources = config.sources || [];
	window.productionSquares = [];
    for (var i = 0; i < config.gridNumX; i++) {

        for (var j = 0; j < config.gridNumY; j++) {
            var sq = makesq('div', canvas, 'square', 
				i * (mapsizex / config.gridNumX), j * (mapsizey / config.gridNumY), 
				mapsizex / config.gridNumX, mapsizey / config.gridNumY,
                dropSymProdSq(sq));
            setProdSqListeners(sq);
            sq.gridx = i;
            sq.gridy = j;
            for (var source of config.sources) {
                if (source.x == i && source.y == j) {
                    makeBonder(sq);
                }
            }
            productionSquares.push(sq);
        }
    }
}
function dropSymProdSq(sq){
	return function(){
	}
}

function setProdSqListeners(sq) {
    sq.onclick = function () {
        var sym = window["symbol" + curSymbol].place(greek(), sq);
        if (sym) {
            greek().symbols.push(sym);
            if (greek().startSymbol) {
                makePath(greek().startSymbol.parentSquare, greek());
            }
            save();
        }
    }
}