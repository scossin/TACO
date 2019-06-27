(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test the detection of TACO
 * testDetection.ejs
 */
var TestDetection = /** @class */ (function () {
    /**
     * constructor
     */
    function TestDetection() {
        /**
         * ids
         */
        this.divResultDetectId = 'resultDetection';
        this.textAreaId = 'textContent';
        this.buttonDetectId = 'detectButton';
        var button = document.getElementById(this.buttonDetectId);
        button.onclick = this.onclick();
    }
    /**
     * the onclick function when use tests the detection
     */
    TestDetection.prototype.onclick = function () {
        var that = this;
        return (function () {
            var divResult = document.getElementById(that.divResultDetectId);
            $('#' + that.divResultDetectId).empty();
            // for each sentence
            var addPhrase = function (sentenceDetection) {
                var phraseNumber = sentenceDetection.phraseNumber, content = sentenceDetection.content;
                phraseNumber++;
                var pInner = "Phrase " + phraseNumber + " : " + content;
                var p = document.createElement('p');
                p.innerHTML = pInner;
                if (sentenceDetection.detectionSentence.signalDetected) {
                    p.classList.add("signal");
                }
                else {
                    p.classList.add("nosignal");
                }
                var ul = document.createElement('ul');
                p.appendChild(ul);
                divResult.appendChild(p);
                sentenceDetection.detectionSentence.cts.forEach(function (ct) {
                    var li = document.createElement('li');
                    li.innerHTML = ct.term;
                    ul.appendChild(li);
                });
            };
            // retrieve the text entered by the user
            var textArea = document.getElementById(that.textAreaId);
            var txt = textArea.value;
            // send it to the detector
            $.get("/testDetection/test", {
                qs: {
                    txt: txt
                }
            }, function (sentencesDetection, status) {
                sentencesDetection.forEach(function (sentenceDetection) {
                    addPhrase(sentenceDetection);
                });
            });
        });
    };
    return TestDetection;
}());
exports.TestDetection = TestDetection;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestDetection_1 = require("./TestDetection");
new TestDetection_1.TestDetection();

},{"./TestDetection":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdGVzdERldGVjdGlvbi9UZXN0RGV0ZWN0aW9uLnRzIiwic3JjL3Rlc3REZXRlY3Rpb24vbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7OztHQUdHO0FBQ0g7SUFTSTs7T0FFRztJQUNIO1FBWEE7O1dBRUc7UUFDYyxzQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUN0QyxlQUFVLEdBQUcsYUFBYSxDQUFDO1FBQzNCLG1CQUFjLEdBQUcsY0FBYyxDQUFDO1FBTzdDLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSywrQkFBTyxHQUFmO1FBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQztZQUNKLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV4QyxvQkFBb0I7WUFDcEIsSUFBSSxTQUFTLEdBQUcsVUFBVSxpQkFBb0M7Z0JBQ3BELElBQUEsNkNBQVksRUFBRSxtQ0FBTyxDQUF1QjtnQkFDbEQsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxNQUFNLEdBQUcsU0FBUyxHQUFHLFlBQVksR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztnQkFDckIsSUFBSSxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUU7b0JBQ3BELENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUM3QjtxQkFBTTtvQkFDSCxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQU07b0JBQ25ELElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDdkIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDLENBQUE7WUFFRCx3Q0FBd0M7WUFDeEMsSUFBSSxRQUFRLEdBQXdCLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFFekIsMEJBQTBCO1lBQzFCLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUU7Z0JBQ3pCLEVBQUUsRUFBRTtvQkFDQSxHQUFHLEVBQUUsR0FBRztpQkFDWDthQUNKLEVBQUUsVUFBVSxrQkFBNEMsRUFBRSxNQUFNO2dCQUM3RCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxpQkFBb0M7b0JBQzVELFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDLENBQUMsQ0FBQTtZQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQWhFQSxBQWdFQyxJQUFBO0FBaEVZLHNDQUFhOzs7OztBQ1AxQixpREFBOEM7QUFFOUMsSUFBSSw2QkFBYSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbmltcG9ydCB7IFNlbnRlbmNlRGV0ZWN0aW9uLCBDVCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvUmVzdWx0RGV0ZWN0aW9uXCI7XG5cbi8qKlxuICogVGVzdCB0aGUgZGV0ZWN0aW9uIG9mIFRBQ09cbiAqIHRlc3REZXRlY3Rpb24uZWpzXG4gKi9cbmV4cG9ydCBjbGFzcyBUZXN0RGV0ZWN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBpZHNcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRpdlJlc3VsdERldGVjdElkID0gJ3Jlc3VsdERldGVjdGlvbic7XG4gICAgcHJpdmF0ZSByZWFkb25seSB0ZXh0QXJlYUlkID0gJ3RleHRDb250ZW50JztcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJ1dHRvbkRldGVjdElkID0gJ2RldGVjdEJ1dHRvbic7XG5cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHZhciBidXR0b24gPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5idXR0b25EZXRlY3RJZCk7XG4gICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gdGhpcy5vbmNsaWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIG9uY2xpY2sgZnVuY3Rpb24gd2hlbiB1c2UgdGVzdHMgdGhlIGRldGVjdGlvblxuICAgICAqL1xuICAgIHByaXZhdGUgb25jbGljaygpOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gKCgpID0+IHtcbiAgICAgICAgICAgIHZhciBkaXZSZXN1bHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGF0LmRpdlJlc3VsdERldGVjdElkKTtcbiAgICAgICAgICAgICQoJyMnICsgdGhhdC5kaXZSZXN1bHREZXRlY3RJZCkuZW1wdHkoKTtcblxuICAgICAgICAgICAgLy8gZm9yIGVhY2ggc2VudGVuY2VcbiAgICAgICAgICAgIGxldCBhZGRQaHJhc2UgPSBmdW5jdGlvbiAoc2VudGVuY2VEZXRlY3Rpb246IFNlbnRlbmNlRGV0ZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IHsgcGhyYXNlTnVtYmVyLCBjb250ZW50IH0gPSBzZW50ZW5jZURldGVjdGlvbjtcbiAgICAgICAgICAgICAgICBwaHJhc2VOdW1iZXIrKztcbiAgICAgICAgICAgICAgICBsZXQgcElubmVyID0gXCJQaHJhc2UgXCIgKyBwaHJhc2VOdW1iZXIgKyBcIiA6IFwiICsgY29udGVudDtcbiAgICAgICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgICAgICBwLmlubmVySFRNTCA9IHBJbm5lcjtcbiAgICAgICAgICAgICAgICBpZiAoc2VudGVuY2VEZXRlY3Rpb24uZGV0ZWN0aW9uU2VudGVuY2Uuc2lnbmFsRGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcC5jbGFzc0xpc3QuYWRkKFwic2lnbmFsXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAuY2xhc3NMaXN0LmFkZChcIm5vc2lnbmFsXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQodWwpO1xuICAgICAgICAgICAgICAgIGRpdlJlc3VsdC5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgICAgICBzZW50ZW5jZURldGVjdGlvbi5kZXRlY3Rpb25TZW50ZW5jZS5jdHMuZm9yRWFjaCgoY3Q6IENUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IGN0LnRlcm07XG4gICAgICAgICAgICAgICAgICAgIHVsLmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXRyaWV2ZSB0aGUgdGV4dCBlbnRlcmVkIGJ5IHRoZSB1c2VyXG4gICAgICAgICAgICB2YXIgdGV4dEFyZWEgPSA8SFRNTFRleHRBcmVhRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGF0LnRleHRBcmVhSWQpO1xuICAgICAgICAgICAgbGV0IHR4dCA9IHRleHRBcmVhLnZhbHVlO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGl0IHRvIHRoZSBkZXRlY3RvclxuICAgICAgICAgICAgJC5nZXQoXCIvdGVzdERldGVjdGlvbi90ZXN0XCIsIHtcbiAgICAgICAgICAgICAgICBxczoge1xuICAgICAgICAgICAgICAgICAgICB0eHQ6IHR4dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChzZW50ZW5jZXNEZXRlY3Rpb246IEFycmF5PFNlbnRlbmNlRGV0ZWN0aW9uPiwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgc2VudGVuY2VzRGV0ZWN0aW9uLmZvckVhY2goKHNlbnRlbmNlRGV0ZWN0aW9uOiBTZW50ZW5jZURldGVjdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhZGRQaHJhc2Uoc2VudGVuY2VEZXRlY3Rpb24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0ICB7VGVzdERldGVjdGlvbn0gZnJvbSAnLi9UZXN0RGV0ZWN0aW9uJ1xuXG5uZXcgVGVzdERldGVjdGlvbigpOyJdfQ==
