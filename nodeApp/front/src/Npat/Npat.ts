import {PatientTable}  from "../taco/PatientTable"
import { ResultsSignaux } from "../../shared/Signaux"

/**
 * Npat.ejs
 * A textinput to enter a Npat (patient number), a submit button, a div result
 */
export class Npat {
    // 
    private readonly npatId: string = "npat";
    private readonly submitSearchId: string = "submitSearch";
    private readonly messageId: string = "message";

    constructor() {
        this.setSearchButton();
    }

    /**
     * Set the onclick function of the submit function
     */
    private setSearchButton(): void {
        this.resetPatientInfo();

        var buttonSubmit: HTMLButtonElement = <HTMLButtonElement>document.getElementById(this.submitSearchId);
        var that = this;
        buttonSubmit.onclick = () => {
            that.resetPatientInfo();

            var npatInput: HTMLInputElement = <HTMLInputElement>document.getElementById(that.npatId);

            $.get("/taco/getPatient", {
                qs: {
                    npat: npatInput.value
                }
            }, function (signaux: Array<ResultsSignaux>, status) {
                // npat not found => no results
                if (signaux.length == 0){
                    var messageEl: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(that.messageId);
                    messageEl.innerHTML = "Aucun npat trouvé";
                } else{
                    // else display in a table the results
                    new PatientTable(signaux);
                } 
            });
        }
    }

    /**
     * Empty the table if it exists, empty a previous message
     */
    private resetPatientInfo(): void {
        $("#myTable tr").remove();
        var tbl =  <HTMLTableElement> document.getElementById("myTable"); // Get the table
        tbl.deleteCaption();

        // check if it exists first
        let tbody = tbl.getElementsByTagName("tbody");
        if (tbody.length != 0){
            tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
        } 

        let thead = tbl.getElementsByTagName("thead");
        if (thead.length != 0){
            tbl.removeChild(tbl.getElementsByTagName("thead")[0]);
        } 
       
        // remove the previous message
        var messageEl: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById(this.messageId);
        messageEl.innerHTML = "";
    }
} 