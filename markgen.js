window.makebtn = function (tagname, parent, text, left, top, funct, width, height) {
    width = width || 150;
    height = height || 50;
    var ret = makesq(tagname, parent, '', left, top, width, height);
    ret.innerHTML = text;
    ret.onclick = funct;
    return ret;
}
window.makesq = function(tagname, parent, clazz, left, top, width, height) {
    var ret = make(tagname, parent, clazz);
    ret.style.left = left + 'px';
    ret.style.top = top + 'px';
    ret.style.width = width + 'px';
    ret.style.height = height + 'px';
    return ret;
}
window.make = function(tagname, parent, clazz, prepend) {
    if (!parent) {
        parent = document.body;
    }
    var el = document.createElement(tagname);
    if (prepend) {
        parent.prepend(el);
    } else {
        parent.appendChild(el);
    }
    if (clazz) {
        var spl = clazz.split(' ');
        for (var i = 0; i < spl.length; i++) {
            el.classList.add(spl[i]);
        }
    }
    return el;
}
window.delElement = function(el) {
    el.remove(el);
}
window.clear = function(el) {
    el.innerHTML = '';
}
window.get = function(id) {
    return document.getElementById(id);
}

window.clone = function(thing) {
    var newthing = {};
    for (var key in thing) {
        newthing[key] = thing[key];
    }
    return newthing;
}

window.incTop = function (el, val) {
    el.style.top = parseFloat(el.style.top) + val + "px";
}
window.incLeft = function (el, val) {
    el.style.left = parseFloat(el.style.left) + val + "px";
}