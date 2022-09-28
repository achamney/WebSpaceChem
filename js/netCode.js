window.netService = {
    get: function (id) { },
    set: function (json) { },
    make: function (json) {}
}
function PythonAnywhereService() {
    var MASTERURL = location.protocol+"//achamney.pythonanywhere.com/";
    this.set = function (json, id) {
        return $.ajax({
            url: MASTERURL+"set/"+id,
            type: "POST",
            data: JSON.stringify(json),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).then(function (data, textStatus, jqXHR) {
            data = JSON.parse(data);
            return data;
        });
    }
    this.get = function(id) {
        return $.get(MASTERURL+id)
          .then(function (data, textStatus, jqXHR) {
              data = JSON.parse(data);
              return data;
          });
    }
    this.make = async function(json) {
        try {
          var data = await $.ajax({
              url: MASTERURL+"make",
              type: "POST",
              data: JSON.stringify(json),
              contentType: "application/json; charset=utf-8",
              dataType: "json"
          });
        } catch (e) {
          console.log(e);
        }
        debugger;
        return data;
    }
}

window.netService = new PythonAnywhereService();

function MockNetService() {
    this.get = function () {

    }
    this.set = function () {

    }
    this.make = function () {

    }
}
