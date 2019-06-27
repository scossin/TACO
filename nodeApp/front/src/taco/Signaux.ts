import { ResultsSignaux } from "../../shared/Signaux"
import { UpdateStatus } from "../../shared/UpdateStatus"

import { SearchParameters } from "./SearchParameters"
import { Parameters } from "../../shared/Parameters"

import {PatientTable}  from "./PatientTable"

/**
 * taco.ejs
 * Display the signals 
 */
export class Signaux {
    /**
     * ids
     */
    private readonly phraseId: string = "phrase";
    private readonly buttonValiderId: string = "buttonValider";
    private readonly buttonIgnorerId: string = "buttonIgnorer";
    private readonly submitSearchId: string = "submitSearch";

    // left, list of signals
    private readonly listSignalsId: string = "list"; 

    // right, patient info
    private readonly listInfoPatientId: string = "listInfoPatient";
    private readonly patientInfoId: string = "patientInfo";


    private searchParameters: SearchParameters;

    // current signals displayed
    private resultsSignaux: Array<ResultsSignaux> = [];

    constructor() {
        this.searchParameters = new SearchParameters();
        this.setSearchButton(); // set the onclick function of the search button
        this.disabledButtons(); // no button available till the user select a signal 
        this.getSignals(); // retrieve the signals
    }

