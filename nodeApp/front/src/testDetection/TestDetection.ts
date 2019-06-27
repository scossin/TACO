
import { SentenceDetection, CT } from "../../shared/ResultDetection";

/**
 * Test the detection of TACO
 * testDetection.ejs
 */
export class TestDetection {
    /**
     * ids
     */
    private readonly divResultDetectId = 'resultDetection';
    private readonly textAreaId = 'textContent';
    private readonly buttonDetectId = 'detectButton';


    /**
     * constructor
     */
    constructor() {
        var button = <HTMLButtonElement>document.getElementById(this.buttonDetectId);
        button.onclick = this.onclick();
    }

    /**
     * the onclick function when use tests the detection
     */
    private onclick(): () => void {
        var that = this;
        return (() => {
            var divResult = document.getElementById(that.divResultDetectId);
            $('#' + that.divResultDetectId).empty();

            // for each sentence
            let addPhrase = function (sentenceDetection: SentenceDetection) {
                let { phraseNumber, content } = sentenceDetection;
                phraseNumber++;
                let pInner = "Phrase " + phraseNumber + " : " + content;
                let p = document.createElement('p');
                p.innerHTML = pInner;
                if (sentenceDetection.detectionSentence.signalDetected) {
                    p.classList.add("signal");
                } else {
                    p.classList.add("nosignal");
                }
                let ul = document.createElement('ul');
                p.appendChild(ul);
                divResult.appendChild(p);
                sentenceDetection.detectionSentence.cts.forEach((ct: CT) => {
                    let li = document.createElement('li');
                    li.innerHTML = ct.term;
                    ul.appendChild(li);
                })
            }

            // retrieve the text entered by the user
            var textArea = <HTMLTextAreaElement>document.getElementById(that.textAreaId);
            let txt = textArea.value;

            // send it to the detector
            $.get("/testDetection/test", {
                qs: {
                    txt: txt
                }
            }, function (sentencesDetection: Array<SentenceDetection>, status) {
                sentencesDetection.forEach((sentenceDetection: SentenceDetection) => {
                    addPhrase(sentenceDetection);
                })
            });
        })
    }
}