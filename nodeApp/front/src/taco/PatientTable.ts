import { Parameters } from "../../shared/Parameters"
import { ResultsSignaux } from "../../shared/Signaux"
import { UpdateStatus } from "../../shared/UpdateStatus"

/**
 * Display all signals belonging to a patient
 */
export class PatientTable {

    private readonly tableid = "myTable";

    /**
     * 
     * @param signaux signals (results of select * from signal)
     */
    constructor(signaux: Array<ResultsSignaux>) {
        // getPatientInformation : 
        var that = this;
        that.createTable(signaux);
    }

    /**
     * 
     * @param signaux signals (results of select * from signal)
     */
    public createTable(signaux: Array<ResultsSignaux>): void {
        var table: HTMLTableElement = <HTMLTableElement>document.getElementById(this.tableid);

        // caption
        var caption = table.createCaption();
        caption.innerHTML = "Autres signaux du patient";
        caption.classList.add("h3");

        // header 
        let thead: HTMLTableSectionElement = <HTMLTableSectionElement>table.createTHead();
        let columns: Array<string> = ["id","Signal", "N° séjour", "Date", "Validation"];
        var nrow = 0;
        let row = thead.insertRow(nrow);
        for (let i = 0; i < columns.length; i++) {
            console.log(i);
            let cell = row.insertCell(i);
            cell.innerHTML = columns[i];
        }

        // body
        let tbody: HTMLTableSectionElement = <HTMLTableSectionElement>table.createTBody();
        var that=this;

        // row by row
        signaux.forEach((signal) => {
            let row = tbody.insertRow(nrow);

            let cell0 = row.insertCell(0);
            cell0.innerHTML = signal.id.toString();
            cell0.classList.add("italic");


            let cell1 = row.insertCell(1);
            cell1.innerHTML = signal.txt;
            cell1.classList.add("italic");

            let cell2 = row.insertCell(2);
            cell2.innerHTML = signal.nsej;

            let cell3 = row.insertCell(3);
            let date = new Date(signal.date);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            let dateString = yyyy + '-' + mm + '-' + dd;
            cell3.innerHTML = dateString;

            let cell4 = row.insertCell(4);
            cell4.appendChild(that.createButtons(signal.id, signal.validation));
            nrow = nrow + 1;
        })
    }

    /**
     * Create the buttons in the table
     * @param idSignal the id of a signal (column id of the signal table)
     * @param validation 0: nouveau, 1: validated, 2: unvalidated
     */
    private createButtons(idSignal:number, validation: number): HTMLElement {
        /**
         * 
         * @param div the div element in a td table
         * @param innerHTML the button innerHTML (valider / invalider)
         * @param idSignal the id of a signal (column id of the signal table)
         * @param value 0: nouveau, 1: validated, 2: unvalidated
         * @param classColor undefined or blue
         */
        let createButton = function(div:HTMLElement, innerHTML:string, idSignal:number, value:string, classColor: string|undefined ){
            let button = document.createElement("button");
            button.classList.add("btn");
            if (classColor){
                button.classList.add(classColor);
            } 
            button.setAttribute("idSignal",idSignal.toString());
            button.setAttribute("value",value);
            button.name = idSignal.toString();

            // onclick : save the new value and change the class 
            button.onclick = () =>{
                let idSignal = button.getAttribute("idSignal");
               
                var value = button.getAttribute("value"); // current value
                let name = idSignal;

                let updateStatus: UpdateStatus = {
                    idSignal:  parseInt(idSignal),
                    validation: parseInt(value)
                }
                // save the new value
                $.get("/taco/updateStatus", {
                    updateStatus: updateStatus
                }, function (data, status) {
                    console.log("status:" + status);
                });

                // select the 2 buttons
                let buttons =  document.getElementsByName(name);
                buttons.forEach((e) =>{
                    e.classList.remove("blue"); // remove previous class
                    let valueButton = e.getAttribute("value");
                    if (valueButton === value){ // if the value (1 or 2) of the button is equal to new value clicked by the user (toggle validate <=> unvalidate)
                        e.classList.add("blue");
                    } 
                })
            } 
            button.innerHTML = innerHTML;
            div.appendChild(button);
        }

        var div = document.createElement("div");
        div.classList.add("btn-group");
        div.classList.add("buttonTable");
        div.setAttribute("role","group");

        if (validation == 0){ // nouveau 
            createButton(div, "Valider",idSignal,"1", undefined);
            createButton(div, "Invalider",idSignal,"2", undefined);
        } else if (validation == 1){ // already validated
            createButton(div, "Valider",idSignal,"1", "blue");
            createButton(div, "Invalider",idSignal,"2", undefined);
        } else if (validation == 2){ // unvalidated
            createButton(div, "Valider",idSignal,"1", undefined);
            createButton(div, "Invalider",idSignal,"2", "blue");
        } 

        return(div);
    }
} 