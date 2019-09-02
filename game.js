window.onload = function () {
	window.mapsizex=600;
	window.mapsizey=480;
	var canvas = get('test123');
	window.curSymbol = 'Start';
	window.greekMode="Alpha";
	window.alpha = { paths: [], symbols: [] };
	window.beta = { paths: [], symbols: [] };
	
	makeButtons(canvas);

	makesq('div', canvas, 'blk toplblock', 0, 0, mapsizex/2, mapsizey/2);
	makesq('div', canvas, 'blk toprblock', mapsizex/2, 0, mapsizex/2, mapsizey/2);
	makesq('div', canvas, 'blk bottomlblock', 0, mapsizey/2, mapsizex/2, mapsizey/2);
	makesq('div', canvas, 'blk bottomrblock', mapsizex/2, mapsizey/2, mapsizex/2, mapsizey/2);
	
	for(var i=0;i<8;i++){
		
		for(var j=0;j<8;j++){
			var sq = makesq('div', canvas, 'square', i*(mapsizex/8), j*(mapsizey/8), mapsizex/8, mapsizey/8);
			setSqListeners(sq);
			sq.gridx=i;
			sq.gridy=j;
		}
	}
}
function setSqListeners(sq) {
	var arrows = get("arrows");
	sq.onclick = function() {
		var sym;
		if (curSymbol=="Start") {
			clear(sq);
			if (greek().startSymbol) {
				clear(greek().startSymbol.parentSquare);
			}
			sym = makesym('div', sq, 'symbol start '+greekMode, 0, 0, 50, 50, function(){
				var butList = [], parent = get("symButtons");
				butList.push(makebtns(greekMode,'button', parent, 'Start (s)', mapsizex /2 , mapsizey, function() {curSymbol="Start"}));
			});
			setGrid(sym, sq, sq);
			greek().startSymbol = sym;
			makePath(sq);
		} else if (curSymbol=="Left") {
			sym = makesym('div', arrows, 'symbol left '+greekMode, sq.gridx * mapsizex/8, sq.gridy * mapsizey/8, 20, 20);
			setGrid(sym, sq, arrows);
			sym.arrow=true;
			sym.direction = { x: -1, y: 0 };
		} else if (curSymbol=="Right") {
			sym = makesym('div', arrows, 'symbol right '+greekMode, sq.gridx * mapsizex/8, sq.gridy * mapsizey/8, 20, 20);
			setGrid(sym, sq, arrows);
			sym.arrow=true;
			sym.direction = { x: 1, y: 0 };
		} else if (curSymbol=="Up") {
			sym = makesym('div', arrows, 'symbol up '+greekMode, sq.gridx * mapsizex/8, sq.gridy * mapsizey/8, 20, 20);
			setGrid(sym, sq, arrows);
			sym.arrow=true;
			sym.direction = { x: 0, y: -1 };
		} else if (curSymbol=="Down") {
			sym = makesym('div', arrows, 'symbol down '+greekMode, sq.gridx * mapsizex/8, sq.gridy * mapsizey/8, 20, 20);
			setGrid(sym, sq, arrows);
			sym.arrow=true;
			sym.direction = { x: 0, y: 1 };
		}
		greek().symbols.push(sym);
		if(greek().startSymbol) {
			makePath(greek().startSymbol.parentSquare);
		}
	}
}
function setGrid(sym, sq, parent) {
	sym.parentSquare = parent;
	sym.gridx = sq.gridx;
	sym.gridy = sq.gridy;
}
function makePath(start) {
	var curLoc = { x: start.gridx, y: start.gridy, dir: { x: -1, y: 0 } },
		curSym ,
		newCurLoc = curLoc;
	for (var path in greek().paths) {
		delElement(greek().paths[path].path);
	}
	while ( newCurLoc.x >=0 && newCurLoc. x < 8 && newCurLoc.y >=0 && newCurLoc.y < 8) {
		var path, newCurLoc;
		curSym = symAtCoords(greek().symbols, curLoc, "arrow");
		if (curSym && curSym.arrow){
			curLoc.dir = curSym.direction;
		}
		if (curLoc.dir.x != 0) 
			path = makesq('div', start.parentNode, 'blk line '+greekMode, curLoc.x * mapsizex/8, curLoc.y * mapsizey/8, mapsizex/8, 10);
		else 
			path = makesq('div', start.parentNode, 'blk line '+greekMode, curLoc.x * mapsizex/8, curLoc.y * mapsizey/8, 10, mapsizey/8);
		curLoc.path = path;
		newCurLoc = clone(curLoc);
		greek().paths.push(newCurLoc);
		curLoc.x += curLoc.dir.x;
		curLoc.y += curLoc.dir.y;
	}
}
function symAtCoords(symbols, location, arrow) {
	for (var i = 0; i < symbols.length; i++) {
		var curSym = symbols[i];
		if(curSym.gridx == location.x && curSym.gridy == location.y) {
			if (arrow && !curSym.arrow) {
				continue;
			}
			return curSym;
		}
	}
	return null;
}
function clone(thing) {
	var newthing = {};
	for(var key in thing) {
		newthing[key] = thing[key];
	}
	return newthing;
}
function greek(){
	if (greekMode == "Alpha") 
		return alpha;
	return beta;
}
function makeButtons(canvas) {
	var buttonpos = -40;
	var buttonContainer = get('buttonContainer');
	if(!buttonContainer) {
		buttonContainer = make ('div', canvas, '');
	}
	clear(buttonContainer);
	buttonContainer.id = "buttonContainer";
	makebtns(greekMode,'button', buttonContainer, 'Start (s)', mapsizex + 10, buttonpos+=50, function() {curSymbol="Start"});
	makebtns(greekMode,'button', buttonContainer, 'In (i)', mapsizex + 10, buttonpos+=50, function() {});
	makebtns(greekMode,'button', buttonContainer, 'Out (o)', mapsizex + 10, buttonpos+=50, function() {});
	makebtns(greekMode,'button', buttonContainer, 'Join (j)', mapsizex + 10, buttonpos+=50, function() {});
	makebtns(greekMode,'button', buttonContainer, 'Up (u)', mapsizex + 10, buttonpos+=50, function() {curSymbol="Up"});
	makebtns(greekMode,'button', buttonContainer, 'Down (d)', mapsizex + 10, buttonpos+=50, function() {curSymbol="Down"});
	makebtns(greekMode,'button', buttonContainer, 'Left (l)', mapsizex + 10, buttonpos+=50, function() {curSymbol="Left"});
	makebtns(greekMode,'button', buttonContainer, 'Right (r)', mapsizex + 10, buttonpos+=50, function() {curSymbol="Right"});
	makebtns(greekMode,'button', buttonContainer, 'Switch (w)', mapsizex + 10, buttonpos+=50, function() {
		if(greekMode =='Alpha'){
			greekMode = 'Beta';
		} else {
			greekMode = 'Alpha'
		}
		makeButtons(canvas);
	});
}
function delElement(el) {
	el.remove(el);
}
function clear(el) {
	el.innerHTML= '';
}
function get(id){
	return document.getElementById(id);
}

