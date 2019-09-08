window.makeParticle = function (x, y, html, greekMode, lifetime) {
    lifetime = lifetime || 1000;
    var canvas = get("canvas");
    var el = makesq("div", canvas, "particle "+greekMode.mode, x, y, 10, 10);
    el.innerHTML = html;

    var randAngle = Math.random() * Math.PI * 2;
    var xdist = Math.cos(randAngle) * Math.random() * 3;
    var ydist = Math.sin(randAngle) * Math.random() * 3;
    var int = window.setInterval(function () {
        incTop(el, ydist);
        incLeft(el, xdist);
    }, 20);
    window.setTimeout(function () {
        delElement(el);
        clearInterval(int);
    }, lifetime);
}