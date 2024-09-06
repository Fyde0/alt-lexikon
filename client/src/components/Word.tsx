import { Accordion, List, Text } from "@mantine/core";
import IWord from "../interfaces/word";
import { fullClasses } from "../interfaces/class";
import { Link } from "react-router-dom";

function Word({ word, itemKey }: { word: IWord, itemKey: number }) {

    // TODO change link color, add links to all words?
    // TODO check which elements have translations (and comments?)

    // ignoring the url property since it only has sfw files 🪦

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => fullClasses[item] || item)
    const translations = word.data?.translation

    const grammarComments = word.data?.grammar?.map(grammar => grammar.value).join(", ")
    const pronunciations = word.data?.phonetic?.map(pronun => "[" + pronun.value + "]").join(", ")
    // TODO add forvo link

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
    // .sort((a, b) => Number(a.level) - Number(b.level))
    const synonyms = word.data?.synonym?.map(item => item.value).join(", ")

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

    const see = word.data?.see?.filter(see => {
        // animation and phonetic are sfw files 🪦
        // no idea what saldo is but it's not displayed in the original website
        if (see.type !== "saldo" && see.type !== "animation" && see.type !== "phonetic") {
            return true
        }
    }).map(see => see.value)

    const related = word.data?.related?.map(rel => {
        let newRel = rel.value
        let add = []
        rel.type && add.push(rel.type)
        rel.comment && add.push(rel.comment)
        if (add.length > 0) {
            newRel += " (" + add.join(", ") + ")"
        }
        return newRel
    }).join(", ")

    const compounds = word.data?.compound?.map(comp => {
        // TODO add translation
        let compound = comp.value
        if (comp.inflection) {
            compound += "(Inflection: " + comp.inflection + ")"
        }
        return compound
    })

    const derivations = word.data?.derivation?.map(deriv => {
        // TODO add translation
        let derivation = deriv.value
        if (deriv.inflection) {
            derivation += "(Inflection: " + deriv.inflection + ")"
        }
        return derivation
    })

    const use = word.data?.use?.map(use => use.value).join(", ")

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
                {see && see.length > 0 && <Text>See: {" "}
                    {see.map((see, i) => {
                        return (
                            <span key={i}>
                                {i ? ", " : ""}
                                <Link key={i} to={"/" + see}>{see}</Link>
                            </span>
                        )
                    })}
                </Text>}
                {inflections && <Text>Inflections: {inflections}</Text>}
                {use && <Text>Use: {use}</Text>}
                {synonyms && <Text>Synonyms: {synonyms}</Text>}
                {definitions && <Text>Definitions: {definitions}</Text>}
                {derivations &&
                    <>
                        <Text>Derivations: </Text>
                        <List withPadding>
                            {
                                derivations.map((derivation, i) => {
                                    return <List.Item key={i}>{derivation}</List.Item>
                                })
                            }
                        </List>
                    </>
                }
                {examples &&
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
                {idioms &&
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
                {compounds &&
                    <>
                        <Text>Compounds: </Text>
                        <List withPadding>
                            {
                                compounds.map((compound, i) => {
                                    return <List.Item key={i}>{compound}</List.Item>
                                })
                            }
                        </List>
                    </>
                }

                {related && <Text>Related: {related}</Text>}
            </Accordion.Panel>
        </Accordion.Item>
    )
}

export default Word