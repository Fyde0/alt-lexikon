import { Box, Text } from "@mantine/core";
import IWord from "../interfaces/word";
import { fullClasses } from "../interfaces/class";

function Word({ word }: { word: IWord }) {

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => {
        return fullClasses[item] || ""
    })

    const translations = word.data.translation.map((trans: any) => {
        return trans.value
    })


    return (
        <Box>
            {flag} <Text span fw={700}>{word.word}</Text> {classes} {otherFlag} {translations.join(", ")}
        </Box>
    )
}

export default Word