function makebtns(greekMode,tagname, parent, text, left, top, funct) {
	var ret = makebtn(tagname, parent, text, left, top, funct);
	ret.classList.add('btn'+greekMode);
	return ret;
}
function deselectAll() {
	for(var i=0;i<greek().symbols.length;i++) {
		var sym = greek().symbols[i];
		sym.selected = false;
		sym.classList.remove("selected");
	}
}
function makesym(tagname, parent, clazz, left, top, width, height, butts) {
	var ret = makesq(tagname, parent, clazz, left, top, width, height);
	ret.onclick = function(event) {
		deselectAll();
		ret.selected = true;
		ret.classList.add("selected");
		event.stopImmediatePropagation();
		showSymSpecificButtons(butts);
		return false;
	}
	return ret;
}
function makebtn(tagname, parent, text, left, top, funct) {
	var ret = makesq(tagname, parent, '', left, top, 150, 50);
	ret.innerHTML = text;
	ret.onclick = funct;
	return ret;
}
function makesq(tagname, parent, clazz, left, top, width, height) {
	var ret = make(tagname, parent, clazz);
	ret.style.left=left+'px';
	ret.style.top=top+'px';
	ret.style.width=width+'px';
	ret.style.height=height+'px';
	return ret;
}
function make(tagname, parent, clazz) {
	if (!parent) {
		parent = document.body;
	}
	var el = document.createElement(tagname);
	parent.appendChild(el);
	if (clazz) {
		var spl = clazz.split(' ');
		for (var i=0;i<spl.length;i++){
			el.classList.add(spl[i]);
		}	
	}
	return el;
}