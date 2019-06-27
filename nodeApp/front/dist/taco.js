(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Display all signals belonging to a patient
 */
var PatientTable = /** @class */ (function () {
    /**
     *
     * @param signaux signals (results of select * from signal)
     */
    function PatientTable(signaux) {
        this.tableid = "myTable";
        // getPatientInformation : 
        var that = this;
        that.createTable(signaux);
    }
    /**
     *
     * @param signaux signals (results of select * from signal)
     */
    PatientTable.prototype.createTable = function (signaux) {
        var table = document.getElementById(this.tableid);
        // caption
        var caption = table.createCaption();
        caption.innerHTML = "Autres signaux du patient";
        caption.classList.add("h3");
        // header 
        var thead = table.createTHead();
        var columns = ["id", "Signal", "N° séjour", "Date", "Validation"];
        var nrow = 0;
        var row = thead.insertRow(nrow);
        for (var i = 0; i < columns.length; i++) {
            console.log(i);
            var cell = row.insertCell(i);
            cell.innerHTML = columns[i];
        }
        // body
        var tbody = table.createTBody();
        var that = this;
        // row by row
        signaux.forEach(function (signal) {
            var row = tbody.insertRow(nrow);
            var cell0 = row.insertCell(0);
            cell0.innerHTML = signal.id.toString();
            cell0.classList.add("italic");
            var cell1 = row.insertCell(1);
            cell1.innerHTML = signal.txt;
            cell1.classList.add("italic");
            var cell2 = row.insertCell(2);
            cell2.innerHTML = signal.nsej;
            var cell3 = row.insertCell(3);
            var date = new Date(signal.date);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            var dateString = yyyy + '-' + mm + '-' + dd;
            cell3.innerHTML = dateString;
            var cell4 = row.insertCell(4);
            cell4.appendChild(that.createButtons(signal.id, signal.validation));
            nrow = nrow + 1;
        });
    };
    /**
     * Create the buttons in the table
     * @param idSignal the id of a signal (column id of the signal table)
     * @param validation 0: nouveau, 1: validated, 2: unvalidated
     */
    PatientTable.prototype.createButtons = function (idSignal, validation) {
        /**
         *
         * @param div the div element in a td table
         * @param innerHTML the button innerHTML (valider / invalider)
         * @param idSignal the id of a signal (column id of the signal table)
         * @param value 0: nouveau, 1: validated, 2: unvalidated
         * @param classColor undefined or blue
         */
        var createButton = function (div, innerHTML, idSignal, value, classColor) {
            var button = document.createElement("button");
            button.classList.add("btn");
            if (classColor) {
                button.classList.add(classColor);
            }
            button.setAttribute("idSignal", idSignal.toString());
            button.setAttribute("value", value);
            button.name = idSignal.toString();
            // onclick : save the new value and change the class 
            button.onclick = function () {
                var idSignal = button.getAttribute("idSignal");
                var value = button.getAttribute("value"); // current value
                var name = idSignal;
                var updateStatus = {
                    idSignal: parseInt(idSignal),
                    validation: parseInt(value)
                };
                // save the new value
                $.get("/taco/updateStatus", {
                    updateStatus: updateStatus
                }, function (data, status) {
                    console.log("status:" + status);
                });
                // select the 2 buttons
                var buttons = document.getElementsByName(name);
                buttons.forEach(function (e) {
                    e.classList.remove("blue"); // remove previous class
                    var valueButton = e.getAttribute("value");
                    if (valueButton === value) { // if the value (1 or 2) of the button is equal to new value clicked by the user (toggle validate <=> unvalidate)
                        e.classList.add("blue");
                    }
                });
            };
            button.innerHTML = innerHTML;
            div.appendChild(button);
        };
        var div = document.createElement("div");
        div.classList.add("btn-group");
        div.classList.add("buttonTable");
        div.setAttribute("role", "group");
        if (validation == 0) { // nouveau 
            createButton(div, "Valider", idSignal, "1", undefined);
            createButton(div, "Invalider", idSignal, "2", undefined);
        }
        else if (validation == 1) { // already validated
            createButton(div, "Valider", idSignal, "1", "blue");
            createButton(div, "Invalider", idSignal, "2", undefined);
        }
        else if (validation == 2) { // unvalidated
            createButton(div, "Valider", idSignal, "1", undefined);
            createButton(div, "Invalider", idSignal, "2", "blue");
        }
        return (div);
    };
    return PatientTable;
}());
exports.PatientTable = PatientTable;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Retrieve the search parameters chosen by the user
 */
var SearchParameters = /** @class */ (function () {
    function SearchParameters() {
        /**
         * Dates
         */
        this.datetimepickerFromId = "datetimepickerFrom";
        this.datetimepickerToId = "datetimepickerTo";
        this.setDates(); // set the initial date values
    }
    /**
     * Retrieve the parameters set by the users
     * return Parameters
     */
    SearchParameters.prototype.getParameters = function () {
        var from;
        var fromInput = document.getElementById(this.datetimepickerFromId);
        from = fromInput.value;
        var to;
        var toInput = document.getElementById(this.datetimepickerToId);
        to = toInput.value;
        var validation = $("select[name='validation']").val().toString();
        var parameters = {
            from: from,
            to: to,
            validation: validation // 0: nouveau, 1: validated, 2: unvalidated
        };
        return (parameters);
    };
    /**
     * Function to transform a date to a string (yyyy-mm-dd)
     * @param date a date to transform
     */
    SearchParameters.prototype.getDateString = function (date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var dateString = yyyy + '-' + mm + '-' + dd;
        return (dateString);
    };
    /**
     * set initial dates
     */
    SearchParameters.prototype.setDates = function () {
        // from
        var oneMonth = new Date();
        oneMonth.setDate(oneMonth.getDate() - 31); // 1 month before today
        this.from = oneMonth;
        var from = document.getElementById(this.datetimepickerFromId);
        from.value = this.getDateString(oneMonth);
        // to
        var today = new Date();
        this.to = today;
        var to = document.getElementById(this.datetimepickerToId);
        to.value = this.getDateString(today);
    };
    return SearchParameters;
}());
exports.SearchParameters = SearchParameters;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchParameters_1 = require("./SearchParameters");
var PatientTable_1 = require("./PatientTable");
/**
 * taco.ejs
 * Display the signals
 */
var Signaux = /** @class */ (function () {
    function Signaux() {
        /**
         * ids
         */
        this.phraseId = "phrase";
        this.buttonValiderId = "buttonValider";
        this.buttonIgnorerId = "buttonIgnorer";
        this.submitSearchId = "submitSearch";
        // left, list of signals
        this.listSignalsId = "list";
        // right, patient info
        this.listInfoPatientId = "listInfoPatient";
        this.patientInfoId = "patientInfo";
        // current signals displayed
        this.resultsSignaux = [];
        this.searchParameters = new SearchParameters_1.SearchParameters();
        this.setSearchButton(); // set the onclick function of the search button
        this.disabledButtons(); // no button available till the user select a signal 
        this.getSignals(); // retrieve the signals
    }
    /**
     * set the onclick function of the search button
     */
    Signaux.prototype.setSearchButton = function () {
        var buttonSubmit = document.getElementById(this.submitSearchId);
        var that = this;
        buttonSubmit.onclick = function () {
            that.disabledButtons();
            that.setPhrase("Sélectionnez un signal");
            that.getSignals();
        };
    };
    /**
     * Retrieve the signals in the signal table given the parameters chosen by the user
     */
    Signaux.prototype.getSignals = function () {
        var that = this;
        var parameters = this.searchParameters.getParameters();
        $.get("/taco/getSignauxtoValidate", { qs: parameters }, function (resultsSignaux, status) {
            that.resultsSignaux = resultsSignaux;
            that.setSignals();
        });
    };
    /**
     * display the signals
     */
    Signaux.prototype.setSignals = function () {
        $("#" + this.listSignalsId).empty();
        this.resetPatientInfo();
        // no results
        if (this.resultsSignaux.length == 0) {
            this.disabledButtons();
            this.setPhrase("Aucun nouveau signal");
            return;
        }
        var ul = document.getElementById(this.listSignalsId);
        var that = this;
        this.resultsSignaux.forEach(function (resultSignal) {
            var a = document.createElement('a');
            var date = new Date(resultSignal.date);
            var datePrint = date.toLocaleDateString();
            var linkText = document.createTextNode("Signal n°" + (resultSignal.id) + " du " + datePrint);
            a.appendChild(linkText);
            a.href = "javascript:void(0)";
            a.id = resultSignal.id.toString();
            a.addEventListener('click', function () {
                $("#" + resultSignal.id).addClass("visited");
                that.setPhrase(resultSignal.txt);
                that.setButtons(resultSignal);
                that.resetPatientInfo();
            });
            var li = document.createElement("li");
            li.appendChild(a);
            ul.appendChild(li);
        });
    };
    /**
     *
     * @param phrase the phrase to be displayed
     */
    Signaux.prototype.setPhrase = function (phrase) {
        var p = document.getElementById(this.phraseId);
        p.innerHTML = phrase;
        return;
    };
    /**
     * set 2 buttons: validate / unvalidate
     * @param resultSignal It contains the idSignal to validate and the current status (0, 1 or 2)
     */
    Signaux.prototype.setButtons = function (resultSignal) {
        var activateButton = function (button) {
            button.classList.remove('colorButton');
            button.disabled = false;
            button.style.cursor = "pointer";
        };
        var idSignal = resultSignal.id;
        var buttonValider = document.getElementById(this.buttonValiderId);
        activateButton(buttonValider);
        var buttonIgnorer = document.getElementById(this.buttonIgnorerId);
        activateButton(buttonIgnorer);
        // onclick:
        buttonValider.onclick = this.onclick(buttonValider, resultSignal, true);
        buttonIgnorer.onclick = this.onclick(buttonIgnorer, resultSignal, false);
        var that = this;
        this.getStatus(idSignal) // check the validation status
            .then(function (updateStatus) {
            if (updateStatus.validation == 0) { // case new signal
                return;
            }
            else if (updateStatus.validation == 1) { // case validated
                buttonValider.classList.add('colorButton');
            }
            else if (updateStatus.validation == 2) { // case unvalidated
                buttonIgnorer.classList.add('colorButton');
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
    /**
     * common onclick function
     * @param idSignal the id of the signal (from the signal table)
     * @param validated the status (0,1 or 2)
     * @param that this instance
     */
    Signaux.prototype.onclickCommon = function (idSignal, validated, that) {
        var value = 0;
        if (validated) {
            value = 1; // valider
        }
        else {
            value = 2; // ignorer
        }
        var updateStatus = {
            idSignal: idSignal,
            validation: value
        };
        // update the status
        $.get("/taco/updateStatus", {
            updateStatus: updateStatus
        }, function (data, status) {
            console.log("status:" + status);
        });
        // remove colors before selecting one :
        var buttonValider = document.getElementById(this.buttonValiderId);
        var buttonIgnorer = document.getElementById(this.buttonIgnorerId);
        // remove previous colors
        buttonValider.classList.remove('colorButton');
        buttonIgnorer.classList.remove('colorButton');
        // remove patientInfo
        that.resetPatientInfo();
    };
    /**
     * the onclick function
     * @param button the button
     * @param resultSignal
     * @param validated
     */
    Signaux.prototype.onclick = function (button, resultSignal, validated) {
        var _this = this;
        var that = this;
        return (function () {
            that.onclickCommon(resultSignal.id, validated, that);
            // add color to the button
            button.classList.add('colorButton');
            // onclick2 : 
            var addLi = function (ul, txt) {
                var linkText = document.createTextNode(txt);
                var li = document.createElement("li");
                li.appendChild(linkText);
                ul.appendChild(li);
            };
            // this can't be used here
            var ul = document.getElementById("listInfoPatient");
            // num patient
            var date = new Date(resultSignal.date);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            var dateString = yyyy + '-' + mm + '-' + dd;
            addLi(ul, "N° patient: " + resultSignal.npat);
            addLi(ul, "N° séjour: " + resultSignal.nsej);
            addLi(ul, "Date: " + dateString);
            addLi(ul, "Localisation: " + resultSignal.loc);
            $.get("/taco/getPatient", {
                qs: {
                    npat: resultSignal.npat
                }
            }, function (signaux, status) {
                console.log(signaux);
                console.log("status:" + status);
                new PatientTable_1.PatientTable(signaux);
            });
            // title :
            var patientInfo = document.getElementById(_this.patientInfoId);
            var h3 = document.createElement("h3");
            h3.innerHTML = "Localisation du signal";
            patientInfo.append(h3);
            $("#" + _this.patientInfoId).prepend(h3);
            //ul.insertBefore(h3, ul);
        });
    };
    /**
     * empty the table
     */
    Signaux.prototype.resetPatientInfo = function () {
        $("#" + this.listInfoPatientId).empty();
        $("#" + this.patientInfoId + " h3").remove();
        $("");
        $("#myTable tr").remove();
        var tbl = document.getElementById("myTable"); // Get the table
        tbl.deleteCaption();
        var tbody = tbl.getElementsByTagName("tbody");
        if (tbody.length != 0) {
            tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
        }
        var thead = tbl.getElementsByTagName("thead");
        if (thead.length != 0) {
            tbl.removeChild(tbl.getElementsByTagName("thead")[0]);
        }
    };
    /**
     * make it impossible for the buttons to be clicked
     */
    Signaux.prototype.disabledButtons = function () {
        this.resetPatientInfo();
        var buttonValider = document.getElementById(this.buttonValiderId);
        var buttonIgnorer = document.getElementById(this.buttonIgnorerId);
        var disable = function (button) {
            button.disabled = true;
            button.style.cursor = "not-allowed";
            button.classList.remove('colorButton');
        };
        disable(buttonValider);
        disable(buttonIgnorer);
    };
    /**
     *
     * @param idSignal the id of a signal (in the signal table)
     */
    Signaux.prototype.getStatus = function (idSignal) {
        var updateStatus = {
            idSignal: idSignal,
            validation: 0
        };
        return (new Promise(function (resolve, reject) {
            $.get("/taco/getStatus", { updateStatus: updateStatus }, function (updateStatus, status) {
                console.log(updateStatus);
                resolve(updateStatus);
                return;
            });
        }));
    };
    return Signaux;
}());
exports.Signaux = Signaux;

},{"./PatientTable":1,"./SearchParameters":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Signaux_1 = require("./Signaux");
new Signaux_1.Signaux();

},{"./Signaux":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdGFjby9QYXRpZW50VGFibGUudHMiLCJzcmMvdGFjby9TZWFyY2hQYXJhbWV0ZXJzLnRzIiwic3JjL3RhY28vU2lnbmF1eC50cyIsInNyYy90YWNvL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0lBOztHQUVHO0FBQ0g7SUFJSTs7O09BR0c7SUFDSCxzQkFBWSxPQUE4QjtRQU56QixZQUFPLEdBQUcsU0FBUyxDQUFDO1FBT2pDLDJCQUEyQjtRQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksa0NBQVcsR0FBbEIsVUFBbUIsT0FBOEI7UUFDN0MsSUFBSSxLQUFLLEdBQXVDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLFVBQVU7UUFDVixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDcEMsT0FBTyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztRQUNoRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixVQUFVO1FBQ1YsSUFBSSxLQUFLLEdBQXFELEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsRixJQUFJLE9BQU8sR0FBa0IsQ0FBQyxJQUFJLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDaEYsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0s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LENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV4RyxJQUFJLE9BQU8sR0FBRyxVQUFTLE1BQXlCO1lBQzVDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztZQUNwQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUE7UUFDRCxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O09BR0c7SUFFSywyQkFBUyxHQUFqQixVQUFrQixRQUFnQjtRQUM5QixJQUFJLFlBQVksR0FBaUI7WUFDN0IsUUFBUSxFQUFFLFFBQVE7WUFDbEIsVUFBVSxFQUFFLENBQUM7U0FDaEIsQ0FBQTtRQUNELE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2hDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEVBQUUsVUFBVSxZQUEwQixFQUFFLE1BQU07Z0JBQ2pHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtnQkFDckIsT0FBTztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FuU0EsQUFtU0MsSUFBQTtBQW5TWSwwQkFBTzs7Ozs7QUNacEIscUNBQW9DO0FBRXBDLElBQUksaUJBQU8sRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgUGFyYW1ldGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvUGFyYW1ldGVyc1wiXG5pbXBvcnQgeyBSZXN1bHRzU2lnbmF1eCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvU2lnbmF1eFwiXG5pbXBvcnQgeyBVcGRhdGVTdGF0dXMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL1VwZGF0ZVN0YXR1c1wiXG5cbi8qKlxuICogRGlzcGxheSBhbGwgc2lnbmFscyBiZWxvbmdpbmcgdG8gYSBwYXRpZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBQYXRpZW50VGFibGUge1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSB0YWJsZWlkID0gXCJteVRhYmxlXCI7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gc2lnbmF1eCBzaWduYWxzIChyZXN1bHRzIG9mIHNlbGVjdCAqIGZyb20gc2lnbmFsKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNpZ25hdXg6IEFycmF5PFJlc3VsdHNTaWduYXV4Pikge1xuICAgICAgICAvLyBnZXRQYXRpZW50SW5mb3JtYXRpb24gOiBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGF0LmNyZWF0ZVRhYmxlKHNpZ25hdXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBzaWduYXV4IHNpZ25hbHMgKHJlc3VsdHMgb2Ygc2VsZWN0ICogZnJvbSBzaWduYWwpXG4gICAgICovXG4gICAgcHVibGljIGNyZWF0ZVRhYmxlKHNpZ25hdXg6IEFycmF5PFJlc3VsdHNTaWduYXV4Pik6IHZvaWQge1xuICAgICAgICB2YXIgdGFibGU6IEhUTUxUYWJsZUVsZW1lbnQgPSA8SFRNTFRhYmxlRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhYmxlaWQpO1xuXG4gICAgICAgIC8vIGNhcHRpb25cbiAgICAgICAgdmFyIGNhcHRpb24gPSB0YWJsZS5jcmVhdGVDYXB0aW9uKCk7XG4gICAgICAgIGNhcHRpb24uaW5uZXJIVE1MID0gXCJBdXRyZXMgc2lnbmF1eCBkdSBwYXRpZW50XCI7XG4gICAgICAgIGNhcHRpb24uY2xhc3NMaXN0LmFkZChcImgzXCIpO1xuXG4gICAgICAgIC8vIGhlYWRlciBcbiAgICAgICAgbGV0IHRoZWFkOiBIVE1MVGFibGVTZWN0aW9uRWxlbWVudCA9IDxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD50YWJsZS5jcmVhdGVUSGVhZCgpO1xuICAgICAgICBsZXQgY29sdW1uczogQXJyYXk8c3RyaW5nPiA9IFtcImlkXCIsXCJTaWduYWxcIiwgXCJOwrAgc8Opam91clwiLCBcIkRhdGVcIiwgXCJWYWxpZGF0aW9uXCJdO1xuICAgICAgICB2YXIgbnJvdyA9IDA7XG4gICAgICAgIGxldCByb3cgPSB0aGVhZC5pbnNlcnRSb3cobnJvdyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaSk7XG4gICAgICAgICAgICBsZXQgY2VsbCA9IHJvdy5pbnNlcnRDZWxsKGkpO1xuICAgICAgICAgICAgY2VsbC5pbm5lckhUTUwgPSBjb2x1bW5zW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYm9keVxuICAgICAgICBsZXQgdGJvZHk6IEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50ID0gPEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PnRhYmxlLmNyZWF0ZVRCb2R5KCk7XG4gICAgICAgIHZhciB0aGF0PXRoaXM7XG5cbiAgICAgICAgLy8gcm93IGJ5IHJvd1xuICAgICAgICBzaWduYXV4LmZvckVhY2goKHNpZ25hbCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHRib2R5Lmluc2VydFJvdyhucm93KTtcblxuICAgICAgICAgICAgbGV0IGNlbGwwID0gcm93Lmluc2VydENlbGwoMCk7XG4gICAgICAgICAgICBjZWxsMC5pbm5lckhUTUwgPSBzaWduYWwuaWQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGNlbGwwLmNsYXNzTGlzdC5hZGQoXCJpdGFsaWNcIik7XG5cblxuICAgICAgICAgICAgbGV0IGNlbGwxID0gcm93Lmluc2VydENlbGwoMSk7XG4gICAgICAgICAgICBjZWxsMS5pbm5lckhUTUwgPSBzaWduYWwudHh0O1xuICAgICAgICAgICAgY2VsbDEuY2xhc3NMaXN0LmFkZChcIml0YWxpY1wiKTtcblxuICAgICAgICAgICAgbGV0IGNlbGwyID0gcm93Lmluc2VydENlbGwoMik7XG4gICAgICAgICAgICBjZWxsMi5pbm5lckhUTUwgPSBzaWduYWwubnNlajtcblxuICAgICAgICAgICAgbGV0IGNlbGwzID0gcm93Lmluc2VydENlbGwoMyk7XG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKHNpZ25hbC5kYXRlKTtcbiAgICAgICAgICAgIHZhciBkZCA9IFN0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgIHZhciBtbSA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpOyAvL0phbnVhcnkgaXMgMCFcbiAgICAgICAgICAgIHZhciB5eXl5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgbGV0IGRhdGVTdHJpbmcgPSB5eXl5ICsgJy0nICsgbW0gKyAnLScgKyBkZDtcbiAgICAgICAgICAgIGNlbGwzLmlubmVySFRNTCA9IGRhdGVTdHJpbmc7XG5cbiAgICAgICAgICAgIGxldCBjZWxsNCA9IHJvdy5pbnNlcnRDZWxsKDQpO1xuICAgICAgICAgICAgY2VsbDQuYXBwZW5kQ2hpbGQodGhhdC5jcmVhdGVCdXR0b25zKHNpZ25hbC5pZCwgc2lnbmFsLnZhbGlkYXRpb24pKTtcbiAgICAgICAgICAgIG5yb3cgPSBucm93ICsgMTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdGhlIGJ1dHRvbnMgaW4gdGhlIHRhYmxlXG4gICAgICogQHBhcmFtIGlkU2lnbmFsIHRoZSBpZCBvZiBhIHNpZ25hbCAoY29sdW1uIGlkIG9mIHRoZSBzaWduYWwgdGFibGUpXG4gICAgICogQHBhcmFtIHZhbGlkYXRpb24gMDogbm91dmVhdSwgMTogdmFsaWRhdGVkLCAyOiB1bnZhbGlkYXRlZFxuICAgICAqL1xuICAgIHByaXZhdGUgY3JlYXRlQnV0dG9ucyhpZFNpZ25hbDpudW1iZXIsIHZhbGlkYXRpb246IG51bWJlcik6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gZGl2IHRoZSBkaXYgZWxlbWVudCBpbiBhIHRkIHRhYmxlXG4gICAgICAgICAqIEBwYXJhbSBpbm5lckhUTUwgdGhlIGJ1dHRvbiBpbm5lckhUTUwgKHZhbGlkZXIgLyBpbnZhbGlkZXIpXG4gICAgICAgICAqIEBwYXJhbSBpZFNpZ25hbCB0aGUgaWQgb2YgYSBzaWduYWwgKGNvbHVtbiBpZCBvZiB0aGUgc2lnbmFsIHRhYmxlKVxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUgMDogbm91dmVhdSwgMTogdmFsaWRhdGVkLCAyOiB1bnZhbGlkYXRlZFxuICAgICAgICAgKiBAcGFyYW0gY2xhc3NDb2xvciB1bmRlZmluZWQgb3IgYmx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKGRpdjpIVE1MRWxlbWVudCwgaW5uZXJIVE1MOnN0cmluZywgaWRTaWduYWw6bnVtYmVyLCB2YWx1ZTpzdHJpbmcsIGNsYXNzQ29sb3I6IHN0cmluZ3x1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIik7XG4gICAgICAgICAgICBpZiAoY2xhc3NDb2xvcil7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NDb2xvcik7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImlkU2lnbmFsXCIsaWRTaWduYWwudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidmFsdWVcIix2YWx1ZSk7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGlkU2lnbmFsLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIC8vIG9uY2xpY2sgOiBzYXZlIHRoZSBuZXcgdmFsdWUgYW5kIGNoYW5nZSB0aGUgY2xhc3MgXG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9ICgpID0+e1xuICAgICAgICAgICAgICAgIGxldCBpZFNpZ25hbCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJpZFNpZ25hbFwiKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTsgLy8gY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gaWRTaWduYWw7XG5cbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlU3RhdHVzOiBVcGRhdGVTdGF0dXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkU2lnbmFsOiAgcGFyc2VJbnQoaWRTaWduYWwpLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGUgbmV3IHZhbHVlXG4gICAgICAgICAgICAgICAgJC5nZXQoXCIvdGFjby91cGRhdGVTdGF0dXNcIiwge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVTdGF0dXM6IHVwZGF0ZVN0YXR1c1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGF0dXM6XCIgKyBzdGF0dXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSAyIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9ucyA9ICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lKTtcbiAgICAgICAgICAgICAgICBidXR0b25zLmZvckVhY2goKGUpID0+e1xuICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoXCJibHVlXCIpOyAvLyByZW1vdmUgcHJldmlvdXMgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlQnV0dG9uID0gZS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlQnV0dG9uID09PSB2YWx1ZSl7IC8vIGlmIHRoZSB2YWx1ZSAoMSBvciAyKSBvZiB0aGUgYnV0dG9uIGlzIGVxdWFsIHRvIG5ldyB2YWx1ZSBjbGlja2VkIGJ5IHRoZSB1c2VyICh0b2dnbGUgdmFsaWRhdGUgPD0+IHVudmFsaWRhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoXCJibHVlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgYnV0dG9uLmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiYnRuLWdyb3VwXCIpO1xuICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImJ1dHRvblRhYmxlXCIpO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLFwiZ3JvdXBcIik7XG5cbiAgICAgICAgaWYgKHZhbGlkYXRpb24gPT0gMCl7IC8vIG5vdXZlYXUgXG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIlZhbGlkZXJcIixpZFNpZ25hbCxcIjFcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbihkaXYsIFwiSW52YWxpZGVyXCIsaWRTaWduYWwsXCIyXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsaWRhdGlvbiA9PSAxKXsgLy8gYWxyZWFkeSB2YWxpZGF0ZWRcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbihkaXYsIFwiVmFsaWRlclwiLGlkU2lnbmFsLFwiMVwiLCBcImJsdWVcIik7XG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIkludmFsaWRlclwiLGlkU2lnbmFsLFwiMlwiLCB1bmRlZmluZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbGlkYXRpb24gPT0gMil7IC8vIHVudmFsaWRhdGVkXG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIlZhbGlkZXJcIixpZFNpZ25hbCxcIjFcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbihkaXYsIFwiSW52YWxpZGVyXCIsaWRTaWduYWwsXCIyXCIsIFwiYmx1ZVwiKTtcbiAgICAgICAgfSBcblxuICAgICAgICByZXR1cm4oZGl2KTtcbiAgICB9XG59ICIsImltcG9ydCB7UGFyYW1ldGVyc30gIGZyb20gXCIuLi8uLi9zaGFyZWQvUGFyYW1ldGVyc1wiXG5cbi8qKlxuICogUmV0cmlldmUgdGhlIHNlYXJjaCBwYXJhbWV0ZXJzIGNob3NlbiBieSB0aGUgdXNlclxuICovXG5leHBvcnQgY2xhc3MgU2VhcmNoUGFyYW1ldGVycyB7XG4gICAgLyoqXG4gICAgICogRGF0ZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGV0aW1lcGlja2VyRnJvbUlkOiBzdHJpbmcgPSBcImRhdGV0aW1lcGlja2VyRnJvbVwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZGF0ZXRpbWVwaWNrZXJUb0lkOiBzdHJpbmcgPSBcImRhdGV0aW1lcGlja2VyVG9cIjtcblxuICAgIC8vIGNob3NlbiB2YWx1ZVxuICAgIHByaXZhdGUgZnJvbTogRGF0ZTtcbiAgICBwcml2YXRlIHRvOiBEYXRlO1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zZXREYXRlcygpOyAvLyBzZXQgdGhlIGluaXRpYWwgZGF0ZSB2YWx1ZXNcbiAgICB9IFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHBhcmFtZXRlcnMgc2V0IGJ5IHRoZSB1c2Vyc1xuICAgICAqIHJldHVybiBQYXJhbWV0ZXJzXG4gICAgICovXG4gICAgcHVibGljIGdldFBhcmFtZXRlcnMoKTogUGFyYW1ldGVycyB7XG4gICAgICAgIGxldCBmcm9tOiBzdHJpbmc7XG4gICAgICAgIGxldCBmcm9tSW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRhdGV0aW1lcGlja2VyRnJvbUlkKTtcbiAgICAgICAgZnJvbSA9IGZyb21JbnB1dC52YWx1ZSA7XG5cbiAgICAgICAgbGV0IHRvOiBzdHJpbmc7XG4gICAgICAgIGxldCB0b0lucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kYXRldGltZXBpY2tlclRvSWQpO1xuICAgICAgICB0byA9IHRvSW5wdXQudmFsdWUgO1xuXG4gICAgICAgIGxldCB2YWxpZGF0aW9uID0gJChcInNlbGVjdFtuYW1lPSd2YWxpZGF0aW9uJ11cIikudmFsKCkudG9TdHJpbmcoKTtcbiAgICAgICAgXG4gICAgICAgIGxldCBwYXJhbWV0ZXJzOlBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBmcm9tOmZyb20sXG4gICAgICAgICAgICB0bzp0byxcbiAgICAgICAgICAgIHZhbGlkYXRpb246dmFsaWRhdGlvbiAvLyAwOiBub3V2ZWF1LCAxOiB2YWxpZGF0ZWQsIDI6IHVudmFsaWRhdGVkXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuKHBhcmFtZXRlcnMpO1xuICAgIH0gXG5cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIHRyYW5zZm9ybSBhIGRhdGUgdG8gYSBzdHJpbmcgKHl5eXktbW0tZGQpXG4gICAgICogQHBhcmFtIGRhdGUgYSBkYXRlIHRvIHRyYW5zZm9ybVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RGF0ZVN0cmluZyhkYXRlOkRhdGUpOiBzdHJpbmd7XG4gICAgICAgIHZhciBkZCA9IFN0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgdmFyIG1tID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7IC8vSmFudWFyeSBpcyAwIVxuICAgICAgICB2YXIgeXl5eSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgbGV0IGRhdGVTdHJpbmcgPSB5eXl5ICsgJy0nICsgbW0gKyAnLScgKyBkZCA7XG4gICAgICAgIHJldHVybihkYXRlU3RyaW5nKVxuICAgIH0gXG5cbiAgICAvKipcbiAgICAgKiBzZXQgaW5pdGlhbCBkYXRlc1xuICAgICAqL1xuICAgIHByaXZhdGUgc2V0RGF0ZXMoKTogdm9pZCB7XG4gICAgICAgIC8vIGZyb21cbiAgICAgICAgbGV0IG9uZU1vbnRoOkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBvbmVNb250aC5zZXREYXRlKG9uZU1vbnRoLmdldERhdGUoKSAtIDMxKTsgLy8gMSBtb250aCBiZWZvcmUgdG9kYXlcbiAgICAgICAgdGhpcy5mcm9tID0gb25lTW9udGg7XG4gICAgICAgIGxldCBmcm9tOiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kYXRldGltZXBpY2tlckZyb21JZCk7XG4gICAgICAgIGZyb20udmFsdWUgPSB0aGlzLmdldERhdGVTdHJpbmcob25lTW9udGgpO1xuXG4gICAgICAgIC8vIHRvXG4gICAgICAgIGxldCB0b2RheTpEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy50byA9IHRvZGF5O1xuICAgICAgICB2YXIgdG86IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRhdGV0aW1lcGlja2VyVG9JZCk7XG4gICAgICAgIHRvLnZhbHVlID0gdGhpcy5nZXREYXRlU3RyaW5nKHRvZGF5KTsgXG4gICAgfVxufSAiLCJpbXBvcnQgeyBSZXN1bHRzU2lnbmF1eCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvU2lnbmF1eFwiXG5pbXBvcnQgeyBVcGRhdGVTdGF0dXMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL1VwZGF0ZVN0YXR1c1wiXG5cbmltcG9ydCB7IFNlYXJjaFBhcmFtZXRlcnMgfSBmcm9tIFwiLi9TZWFyY2hQYXJhbWV0ZXJzXCJcbmltcG9ydCB7IFBhcmFtZXRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL1BhcmFtZXRlcnNcIlxuXG5pbXBvcnQge1BhdGllbnRUYWJsZX0gIGZyb20gXCIuL1BhdGllbnRUYWJsZVwiXG5cbi8qKlxuICogdGFjby5lanNcbiAqIERpc3BsYXkgdGhlIHNpZ25hbHMgXG4gKi9cbmV4cG9ydCBjbGFzcyBTaWduYXV4IHtcbiAgICAvKipcbiAgICAgKiBpZHNcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IHBocmFzZUlkOiBzdHJpbmcgPSBcInBocmFzZVwiO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYnV0dG9uVmFsaWRlcklkOiBzdHJpbmcgPSBcImJ1dHRvblZhbGlkZXJcIjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJ1dHRvbklnbm9yZXJJZDogc3RyaW5nID0gXCJidXR0b25JZ25vcmVyXCI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzdWJtaXRTZWFyY2hJZDogc3RyaW5nID0gXCJzdWJtaXRTZWFyY2hcIjtcblxuICAgIC8vIGxlZnQsIGxpc3Qgb2Ygc2lnbmFsc1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdFNpZ25hbHNJZDogc3RyaW5nID0gXCJsaXN0XCI7IFxuXG4gICAgLy8gcmlnaHQsIHBhdGllbnQgaW5mb1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdEluZm9QYXRpZW50SWQ6IHN0cmluZyA9IFwibGlzdEluZm9QYXRpZW50XCI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXRpZW50SW5mb0lkOiBzdHJpbmcgPSBcInBhdGllbnRJbmZvXCI7XG5cblxuICAgIHByaXZhdGUgc2VhcmNoUGFyYW1ldGVyczogU2VhcmNoUGFyYW1ldGVycztcblxuICAgIC8vIGN1cnJlbnQgc2lnbmFscyBkaXNwbGF5ZWRcbiAgICBwcml2YXRlIHJlc3VsdHNTaWduYXV4OiBBcnJheTxSZXN1bHRzU2lnbmF1eD4gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNlYXJjaFBhcmFtZXRlcnMgPSBuZXcgU2VhcmNoUGFyYW1ldGVycygpO1xuICAgICAgICB0aGlzLnNldFNlYXJjaEJ1dHRvbigpOyAvLyBzZXQgdGhlIG9uY2xpY2sgZnVuY3Rpb24gb2YgdGhlIHNlYXJjaCBidXR0b25cbiAgICAgICAgdGhpcy5kaXNhYmxlZEJ1dHRvbnMoKTsgLy8gbm8gYnV0dG9uIGF2YWlsYWJsZSB0aWxsIHRoZSB1c2VyIHNlbGVjdCBhIHNpZ25hbCBcbiAgICAgICAgdGhpcy5nZXRTaWduYWxzKCk7IC8vIHJldHJpZXZlIHRoZSBzaWduYWxzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0IHRoZSBvbmNsaWNrIGZ1bmN0aW9uIG9mIHRoZSBzZWFyY2ggYnV0dG9uXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRTZWFyY2hCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIHZhciBidXR0b25TdWJtaXQ6IEhUTUxCdXR0b25FbGVtZW50ID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3VibWl0U2VhcmNoSWQpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGJ1dHRvblN1Ym1pdC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5kaXNhYmxlZEJ1dHRvbnMoKVxuICAgICAgICAgICAgdGhhdC5zZXRQaHJhc2UoXCJTw6lsZWN0aW9ubmV6IHVuIHNpZ25hbFwiKVxuICAgICAgICAgICAgdGhhdC5nZXRTaWduYWxzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgc2lnbmFscyBpbiB0aGUgc2lnbmFsIHRhYmxlIGdpdmVuIHRoZSBwYXJhbWV0ZXJzIGNob3NlbiBieSB0aGUgdXNlclxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0U2lnbmFscygpOiB2b2lkIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBsZXQgcGFyYW1ldGVyczogUGFyYW1ldGVycyA9IHRoaXMuc2VhcmNoUGFyYW1ldGVycy5nZXRQYXJhbWV0ZXJzKCk7XG4gICAgICAgICQuZ2V0KFwiL3RhY28vZ2V0U2lnbmF1eHRvVmFsaWRhdGVcIiwgeyBxczogcGFyYW1ldGVycyB9LCBmdW5jdGlvbiAocmVzdWx0c1NpZ25hdXg6IEFycmF5PFJlc3VsdHNTaWduYXV4Piwgc3RhdHVzKSB7XG4gICAgICAgICAgICB0aGF0LnJlc3VsdHNTaWduYXV4ID0gcmVzdWx0c1NpZ25hdXg7XG4gICAgICAgICAgICB0aGF0LnNldFNpZ25hbHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZGlzcGxheSB0aGUgc2lnbmFsc1xuICAgICAqL1xuICAgIHByaXZhdGUgc2V0U2lnbmFscygpOiB2b2lkIHtcbiAgICAgICAgJChcIiNcIiArIHRoaXMubGlzdFNpZ25hbHNJZCkuZW1wdHkoKTtcbiAgICAgICAgdGhpcy5yZXNldFBhdGllbnRJbmZvKCk7XG5cbiAgICAgICAgLy8gbm8gcmVzdWx0c1xuICAgICAgICBpZiAodGhpcy5yZXN1bHRzU2lnbmF1eC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UGhyYXNlKFwiQXVjdW4gbm91dmVhdSBzaWduYWxcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bDogSFRNTFVMaXN0RWxlbWVudCA9IDxIVE1MVUxpc3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubGlzdFNpZ25hbHNJZCk7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlc3VsdHNTaWduYXV4LmZvckVhY2goKHJlc3VsdFNpZ25hbDogUmVzdWx0c1NpZ25hdXgpID0+IHtcblxuICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFNpZ25hbC5kYXRlKTtcbiAgICAgICAgICAgIHZhciBkYXRlUHJpbnQgPSBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgdmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJTaWduYWwgbsKwXCIgKyAocmVzdWx0U2lnbmFsLmlkKSArIFwiIGR1IFwiICsgZGF0ZVByaW50KTtcbiAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYS5ocmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIjtcbiAgICAgICAgICAgIGEuaWQgPSByZXN1bHRTaWduYWwuaWQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHJlc3VsdFNpZ25hbC5pZCkuYWRkQ2xhc3MoXCJ2aXNpdGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0UGhyYXNlKHJlc3VsdFNpZ25hbC50eHQpO1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0QnV0dG9ucyhyZXN1bHRTaWduYWwpO1xuICAgICAgICAgICAgICAgIHRoYXQucmVzZXRQYXRpZW50SW5mbygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gcGhyYXNlIHRoZSBwaHJhc2UgdG8gYmUgZGlzcGxheWVkXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRQaHJhc2UocGhyYXNlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdmFyIHA6IEhUTUxQYXJhZ3JhcGhFbGVtZW50ID0gPEhUTUxQYXJhZ3JhcGhFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMucGhyYXNlSWQpO1xuICAgICAgICBwLmlubmVySFRNTCA9IHBocmFzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldCAyIGJ1dHRvbnM6IHZhbGlkYXRlIC8gdW52YWxpZGF0ZVxuICAgICAqIEBwYXJhbSByZXN1bHRTaWduYWwgSXQgY29udGFpbnMgdGhlIGlkU2lnbmFsIHRvIHZhbGlkYXRlIGFuZCB0aGUgY3VycmVudCBzdGF0dXMgKDAsIDEgb3IgMilcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldEJ1dHRvbnMocmVzdWx0U2lnbmFsOiBSZXN1bHRzU2lnbmF1eCk6IHZvaWQge1xuICAgICAgICBcbiAgICAgICAgbGV0IGFjdGl2YXRlQnV0dG9uID0gZnVuY3Rpb24oYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCk6IHZvaWQge1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbG9yQnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGlkU2lnbmFsID0gcmVzdWx0U2lnbmFsLmlkO1xuXG4gICAgICAgIHZhciBidXR0b25WYWxpZGVyOiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJ1dHRvblZhbGlkZXJJZCk7XG4gICAgICAgIGFjdGl2YXRlQnV0dG9uKGJ1dHRvblZhbGlkZXIpO1xuICAgICAgICB2YXIgYnV0dG9uSWdub3JlcjogSFRNTEJ1dHRvbkVsZW1lbnQgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5idXR0b25JZ25vcmVySWQpO1xuICAgICAgICBhY3RpdmF0ZUJ1dHRvbihidXR0b25JZ25vcmVyKTtcblxuICAgICAgICAvLyBvbmNsaWNrOlxuICAgICAgICBidXR0b25WYWxpZGVyLm9uY2xpY2sgPSB0aGlzLm9uY2xpY2soYnV0dG9uVmFsaWRlciwgcmVzdWx0U2lnbmFsLCB0cnVlKTtcbiAgICAgICAgYnV0dG9uSWdub3Jlci5vbmNsaWNrID0gdGhpcy5vbmNsaWNrKGJ1dHRvbklnbm9yZXIsIHJlc3VsdFNpZ25hbCwgZmFsc2UpO1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5nZXRTdGF0dXMoaWRTaWduYWwpIC8vIGNoZWNrIHRoZSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgICAgICAgICAgLnRoZW4oKHVwZGF0ZVN0YXR1czogVXBkYXRlU3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVN0YXR1cy52YWxpZGF0aW9uID09IDApIHsgLy8gY2FzZSBuZXcgc2lnbmFsXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHVwZGF0ZVN0YXR1cy52YWxpZGF0aW9uID09IDEpIHsgLy8gY2FzZSB2YWxpZGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uVmFsaWRlci5jbGFzc0xpc3QuYWRkKCdjb2xvckJ1dHRvbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodXBkYXRlU3RhdHVzLnZhbGlkYXRpb24gPT0gMikgeyAvLyBjYXNlIHVudmFsaWRhdGVkXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbklnbm9yZXIuY2xhc3NMaXN0LmFkZCgnY29sb3JCdXR0b24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb21tb24gb25jbGljayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSBpZFNpZ25hbCB0aGUgaWQgb2YgdGhlIHNpZ25hbCAoZnJvbSB0aGUgc2lnbmFsIHRhYmxlKVxuICAgICAqIEBwYXJhbSB2YWxpZGF0ZWQgdGhlIHN0YXR1cyAoMCwxIG9yIDIpXG4gICAgICogQHBhcmFtIHRoYXQgdGhpcyBpbnN0YW5jZVxuICAgICAqL1xuICAgIHByaXZhdGUgb25jbGlja0NvbW1vbihpZFNpZ25hbDogbnVtYmVyLHZhbGlkYXRlZDogYm9vbGVhbiwgdGhhdDphbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcbiAgICAgICAgaWYgKHZhbGlkYXRlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSAxOyAvLyB2YWxpZGVyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDI7IC8vIGlnbm9yZXJcbiAgICAgICAgfVxuICAgICAgICBsZXQgdXBkYXRlU3RhdHVzOiBVcGRhdGVTdGF0dXMgPSB7XG4gICAgICAgICAgICBpZFNpZ25hbDogaWRTaWduYWwsXG4gICAgICAgICAgICB2YWxpZGF0aW9uOiB2YWx1ZVxuICAgICAgICB9XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc3RhdHVzXG4gICAgICAgICQuZ2V0KFwiL3RhY28vdXBkYXRlU3RhdHVzXCIsIHtcbiAgICAgICAgICAgIHVwZGF0ZVN0YXR1czogdXBkYXRlU3RhdHVzXG4gICAgICAgIH0sIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhdHVzOlwiICsgc3RhdHVzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGNvbG9ycyBiZWZvcmUgc2VsZWN0aW5nIG9uZSA6XG4gICAgICAgIHZhciBidXR0b25WYWxpZGVyOiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJ1dHRvblZhbGlkZXJJZCk7XG4gICAgICAgIHZhciBidXR0b25JZ25vcmVyOiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJ1dHRvbklnbm9yZXJJZCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzIGNvbG9yc1xuICAgICAgICBidXR0b25WYWxpZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbG9yQnV0dG9uJyk7XG4gICAgICAgIGJ1dHRvbklnbm9yZXIuY2xhc3NMaXN0LnJlbW92ZSgnY29sb3JCdXR0b24nKTtcblxuICAgICAgICAvLyByZW1vdmUgcGF0aWVudEluZm9cbiAgICAgICAgdGhhdC5yZXNldFBhdGllbnRJbmZvKCk7XG4gICAgfSBcblxuICAgIC8qKlxuICAgICAqIHRoZSBvbmNsaWNrIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIGJ1dHRvbiB0aGUgYnV0dG9uXG4gICAgICogQHBhcmFtIHJlc3VsdFNpZ25hbCBcbiAgICAgKiBAcGFyYW0gdmFsaWRhdGVkIFxuICAgICAqL1xuICAgIHByaXZhdGUgb25jbGljayhidXR0b246IEhUTUxCdXR0b25FbGVtZW50LCByZXN1bHRTaWduYWw6IFJlc3VsdHNTaWduYXV4LCB2YWxpZGF0ZWQ6IGJvb2xlYW4pOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gKCgpID0+IHtcbiAgICAgICAgICAgIHRoYXQub25jbGlja0NvbW1vbihyZXN1bHRTaWduYWwuaWQsIHZhbGlkYXRlZCwgdGhhdCk7XG4gICAgICAgICAgICAvLyBhZGQgY29sb3IgdG8gdGhlIGJ1dHRvblxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2NvbG9yQnV0dG9uJyk7XG5cbiAgICAgICAgICAgIC8vIG9uY2xpY2syIDogXG4gICAgICAgICAgICBsZXQgYWRkTGkgPSBmdW5jdGlvbih1bDogSFRNTFVMaXN0RWxlbWVudCwgdHh0OnN0cmluZyk6IHZvaWR7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KTtcbiAgICAgICAgICAgICAgICBsZXQgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgICAgIH0gXG4gICAgXG4gICAgICAgICAgICAvLyB0aGlzIGNhbid0IGJlIHVzZWQgaGVyZVxuICAgICAgICAgICAgY29uc3QgdWw6IEhUTUxVTGlzdEVsZW1lbnQgPSA8SFRNTFVMaXN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpc3RJbmZvUGF0aWVudFwiKTtcbiAgICAgICAgICAgIC8vIG51bSBwYXRpZW50XG4gICAgICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFNpZ25hbC5kYXRlKTtcbiAgICAgICAgICAgIHZhciBkZCA9IFN0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgIHZhciBtbSA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpOyAvL0phbnVhcnkgaXMgMCFcbiAgICAgICAgICAgIHZhciB5eXl5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgbGV0IGRhdGVTdHJpbmcgPSB5eXl5ICsgJy0nICsgbW0gKyAnLScgKyBkZCA7XG4gICAgXG4gICAgICAgICAgICBhZGRMaSh1bCwgXCJOwrAgcGF0aWVudDogXCIgKyByZXN1bHRTaWduYWwubnBhdCk7XG4gICAgICAgICAgICBhZGRMaSh1bCwgXCJOwrAgc8Opam91cjogXCIgKyByZXN1bHRTaWduYWwubnNlaik7XG4gICAgICAgICAgICBhZGRMaSh1bCwgXCJEYXRlOiBcIiArIGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgYWRkTGkodWwsIFwiTG9jYWxpc2F0aW9uOiBcIiArIHJlc3VsdFNpZ25hbC5sb2MpO1xuXG4gICAgICAgICAgICAkLmdldChcIi90YWNvL2dldFBhdGllbnRcIiwge1xuICAgICAgICAgICAgICAgIHFzOiB7XG4gICAgICAgICAgICAgICAgICAgIG5wYXQ6IHJlc3VsdFNpZ25hbC5ucGF0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHNpZ25hdXg6IEFycmF5PFJlc3VsdHNTaWduYXV4Piwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2lnbmF1eCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGF0dXM6XCIgKyBzdGF0dXMpO1xuICAgICAgICAgICAgICAgIG5ldyBQYXRpZW50VGFibGUoc2lnbmF1eCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gdGl0bGUgOlxuICAgICAgICAgICAgdmFyIHBhdGllbnRJbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wYXRpZW50SW5mb0lkKTtcbiAgICAgICAgICAgIGxldCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgICAgICAgICAgIGgzLmlubmVySFRNTCA9IFwiTG9jYWxpc2F0aW9uIGR1IHNpZ25hbFwiO1xuICAgICAgICAgICAgcGF0aWVudEluZm8uYXBwZW5kKGgzKTtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLnBhdGllbnRJbmZvSWQpLnByZXBlbmQoaDMpO1xuICAgICAgICAgICAgLy91bC5pbnNlcnRCZWZvcmUoaDMsIHVsKTtcbiAgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBlbXB0eSB0aGUgdGFibGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlc2V0UGF0aWVudEluZm8oKTogdm9pZCB7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmxpc3RJbmZvUGF0aWVudElkKS5lbXB0eSgpO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5wYXRpZW50SW5mb0lkICsgXCIgaDNcIikucmVtb3ZlKCk7XG4gICAgICAgICQoXCJcIilcbiAgICAgICAgJChcIiNteVRhYmxlIHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICB2YXIgdGJsID0gPEhUTUxUYWJsZUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTsgLy8gR2V0IHRoZSB0YWJsZVxuICAgICAgICB0YmwuZGVsZXRlQ2FwdGlvbigpO1xuICAgICAgICBsZXQgdGJvZHkgPSB0YmwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKTtcbiAgICAgICAgaWYgKHRib2R5Lmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIHRibC5yZW1vdmVDaGlsZCh0YmwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXSk7XG4gICAgICAgIH0gXG5cbiAgICAgICAgbGV0IHRoZWFkID0gdGJsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGhlYWRcIik7XG4gICAgICAgIGlmICh0aGVhZC5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICB0YmwucmVtb3ZlQ2hpbGQodGJsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGhlYWRcIilbMF0pO1xuICAgICAgICB9IFxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBtYWtlIGl0IGltcG9zc2libGUgZm9yIHRoZSBidXR0b25zIHRvIGJlIGNsaWNrZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGRpc2FibGVkQnV0dG9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNldFBhdGllbnRJbmZvKCk7XG4gICAgICAgIGxldCBidXR0b25WYWxpZGVyOiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJ1dHRvblZhbGlkZXJJZCk7XG4gICAgICAgIGxldCBidXR0b25JZ25vcmVyOiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJ1dHRvbklnbm9yZXJJZCk7XG5cbiAgICAgICAgbGV0IGRpc2FibGUgPSBmdW5jdGlvbihidXR0b246IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmN1cnNvciA9IFwibm90LWFsbG93ZWRcIjtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdjb2xvckJ1dHRvbicpO1xuICAgICAgICB9XG4gICAgICAgIGRpc2FibGUoYnV0dG9uVmFsaWRlcik7XG4gICAgICAgIGRpc2FibGUoYnV0dG9uSWdub3Jlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkU2lnbmFsIHRoZSBpZCBvZiBhIHNpZ25hbCAoaW4gdGhlIHNpZ25hbCB0YWJsZSlcbiAgICAgKi9cblxuICAgIHByaXZhdGUgZ2V0U3RhdHVzKGlkU2lnbmFsOiBudW1iZXIpOiBQcm9taXNlPFVwZGF0ZVN0YXR1cz4ge1xuICAgICAgICBsZXQgdXBkYXRlU3RhdHVzOiBVcGRhdGVTdGF0dXMgPSB7XG4gICAgICAgICAgICBpZFNpZ25hbDogaWRTaWduYWwsXG4gICAgICAgICAgICB2YWxpZGF0aW9uOiAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAkLmdldChcIi90YWNvL2dldFN0YXR1c1wiLCB7IHVwZGF0ZVN0YXR1czogdXBkYXRlU3RhdHVzIH0sIGZ1bmN0aW9uICh1cGRhdGVTdGF0dXM6IFVwZGF0ZVN0YXR1cywgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXBkYXRlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVwZGF0ZVN0YXR1cylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBTaWduYXV4IH0gZnJvbSBcIi4vU2lnbmF1eFwiO1xuXG5uZXcgU2lnbmF1eCgpOyJdfQ==
