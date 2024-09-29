interface IValidateQueryReturn {
    success: boolean,
    message?: string
}

function validateQuery(query?: string): IValidateQueryReturn {
    // empty query is valid
    if (!query) return { success: true }

    if (query.length > 50) {
        return { success: false, message: "The query is too long!" }
    }

    const regex = /^$|^[a-zA-Z0-9\s.,!?\-ÄÅÖàâäåèéêôöüÀÂÃáçíîï/:; ]+$/
    if (!regex.test(query)) {
        return { success: false, message: "The query contains invalid characters!" };
    }

    return { success: true }
}

export default validateQuery