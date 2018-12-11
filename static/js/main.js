//Utility functions for website

//ToString method for room classes
function roomClassToString(status) {
    switch (status) {
        case "sup_d":
            return "Superior Double";
        case "std_d":
            return "Standard Double";
        case "sup_t":
            return "Standard Twin";
        case "std_t":
            return "Standard Twin";
        default:
            return status;
    }
}

//Formats date as DD/MM/YYYY
function date_ddmmyyyy(dateStr) {
    var date = new Date(dateStr);
    //NB Month ranes from 0-11 so need to add 1
    var res = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    return res;
}