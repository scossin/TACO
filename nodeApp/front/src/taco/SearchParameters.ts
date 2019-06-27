import {Parameters}  from "../../shared/Parameters"

/**
 * Retrieve the search parameters chosen by the user
 */
export class SearchParameters {
    /**
     * Dates
     */
    private readonly datetimepickerFromId: string = "datetimepickerFrom";
    private readonly datetimepickerToId: string = "datetimepickerTo";

    // chosen value
    private from: Date;
    private to: Date;

    constructor(){
        this.setDates(); // set the initial date values
    } 

    /**
     * Retrieve the parameters set by the users
     * return Parameters
     */
    public getParameters(): Parameters {
        let from: string;
        let fromInput: HTMLInputElement = <HTMLInputElement>document.getElementById(this.datetimepickerFromId);
        from = fromInput.value ;

        let to: string;
        let toInput: HTMLInputElement = <HTMLInputElement>document.getElementById(this.datetimepickerToId);
        to = toInput.value ;

        let validation = $("select[name='validation']").val().toString();
        
        let parameters:Parameters = {
            from:from,
            to:to,
            validation:validation // 0: nouveau, 1: validated, 2: unvalidated
        }
        return(parameters);
    } 


    /**
     * Function to transform a date to a string (yyyy-mm-dd)
     * @param date a date to transform
     */
    private getDateString(date:Date): string{
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        let dateString = yyyy + '-' + mm + '-' + dd ;
        return(dateString)
    } 

    /**
     * set initial dates
     */
    private setDates(): void {
        // from
        let oneMonth:Date = new Date();
        oneMonth.setDate(oneMonth.getDate() - 31); // 1 month before today
        this.from = oneMonth;
        let from: HTMLInputElement = <HTMLInputElement>document.getElementById(this.datetimepickerFromId);
        from.value = this.getDateString(oneMonth);

        // to
        let today:Date = new Date();
        this.to = today;
        var to: HTMLInputElement = <HTMLInputElement>document.getElementById(this.datetimepickerToId);
        to.value = this.getDateString(today); 
    }
} 