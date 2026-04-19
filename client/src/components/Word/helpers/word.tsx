import { WordDataEntry } from "../../../interfaces/word"
import Flag from "../Flag";

export function handleParenthesis(text?: string, description?: string) {
    if (text) {
        let content = ""
        if (description) {
            content += description + ": "
        }
        content += text
        return " (" + content + ")"
    }
    return ""
}

export function handleTranslations(translations?: WordDataEntry[], flagLanguage?: string) {
    if (translations && translations.length > 0) {

        // ignore empty translations
        let trans = translations.map(trans => {
            return trans.value !== "" && trans.value
        }).join(", ")

        if (flagLanguage) {
            return (
                <>
                    {", "} <Flag language={flagLanguage} /> {trans}
                </>
            );
        }

        return (
            <>{", "} {trans}</>
        )
    }
    return
}