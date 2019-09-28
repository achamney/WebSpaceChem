window.makePath = function(start, greek, greekMode) {
    var curLoc = { x: start.gridx, y: start.gridy, dir: greek.startSymbol.direction },
        curSym,
        newCurLoc = curLoc;
    deletePath(greek);
    function innerMakePath(curLoc, curSym) {
        while (curLoc.x >= 0 && curLoc.x < 10 && curLoc.y >= 0 && curLoc.y < 8) {
            curSym = symAtCoords(greek.symbols, curLoc, "arrow");
            var sensSym = symAtCoords(greek.symbols, curLoc);
            var oldDir = curLoc.dir;
            if (sensSym && sensSym.sensor) {
                var cloneCurLoc = clone(curLoc);
                cloneCurLoc.dir = sensSym.direction;
                createPathEl(cloneCurLoc);
                innerMakePath(cloneCurLoc, curSym);
            }
            if (curSym && curSym.arrow) {
                curLoc.dir = curSym.direction;
            }
            if (hasThisPath(greek.paths, curLoc)) {
                break;
            }
            createPathEl(curLoc, oldDir, curLoc.dir);
        }
    }
    function createPathEl(curLoc, dir1, dir2) {
        var path;
        path = makesq('img', start.parentNode, 'blk line ' + greek.mode, curLoc.x * mapsizex / 10, curLoc.y * mapsizey / 8, mapsizex / 10, mapsizey / 8);
        path.src = getPathSrc(dir1, dir2, greek.mode);
        curLoc.path = path;
        var newCurLoc = clone(curLoc);
        greek.paths.push(newCurLoc);
        curLoc.x += curLoc.dir.x;
        curLoc.y += curLoc.dir.y;
    }
    innerMakePath(curLoc, curSym, newCurLoc);
    function hasThisPath(paths, curLoc) {
        for (var path of paths) {
            if (curLoc.x == path.x && curLoc.y == path.y &&
                curLoc.dir.x == path.dir.x && curLoc.dir.y == path.dir.y) {
                return true;
            }
        }
        return false;
    }
    function getPathSrc(d1, d2, greek) {
        var base = "img/";
        d1 = d1 || {};
        if ((!d1 || d1.y == 0) && d2.y == 0) return `${base}lr${greek}.png`;
        if ((!d1 || d1.x == 0) && d2.x == 0) return `${base}ud${greek}.png`;
        if (d1.x == 1 && d2.y == 1) return `${base}bl${greek}.png`;
        if (d1.x == -1 && d2.y == 1) return `${base}br${greek}.png`;
        if (d1.x == 1 && d2.y == -1) return `${base}tl${greek}.png`;
        if (d1.x == -1 && d2.y == -1) return `${base}tr${greek}.png`;
        if (d1.y == 1 && d2.x == 1) return `${base}tr${greek}.png`;
        if (d1.y == -1 && d2.x == 1) return `${base}br${greek}.png`;
        if (d1.y == 1 && d2.x == -1) return `${base}tl${greek}.png`;
        if (d1.y == -1 && d2.x == -1) return `${base}bl${greek}.png`;
    }
}

function deletePath(greek) {
    for (var path in greek.paths) {
        delElement(greek.paths[path].path);
    }
    greek.paths = [];
}