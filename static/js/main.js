
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