    /**
     * set the onclick function of the search button
     */
    private setSearchButton(): void {
        var buttonSubmit: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.submitSearchId);
        var that = this;
        buttonSubmit.onclick = () => {
            that.disabledButtons()
            that.setPhrase("Sélectionnez un signal")
            that.getSignals();
        }
    }

    /**
     * Retrieve the signals in the signal table given the parameters chosen by the user
     */
    private getSignals(): void {
        var that = this;
        let parameters: Parameters = this.searchParameters.getParameters();
        $.get("/taco/getSignauxtoValidate", { qs: parameters }, function (resultsSignaux: Array<ResultsSignaux>, status) {
            that.resultsSignaux = resultsSignaux;
            that.setSignals();
        });
    }

    /**
     * display the signals
     */
    private setSignals(): void {
        $("#" + this.listSignalsId).empty();
        this.resetPatientInfo();

        // no results
        if (this.resultsSignaux.length == 0) {
            this.disabledButtons();
            this.setPhrase("Aucun nouveau signal");
            return;
        }

        const ul: HTMLUListElement = <HTMLUListElement>document.getElementById(this.listSignalsId);

        var that = this;
        this.resultsSignaux.forEach((resultSignal: ResultsSignaux) => {

            var a = document.createElement('a');
            var date = new Date(resultSignal.date);
            var datePrint = date.toLocaleDateString();
            var linkText = document.createTextNode("Signal n°" + (resultSignal.id) + " du " + datePrint);
            a.appendChild(linkText);
            a.href = "javascript:void(0)";
            a.id = resultSignal.id.toString();
            a.addEventListener('click', () => {
                $("#" + resultSignal.id).addClass("visited");
                that.setPhrase(resultSignal.txt);
                that.setButtons(resultSignal);
                that.resetPatientInfo();
            });
            let li = document.createElement("li");
            li.appendChild(a);
            ul.appendChild(li);
        })
    }

    /**
     * 
     * @param phrase the phrase to be displayed
     */
    private setPhrase(phrase: string): void {
        var p: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(this.phraseId);
        p.innerHTML = phrase;
        return;
    }

    /**
     * set 2 buttons: validate / unvalidate
     * @param resultSignal It contains the idSignal to validate and the current status (0, 1 or 2)
     */
    private setButtons(resultSignal: ResultsSignaux): void {
        
        let activateButton = function(button: HTMLButtonElement): void {
            button.classList.remove('colorButton');
            button.disabled = false;
            button.style.cursor = "pointer";
        }
        
        let idSignal = resultSignal.id;

        var buttonValider: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonValiderId);
        activateButton(buttonValider);
        var buttonIgnorer: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonIgnorerId);
        activateButton(buttonIgnorer);

        // onclick:
        buttonValider.onclick = this.onclick(buttonValider, resultSignal, true);
        buttonIgnorer.onclick = this.onclick(buttonIgnorer, resultSignal, false);

        var that = this;
        this.getStatus(idSignal) // check the validation status
            .then((updateStatus: UpdateStatus) => {
                if (updateStatus.validation == 0) { // case new signal
                    return;
                } else if (updateStatus.validation == 1) { // case validated
                    buttonValider.classList.add('colorButton');
                } else if (updateStatus.validation == 2) { // case unvalidated
                    buttonIgnorer.classList.add('colorButton');
                }
            }).catch((error: Error) => {
                console.log(error);
            })
    }

    /**
     * common onclick function
     * @param idSignal the id of the signal (from the signal table)
     * @param validated the status (0,1 or 2)
     * @param that this instance
     */
    private onclickCommon(idSignal: number,validated: boolean, that:any): void {
        let value = 0;
        if (validated) {
            value = 1; // valider
        } else {
            value = 2; // ignorer
        }
        let updateStatus: UpdateStatus = {
            idSignal: idSignal,
            validation: value
        }
        // update the status
        $.get("/taco/updateStatus", {
            updateStatus: updateStatus
        }, function (data, status) {
            console.log("status:" + status);
        });

        // remove colors before selecting one :
        var buttonValider: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonValiderId);
        var buttonIgnorer: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonIgnorerId);

        // remove previous colors
        buttonValider.classList.remove('colorButton');
        buttonIgnorer.classList.remove('colorButton');

        // remove patientInfo
        that.resetPatientInfo();
    } 

    /**
     * the onclick function
     * @param button the button
     * @param resultSignal 
     * @param validated 
     */
    private onclick(button: HTMLButtonElement, resultSignal: ResultsSignaux, validated: boolean): () => void {
        var that = this;
        return (() => {
            that.onclickCommon(resultSignal.id, validated, that);
            // add color to the button
            button.classList.add('colorButton');

            // onclick2 : 
            let addLi = function(ul: HTMLUListElement, txt:string): void{
                let linkText = document.createTextNode(txt);
                let li = document.createElement("li");
                li.appendChild(linkText);
                ul.appendChild(li);
            } 
    
            // this can't be used here
            const ul: HTMLUListElement = <HTMLUListElement>document.getElementById("listInfoPatient");
            // num patient
            let date = new Date(resultSignal.date);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            let dateString = yyyy + '-' + mm + '-' + dd ;
    
            addLi(ul, "N° patient: " + resultSignal.npat);
            addLi(ul, "N° séjour: " + resultSignal.nsej);
            addLi(ul, "Date: " + dateString);
            addLi(ul, "Localisation: " + resultSignal.loc);

            $.get("/taco/getPatient", {
                qs: {
                    npat: resultSignal.npat
                }
            }, function (signaux: Array<ResultsSignaux>, status) {
                console.log(signaux);
                console.log("status:" + status);
                new PatientTable(signaux);
            });

            // title :
            var patientInfo = document.getElementById(this.patientInfoId);
            let h3 = document.createElement("h3");
            h3.innerHTML = "Localisation du signal";
            patientInfo.append(h3);
            $("#" + this.patientInfoId).prepend(h3);
            //ul.insertBefore(h3, ul);
           
        })
    }


    /**
     * empty the table
     */
    private resetPatientInfo(): void {
        $("#" + this.listInfoPatientId).empty();
        $("#" + this.patientInfoId + " h3").remove();
        $("")
        $("#myTable tr").remove();
        var tbl = <HTMLTableElement> document.getElementById("myTable"); // Get the table
        tbl.deleteCaption();
        let tbody = tbl.getElementsByTagName("tbody");
        if (tbody.length != 0){
            tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
        } 

        let thead = tbl.getElementsByTagName("thead");
        if (thead.length != 0){
            tbl.removeChild(tbl.getElementsByTagName("thead")[0]);
        } 
    }



    /**
     * make it impossible for the buttons to be clicked
     */
    private disabledButtons(): void {
        this.resetPatientInfo();
        let buttonValider: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonValiderId);
        let buttonIgnorer: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.buttonIgnorerId);

        let disable = function(button: HTMLButtonElement) {
            button.disabled = true;
            button.style.cursor = "not-allowed";
            button.classList.remove('colorButton');
        }
        disable(buttonValider);
        disable(buttonIgnorer);
    }

    /**
     * 
     * @param idSignal the id of a signal (in the signal table)
     */

    private getStatus(idSignal: number): Promise<UpdateStatus> {
        let updateStatus: UpdateStatus = {
            idSignal: idSignal,
            validation: 0
        }
        return (new Promise((resolve, reject) => {
            $.get("/taco/getStatus", { updateStatus: updateStatus }, function (updateStatus: UpdateStatus, status) {
                console.log(updateStatus);
                resolve(updateStatus)
                return;
            });
        }));
    }
}