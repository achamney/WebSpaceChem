window.setupModal = function (id) {
    var modal = document.getElementById(id);
    // Get the <span> element that closes the modal
    var span = $(modal).find(".close")[0];
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
}
setupModal("myModal");

window.openHighScores = function (symbols) {
    var modal = get("myModal");
    modal.style.display = "block";
    var contentContainer = get("modaltext");
    contentContainer.style.height = "400px";
    clear(contentContainer);
    var curScoreText = make("div", contentContainer, "");
    curScoreText.innerHTML = "Mission successful. Total symbols: [" + (symbols) +
        "]. Total cycles: [" + cycles + "].";
    var level = personalData.levels.filter(l => l.name == levelName)[0];
    if (level.symbols) {
        var prevScoreText = make("div", contentContainer, "");
        prevScoreText.innerHTML = "Previous best symbols: [" + level.symbols +
            "]. Previous best cycles: [" + level.cycles + "]";
    }

    var scoreArray = [];
    getAllScores(scoreArray).then(() => {
        var minMaxs = getMinMaxCount(scoreArray);
        var cyclesDiv = make("div", contentContainer, "");
        var symbolsDiv = make("div", contentContainer, "");
        var title = make("div", contentContainer, "centered statstitle");
        title.innerHTML = "Global Stats";
        makeHisto(symbolsDiv, minMaxs.minSymbols, minMaxs.maxSymbols, "symbols",
            scoreArray, minMaxs.count, 20, level.symbols);
        makeHisto(cyclesDiv, minMaxs.minCycles, minMaxs.maxCycles, "cycles",
            scoreArray, minMaxs.count, 350, level.cycles);
    });


    function getAllScores(scoreArray) {
        var promiseArray = [];
        for (var person of levelWebData.uniqueNames) {
            promiseArray.push(netService.get(person.id).then(function (data, textStatus, jqXHR) {
                if (data.levels && data.levels.length > 0) {
                    var thisLevel = data.levels.filter(l => l.name == levelName)[0];
                    if (thisLevel) {
                        scoreArray.push(thisLevel);
                        console.log(scoreArray);
                    }
                }
            }));
        }
        return Promise.all(promiseArray);
    }
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
    numText.innerHTML = Math.round(rstep-step);
    numText.style.left = (bins * stepWidth + offsetx + 2) + "px";
    var title = make("span", container, "titletext");
    title.innerHTML = dataName;
    title.style.bottom = (maxBarHeight + 20) + "px";
    title.style.left = (offsetx + 30) + "px";
}
function getMinMaxCount(records) {
    var minMaxs = { minCycles: 999999, minSymbols: 9999999, maxCycles: 0, maxSymbols: 0, count:0 };
    for (var record of records) {
        minMaxs.count++;
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
    for (var record of records) {
        var data = record[dataName];
        if (data >= lstep && (data < rstep || (last && data <= rstep))) {
            count++;
        }
    }
    return count;
}
