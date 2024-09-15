interface IValidateQueryReturn {
    success: boolean,
    message: string
}

function validateQuery(query?: any, minLenght?: number): IValidateQueryReturn {

    if (typeof query !== "string") {
        // undefined or array or something
        return { success: false, message: "Invalid query" }
    }
    
    if (typeof minLenght !== "undefined" && query.length < minLenght) {
        return { success: false, message: "The query is too short!" }
    }

    if (query.length > 50) {
        return { success: false, message: "The query is too long!" }
    }

    const regex = /^$|^[a-zA-Z0-9\s.,!?\-ÄÅÖàâäåèéêôöüÀÂÃáçíîï/:; ]+$/
    if (!regex.test(query)) {
        return { success: false, message: "The query contains invalid characters!" };
    }

    return { success: true, message: "" }
}

export default validateQuery