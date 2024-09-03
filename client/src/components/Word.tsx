import { Accordion, Text } from "@mantine/core";
import IWord from "../interfaces/word";
import { fullClasses } from "../interfaces/class";

function Word({ word, itemKey }: { word: IWord, itemKey: number }) {

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => {
        return fullClasses[item] || ""
    })

    const translations = word.data.translation.map((trans: any) => {
        return trans.value
    })

    return (
        <Accordion.Item value={String(itemKey)}>
            <Accordion.Control>
                {flag} {" "}
                <Text span fw={700}>{word.word}</Text> {" "}
                {classes} {" "}
                {otherFlag} {" "}
                <Text span fw={700}>{translations.join(", ")}</Text>
            </Accordion.Control>
            <Accordion.Panel>content</Accordion.Panel>
        </Accordion.Item>
    )
}

export default Word