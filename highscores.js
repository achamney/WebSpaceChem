var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
document.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

window.openHighScores = function () {
    modal.style.display = "block";
    var contentContainer = get("modaltext");
    contentContainer.style.height = "400px";
    clear(contentContainer);
    var curScoreText = make("div", contentContainer, "");
    var symbols = alpha.symbols.length + beta.symbols.length;
    curScoreText.innerHTML = "Mission successful. Total symbols: [" + (symbols) +
        "]. Total cycles: [" + cycles + "].";
    var records = levelWebData[levelName][uniqueName] || {};
    if (records.symbols) {
        var prevScoreText = make("div", contentContainer, "");
        prevScoreText.innerHTML = "Previous best symbols: [" + records.symbols +
            "]. Previous best cycles: [" + records.cycles + "]";
    }
    var minMaxs = getMinMaxCount(levelWebData[levelName]);
    var cyclesDiv = make("div", contentContainer, "");
    var symbolsDiv = make("div", contentContainer, "");
    var title = make("div", contentContainer, "centered statstitle");
    title.innerHTML = "Global Stats";
    makeHisto(symbolsDiv, minMaxs.minSymbols, minMaxs.maxSymbols, "symbols",
        levelWebData[levelName], minMaxs.count, 20, records.symbols);
    makeHisto(cyclesDiv, minMaxs.minCycles, minMaxs.maxCycles, "cycles",
        levelWebData[levelName], minMaxs.count, 350, records.cycles);
}
function makeHisto(container, min, max, dataName, data, count, offsetx, myScore) {
    offsetx = offsetx || 0;
    var bins = Math.ceil(Math.max(1, Math.log(count)));
    var step = (max - min) / bins,
        lstep = min,
        rstep = min + step,
        maxBarHeight = 200,
        chartSizeX = 250,
        stepWidth = chartSizeX/bins;
    for (var i = 0; i < bins; i++) {
        var myBar = myScore >= lstep && (myScore < rstep || (i == bins - 1 && myScore <= rstep)) ? "selected" : "";
        var bar = make("div", container, "histobar "+myBar);
        var barCount = getCountForBar(lstep, rstep, dataName, data, i == bins-1);
        bar.style.height = (barCount / count * maxBarHeight) + "px";
        bar.style.left = (i * stepWidth + offsetx) + "px";
        bar.style.width = stepWidth + "px";
        var numText = make("span", container, "histoNumText");
        numText.innerHTML = Math.round(lstep);
        numText.style.left = (i * stepWidth + offsetx + 2) + "px";
        lstep += step;
        rstep += step;
    }
    var numText = make("span", container, "histoNumText");
    numText.innerHTML = Math.round(rstep);
    numText.style.left = (bins * stepWidth + offsetx + 2) + "px";
    var title = make("span", container, "titletext");
    title.innerHTML = dataName;
    title.style.bottom = (maxBarHeight + 20) + "px";
    title.style.left = (offsetx + 30) + "px";
}
function getMinMaxCount(records) {
    var minMaxs = { minCycles: 999999, minSymbols: 9999999, maxCycles: 0, maxSymbols: 0, count:0 };
    for (var recordKey in records) {
        minMaxs.count++;
        var record = records[recordKey];
        if (record.cycles > minMaxs.maxCycles) {
            minMaxs.maxCycles = record.cycles;
        }
        if (record.cycles < minMaxs.minCycles) {
            minMaxs.minCycles = record.cycles;
        }
        if (record.symbols > minMaxs.maxSymbols) {
            minMaxs.maxSymbols = record.symbols;
        }
        if (record.symbols < minMaxs.minSymbols) {
            minMaxs.minSymbols = record.symbols;
        }
    }
    return minMaxs;
}
function getCountForBar(lstep, rstep, dataName, records, last) {
    var count = 0;
    for (var recordKey in records) {
        var record = records[recordKey],
            data = record[dataName];
        if (data >= lstep && (data < rstep || (last && data <= rstep))) {
            count++;
        }
    }
    return count;
}