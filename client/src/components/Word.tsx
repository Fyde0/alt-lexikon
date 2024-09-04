import { Accordion, List, Text } from "@mantine/core";
import IWord from "../interfaces/word";
import { fullClasses } from "../interfaces/class";

function Word({ word, itemKey }: { word: IWord, itemKey: number }) {

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => fullClasses[item] || item)
    const translations = word.data?.translation

    const grammarComments = word.data?.grammar?.map(grammar => grammar.value).join(", ")
    const pronunciations = word.data?.phonetic?.map(pronun => "[" + pronun.value + "]").join(", ")
    // TODO add audio file?

    // see

    const variants = word.data?.variant?.map(item => {
        let variant = ""
        if (item.alt) { variant += item.alt + " " }
        variant += item.value
        if (item.comment) { variant += "(" + item.comment + ")" }
        return variant
    }).join(", ")

    const inflections = word.data?.paradigm?.map(para => {
        return para.inflection.map(inflec => {
            let inflection = inflec.value
            if (inflec.comment) {
                inflection += " (" + inflec.comment + ")"
            }
            return inflection
        }).join(", ")
    }).join(", ")

    const definitions = word.data?.definition?.map(def => def.value).join(", ")

    // not really sure what the level is
    const synonyms = word.data?.synonym?.sort((a, b) => Number(a.level) - Number(b.level))
        .map(item => item.value)
        .join(", ")

    const examples = word.data?.example?.map(ex => {
        let example = ex.value
        if (ex.translation) {
            const trans = ex.translation.map(trans => trans.value).join(", ")
            example += " (" + trans + ")"
        }
        return example
    })

    const idioms = word.data?.idiom?.map(id => {
        let idiom = id.value
        if (id.translation) {
            const trans = id.translation.map(trans => trans.value).join(", ")
            idiom += " (" + trans + ")"
        }
        return idiom
    })

    // I think there's always only one explanation, but just to be sure
    const explanation = word.data?.explanation?.map(expl => {
        let explanation = expl.value
        if (expl.translation) {
            const trans = expl.translation.map(trans => trans.value).join(", ")
            explanation += " (" + trans + ")"
        }
        return explanation
    }).join(", ")

    return (
        <Accordion.Item value={String(itemKey)}>
            <Accordion.Control>
                {flag} {" "}
                <Text span fw={700}>{word.word}</Text> {" "}
                {classes}
                {word.comment && " (" + word.comment + ")"}
                {translations &&
                    <>
                        {", "} {otherFlag} {" "}
                        {/* <Text span fw={700}>{translations}</Text> */}
                        {translations.map((trans, i) => (
                            <span key={i}>
                                {/* Prepend comma to items, 0 is false so the first item has no comma */}
                                {i ? ", " : ""}
                                <Text span fw={700}>{trans.value}</Text>
                                {trans.comment && <Text span>{" "}({trans.comment})</Text>}
                            </span>
                        ))}
                    </>
                }
            </Accordion.Control>
            <Accordion.Panel>
                {grammarComments && <Text>Grammar: {grammarComments}</Text>}
                {pronunciations && <Text>Pronunciation: {pronunciations}</Text>}
                {explanation && <Text>Explanation: {explanation}</Text>}
                {variants && <Text>Variants: {variants}</Text>}
                {inflections && <Text>Inflections: {inflections}</Text>}
                {synonyms && <Text>Synonyms: {synonyms}</Text>}
                {definitions && <Text>Definitions: {definitions}</Text>}
                {
                    examples &&
                    <>
                        <Text>Examples: </Text>
                        <List withPadding>
                            {
                                examples.map((example, i) => {
                                    return <List.Item key={i}>{example}</List.Item>
                                })
                            }
                        </List>
                    </>
                }
                {
                    idioms &&
                    <>
                        <Text>Idioms: </Text>
                        <List withPadding>
                            {
                                idioms.map((idiom, i) => {
                                    return <List.Item key={i}>{idiom}</List.Item>
                                })
                            }
                        </List>
                    </>
                }
                
            </Accordion.Panel>
        </Accordion.Item>
    )
}

export default Word