(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PatientTable_1 = require("../taco/PatientTable");
/**
 * Npat.ejs
 * A textinput to enter a Npat (patient number), a submit button, a div result
 */
var Npat = /** @class */ (function () {
    function Npat() {
        // 
        this.npatId = "npat";
        this.submitSearchId = "submitSearch";
        this.messageId = "message";
        this.setSearchButton();
    }
    /**
     * Set the onclick function of the submit function
     */
    Npat.prototype.setSearchButton = function () {
        this.resetPatientInfo();
        var buttonSubmit = document.getElementById(this.submitSearchId);
        var that = this;
        buttonSubmit.onclick = function () {
            that.resetPatientInfo();
            var npatInput = document.getElementById(that.npatId);
            $.get("/taco/getPatient", {
                qs: {
                    npat: npatInput.value
                }
            }, function (signaux, status) {
                // npat not found => no results
                if (signaux.length == 0) {
                    var messageEl = document.getElementById(that.messageId);
                    messageEl.innerHTML = "Aucun npat trouvé";
                }
                else {
                    // else display in a table the results
                    new PatientTable_1.PatientTable(signaux);
                }
            });
        };
    };
    /**
     * Empty the table if it exists, empty a previous message
     */
    Npat.prototype.resetPatientInfo = function () {
        $("#myTable tr").remove();
        var tbl = document.getElementById("myTable"); // Get the table
        tbl.deleteCaption();
        // check if it exists first
        var tbody = tbl.getElementsByTagName("tbody");
        if (tbody.length != 0) {
            tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
        }
        var thead = tbl.getElementsByTagName("thead");
        if (thead.length != 0) {
            tbl.removeChild(tbl.getElementsByTagName("thead")[0]);
        }
        // remove the previous message
        var messageEl = document.getElementById(this.messageId);
        messageEl.innerHTML = "";
    };
    return Npat;
}());
exports.Npat = Npat;

},{"../taco/PatientTable":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Npat_1 = require("./Npat");
new Npat_1.Npat();

},{"./Npat":1}],3:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTnBhdC9OcGF0LnRzIiwic3JjL05wYXQvbWFpbi50cyIsInNyYy90YWNvL1BhdGllbnRUYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEscURBQWtEO0FBR2xEOzs7R0FHRztBQUNIO0lBTUk7UUFMQSxHQUFHO1FBQ2MsV0FBTSxHQUFXLE1BQU0sQ0FBQztRQUN4QixtQkFBYyxHQUFXLGNBQWMsQ0FBQztRQUN4QyxjQUFTLEdBQVcsU0FBUyxDQUFDO1FBRzNDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7O09BRUc7SUFDSyw4QkFBZSxHQUF2QjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLElBQUksWUFBWSxHQUF5QyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0RyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsWUFBWSxDQUFDLE9BQU8sR0FBRztZQUNuQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUV4QixJQUFJLFNBQVMsR0FBdUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFekYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDdEIsRUFBRSxFQUFFO29CQUNBLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSztpQkFDeEI7YUFDSixFQUFFLFVBQVUsT0FBOEIsRUFBRSxNQUFNO2dCQUMvQywrQkFBK0I7Z0JBQy9CLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7b0JBQ3BCLElBQUksU0FBUyxHQUErQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDcEcsU0FBUyxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztpQkFD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anMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7UGF0aWVudFRhYmxlfSAgZnJvbSBcIi4uL3RhY28vUGF0aWVudFRhYmxlXCJcbmltcG9ydCB7IFJlc3VsdHNTaWduYXV4IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9TaWduYXV4XCJcblxuLyoqXG4gKiBOcGF0LmVqc1xuICogQSB0ZXh0aW5wdXQgdG8gZW50ZXIgYSBOcGF0IChwYXRpZW50IG51bWJlciksIGEgc3VibWl0IGJ1dHRvbiwgYSBkaXYgcmVzdWx0XG4gKi9cbmV4cG9ydCBjbGFzcyBOcGF0IHtcbiAgICAvLyBcbiAgICBwcml2YXRlIHJlYWRvbmx5IG5wYXRJZDogc3RyaW5nID0gXCJucGF0XCI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzdWJtaXRTZWFyY2hJZDogc3RyaW5nID0gXCJzdWJtaXRTZWFyY2hcIjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1lc3NhZ2VJZDogc3RyaW5nID0gXCJtZXNzYWdlXCI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZXRTZWFyY2hCdXR0b24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG9uY2xpY2sgZnVuY3Rpb24gb2YgdGhlIHN1Ym1pdCBmdW5jdGlvblxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0U2VhcmNoQnV0dG9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2V0UGF0aWVudEluZm8oKTtcblxuICAgICAgICB2YXIgYnV0dG9uU3VibWl0OiBIVE1MQnV0dG9uRWxlbWVudCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN1Ym1pdFNlYXJjaElkKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBidXR0b25TdWJtaXQub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoYXQucmVzZXRQYXRpZW50SW5mbygpO1xuXG4gICAgICAgICAgICB2YXIgbnBhdElucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhhdC5ucGF0SWQpO1xuXG4gICAgICAgICAgICAkLmdldChcIi90YWNvL2dldFBhdGllbnRcIiwge1xuICAgICAgICAgICAgICAgIHFzOiB7XG4gICAgICAgICAgICAgICAgICAgIG5wYXQ6IG5wYXRJbnB1dC52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChzaWduYXV4OiBBcnJheTxSZXN1bHRzU2lnbmF1eD4sIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIC8vIG5wYXQgbm90IGZvdW5kID0+IG5vIHJlc3VsdHNcbiAgICAgICAgICAgICAgICBpZiAoc2lnbmF1eC5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlRWw6IEhUTUxQYXJhZ3JhcGhFbGVtZW50ID0gPEhUTUxQYXJhZ3JhcGhFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoYXQubWVzc2FnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9IFwiQXVjdW4gbnBhdCB0cm91dsOpXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGRpc3BsYXkgaW4gYSB0YWJsZSB0aGUgcmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICBuZXcgUGF0aWVudFRhYmxlKHNpZ25hdXgpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtcHR5IHRoZSB0YWJsZSBpZiBpdCBleGlzdHMsIGVtcHR5IGEgcHJldmlvdXMgbWVzc2FnZVxuICAgICAqL1xuICAgIHByaXZhdGUgcmVzZXRQYXRpZW50SW5mbygpOiB2b2lkIHtcbiAgICAgICAgJChcIiNteVRhYmxlIHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICB2YXIgdGJsID0gIDxIVE1MVGFibGVFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7IC8vIEdldCB0aGUgdGFibGVcbiAgICAgICAgdGJsLmRlbGV0ZUNhcHRpb24oKTtcblxuICAgICAgICAvLyBjaGVjayBpZiBpdCBleGlzdHMgZmlyc3RcbiAgICAgICAgbGV0IHRib2R5ID0gdGJsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIik7XG4gICAgICAgIGlmICh0Ym9keS5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICB0YmwucmVtb3ZlQ2hpbGQodGJsLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF0pO1xuICAgICAgICB9IFxuXG4gICAgICAgIGxldCB0aGVhZCA9IHRibC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRoZWFkXCIpO1xuICAgICAgICBpZiAodGhlYWQubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgdGJsLnJlbW92ZUNoaWxkKHRibC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRoZWFkXCIpWzBdKTtcbiAgICAgICAgfSBcbiAgICAgICBcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBwcmV2aW91cyBtZXNzYWdlXG4gICAgICAgIHZhciBtZXNzYWdlRWw6IEhUTUxQYXJhZ3JhcGhFbGVtZW50ID0gPEhUTUxQYXJhZ3JhcGhFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubWVzc2FnZUlkKTtcbiAgICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxufSAiLCJpbXBvcnQge05wYXR9IGZyb20gXCIuL05wYXRcIlxuXG5uZXcgTnBhdCgpOyIsImltcG9ydCB7IFBhcmFtZXRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL1BhcmFtZXRlcnNcIlxuaW1wb3J0IHsgUmVzdWx0c1NpZ25hdXggfSBmcm9tIFwiLi4vLi4vc2hhcmVkL1NpZ25hdXhcIlxuaW1wb3J0IHsgVXBkYXRlU3RhdHVzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9VcGRhdGVTdGF0dXNcIlxuXG4vKipcbiAqIERpc3BsYXkgYWxsIHNpZ25hbHMgYmVsb25naW5nIHRvIGEgcGF0aWVudFxuICovXG5leHBvcnQgY2xhc3MgUGF0aWVudFRhYmxlIHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGFibGVpZCA9IFwibXlUYWJsZVwiO1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHNpZ25hdXggc2lnbmFscyAocmVzdWx0cyBvZiBzZWxlY3QgKiBmcm9tIHNpZ25hbClcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzaWduYXV4OiBBcnJheTxSZXN1bHRzU2lnbmF1eD4pIHtcbiAgICAgICAgLy8gZ2V0UGF0aWVudEluZm9ybWF0aW9uIDogXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhhdC5jcmVhdGVUYWJsZShzaWduYXV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gc2lnbmF1eCBzaWduYWxzIChyZXN1bHRzIG9mIHNlbGVjdCAqIGZyb20gc2lnbmFsKVxuICAgICAqL1xuICAgIHB1YmxpYyBjcmVhdGVUYWJsZShzaWduYXV4OiBBcnJheTxSZXN1bHRzU2lnbmF1eD4pOiB2b2lkIHtcbiAgICAgICAgdmFyIHRhYmxlOiBIVE1MVGFibGVFbGVtZW50ID0gPEhUTUxUYWJsZUVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YWJsZWlkKTtcblxuICAgICAgICAvLyBjYXB0aW9uXG4gICAgICAgIHZhciBjYXB0aW9uID0gdGFibGUuY3JlYXRlQ2FwdGlvbigpO1xuICAgICAgICBjYXB0aW9uLmlubmVySFRNTCA9IFwiQXV0cmVzIHNpZ25hdXggZHUgcGF0aWVudFwiO1xuICAgICAgICBjYXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJoM1wiKTtcblxuICAgICAgICAvLyBoZWFkZXIgXG4gICAgICAgIGxldCB0aGVhZDogSFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQgPSA8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+dGFibGUuY3JlYXRlVEhlYWQoKTtcbiAgICAgICAgbGV0IGNvbHVtbnM6IEFycmF5PHN0cmluZz4gPSBbXCJpZFwiLFwiU2lnbmFsXCIsIFwiTsKwIHPDqWpvdXJcIiwgXCJEYXRlXCIsIFwiVmFsaWRhdGlvblwiXTtcbiAgICAgICAgdmFyIG5yb3cgPSAwO1xuICAgICAgICBsZXQgcm93ID0gdGhlYWQuaW5zZXJ0Um93KG5yb3cpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGkpO1xuICAgICAgICAgICAgbGV0IGNlbGwgPSByb3cuaW5zZXJ0Q2VsbChpKTtcbiAgICAgICAgICAgIGNlbGwuaW5uZXJIVE1MID0gY29sdW1uc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJvZHlcbiAgICAgICAgbGV0IHRib2R5OiBIVE1MVGFibGVTZWN0aW9uRWxlbWVudCA9IDxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD50YWJsZS5jcmVhdGVUQm9keSgpO1xuICAgICAgICB2YXIgdGhhdD10aGlzO1xuXG4gICAgICAgIC8vIHJvdyBieSByb3dcbiAgICAgICAgc2lnbmF1eC5mb3JFYWNoKChzaWduYWwpID0+IHtcbiAgICAgICAgICAgIGxldCByb3cgPSB0Ym9keS5pbnNlcnRSb3cobnJvdyk7XG5cbiAgICAgICAgICAgIGxldCBjZWxsMCA9IHJvdy5pbnNlcnRDZWxsKDApO1xuICAgICAgICAgICAgY2VsbDAuaW5uZXJIVE1MID0gc2lnbmFsLmlkLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjZWxsMC5jbGFzc0xpc3QuYWRkKFwiaXRhbGljXCIpO1xuXG5cbiAgICAgICAgICAgIGxldCBjZWxsMSA9IHJvdy5pbnNlcnRDZWxsKDEpO1xuICAgICAgICAgICAgY2VsbDEuaW5uZXJIVE1MID0gc2lnbmFsLnR4dDtcbiAgICAgICAgICAgIGNlbGwxLmNsYXNzTGlzdC5hZGQoXCJpdGFsaWNcIik7XG5cbiAgICAgICAgICAgIGxldCBjZWxsMiA9IHJvdy5pbnNlcnRDZWxsKDIpO1xuICAgICAgICAgICAgY2VsbDIuaW5uZXJIVE1MID0gc2lnbmFsLm5zZWo7XG5cbiAgICAgICAgICAgIGxldCBjZWxsMyA9IHJvdy5pbnNlcnRDZWxsKDMpO1xuICAgICAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZShzaWduYWwuZGF0ZSk7XG4gICAgICAgICAgICB2YXIgZGQgPSBTdHJpbmcoZGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgICAgICB2YXIgbW0gPSBTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTsgLy9KYW51YXJ5IGlzIDAhXG4gICAgICAgICAgICB2YXIgeXl5eSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgIGxldCBkYXRlU3RyaW5nID0geXl5eSArICctJyArIG1tICsgJy0nICsgZGQ7XG4gICAgICAgICAgICBjZWxsMy5pbm5lckhUTUwgPSBkYXRlU3RyaW5nO1xuXG4gICAgICAgICAgICBsZXQgY2VsbDQgPSByb3cuaW5zZXJ0Q2VsbCg0KTtcbiAgICAgICAgICAgIGNlbGw0LmFwcGVuZENoaWxkKHRoYXQuY3JlYXRlQnV0dG9ucyhzaWduYWwuaWQsIHNpZ25hbC52YWxpZGF0aW9uKSk7XG4gICAgICAgICAgICBucm93ID0gbnJvdyArIDE7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRoZSBidXR0b25zIGluIHRoZSB0YWJsZVxuICAgICAqIEBwYXJhbSBpZFNpZ25hbCB0aGUgaWQgb2YgYSBzaWduYWwgKGNvbHVtbiBpZCBvZiB0aGUgc2lnbmFsIHRhYmxlKVxuICAgICAqIEBwYXJhbSB2YWxpZGF0aW9uIDA6IG5vdXZlYXUsIDE6IHZhbGlkYXRlZCwgMjogdW52YWxpZGF0ZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGNyZWF0ZUJ1dHRvbnMoaWRTaWduYWw6bnVtYmVyLCB2YWxpZGF0aW9uOiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtIGRpdiB0aGUgZGl2IGVsZW1lbnQgaW4gYSB0ZCB0YWJsZVxuICAgICAgICAgKiBAcGFyYW0gaW5uZXJIVE1MIHRoZSBidXR0b24gaW5uZXJIVE1MICh2YWxpZGVyIC8gaW52YWxpZGVyKVxuICAgICAgICAgKiBAcGFyYW0gaWRTaWduYWwgdGhlIGlkIG9mIGEgc2lnbmFsIChjb2x1bW4gaWQgb2YgdGhlIHNpZ25hbCB0YWJsZSlcbiAgICAgICAgICogQHBhcmFtIHZhbHVlIDA6IG5vdXZlYXUsIDE6IHZhbGlkYXRlZCwgMjogdW52YWxpZGF0ZWRcbiAgICAgICAgICogQHBhcmFtIGNsYXNzQ29sb3IgdW5kZWZpbmVkIG9yIGJsdWVcbiAgICAgICAgICovXG4gICAgICAgIGxldCBjcmVhdGVCdXR0b24gPSBmdW5jdGlvbihkaXY6SFRNTEVsZW1lbnQsIGlubmVySFRNTDpzdHJpbmcsIGlkU2lnbmFsOm51bWJlciwgdmFsdWU6c3RyaW5nLCBjbGFzc0NvbG9yOiBzdHJpbmd8dW5kZWZpbmVkICl7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIpO1xuICAgICAgICAgICAgaWYgKGNsYXNzQ29sb3Ipe1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzQ29sb3IpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJpZFNpZ25hbFwiLGlkU2lnbmFsLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsdmFsdWUpO1xuICAgICAgICAgICAgYnV0dG9uLm5hbWUgPSBpZFNpZ25hbC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAvLyBvbmNsaWNrIDogc2F2ZSB0aGUgbmV3IHZhbHVlIGFuZCBjaGFuZ2UgdGhlIGNsYXNzIFxuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PntcbiAgICAgICAgICAgICAgICBsZXQgaWRTaWduYWwgPSBidXR0b24uZ2V0QXR0cmlidXRlKFwiaWRTaWduYWxcIik7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBidXR0b24uZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7IC8vIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGlkU2lnbmFsO1xuXG4gICAgICAgICAgICAgICAgbGV0IHVwZGF0ZVN0YXR1czogVXBkYXRlU3RhdHVzID0ge1xuICAgICAgICAgICAgICAgICAgICBpZFNpZ25hbDogIHBhcnNlSW50KGlkU2lnbmFsKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogcGFyc2VJbnQodmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNhdmUgdGhlIG5ldyB2YWx1ZVxuICAgICAgICAgICAgICAgICQuZ2V0KFwiL3RhY28vdXBkYXRlU3RhdHVzXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlU3RhdHVzOiB1cGRhdGVTdGF0dXNcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhdHVzOlwiICsgc3RhdHVzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIHNlbGVjdCB0aGUgMiBidXR0b25zXG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUobmFtZSk7XG4gICAgICAgICAgICAgICAgYnV0dG9ucy5mb3JFYWNoKChlKSA9PntcbiAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKFwiYmx1ZVwiKTsgLy8gcmVtb3ZlIHByZXZpb3VzIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZUJ1dHRvbiA9IGUuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZUJ1dHRvbiA9PT0gdmFsdWUpeyAvLyBpZiB0aGUgdmFsdWUgKDEgb3IgMikgb2YgdGhlIGJ1dHRvbiBpcyBlcXVhbCB0byBuZXcgdmFsdWUgY2xpY2tlZCBieSB0aGUgdXNlciAodG9nZ2xlIHZhbGlkYXRlIDw9PiB1bnZhbGlkYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKFwiYmx1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImJ0bi1ncm91cFwiKTtcbiAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJidXR0b25UYWJsZVwiKTtcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcInJvbGVcIixcImdyb3VwXCIpO1xuXG4gICAgICAgIGlmICh2YWxpZGF0aW9uID09IDApeyAvLyBub3V2ZWF1IFxuICAgICAgICAgICAgY3JlYXRlQnV0dG9uKGRpdiwgXCJWYWxpZGVyXCIsaWRTaWduYWwsXCIxXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIkludmFsaWRlclwiLGlkU2lnbmFsLFwiMlwiLCB1bmRlZmluZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbGlkYXRpb24gPT0gMSl7IC8vIGFscmVhZHkgdmFsaWRhdGVkXG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIlZhbGlkZXJcIixpZFNpZ25hbCxcIjFcIiwgXCJibHVlXCIpO1xuICAgICAgICAgICAgY3JlYXRlQnV0dG9uKGRpdiwgXCJJbnZhbGlkZXJcIixpZFNpZ25hbCxcIjJcIiwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWxpZGF0aW9uID09IDIpeyAvLyB1bnZhbGlkYXRlZFxuICAgICAgICAgICAgY3JlYXRlQnV0dG9uKGRpdiwgXCJWYWxpZGVyXCIsaWRTaWduYWwsXCIxXCIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBjcmVhdGVCdXR0b24oZGl2LCBcIkludmFsaWRlclwiLGlkU2lnbmFsLFwiMlwiLCBcImJsdWVcIik7XG4gICAgICAgIH0gXG5cbiAgICAgICAgcmV0dXJuKGRpdik7XG4gICAgfVxufSAiXX0=
