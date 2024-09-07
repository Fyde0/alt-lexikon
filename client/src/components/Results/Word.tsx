import { Link } from "react-router-dom";
import { ActionIcon, Box, Collapse, Grid, List, Text } from "@mantine/core";
// 
import IWord from "../../interfaces/word";
import { fullClasses } from "../../interfaces/class";
import { useDisclosure } from "@mantine/hooks";

function Word({ word }: { word: IWord }) {
    // handles expand/collapse
    const [opened, { toggle }] = useDisclosure(false)

    // TODO normalize translation handling
    // TODO change link color, add links to all words?
    // TODO check which elements have comments
    // TODO add forvo link
    // TODO some things in italics?

    // ignoring the url property since it only has sfw files 🪦

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => fullClasses[item] || item)
    const translations = word.data?.translation

    const grammar = word.data?.grammar?.map(grammar => grammar.value).join(", ")
    const pronunciations = word.data?.phonetic?.map(pronun => "[" + pronun.value + "]").join(", ")

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

    const definitions = word.data?.definition?.map(def => {
        let definition = def.value
        if (def.translation) {
            const trans = def.translation.map(trans => trans.value).join(", ")
            definition += " (" + trans + ")"
        }
        return definition
    }).join(", ")

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
        if (rel.translation) {
            newRel += ", " + rel.translation[0].value
        }
        let add = []
        rel.type && add.push(rel.type)
        rel.comment && add.push(rel.comment)
        if (add.length > 0) {
            newRel += " (" + add.join(", ") + ")"
        }
        return newRel
    }).join(", ")

    const compounds = word.data?.compound?.map(comp => {
        let compound = comp.value
        if (comp.inflection) {
            compound += " (Inflection: " + comp.inflection + ")"
        }
        if (comp.translation) {
            compound += ", " + otherFlag + " " + comp.translation[0].value
        }
        return compound
    })

    const derivations = word.data?.derivation?.map(deriv => {
        let derivation = deriv.value
        if (deriv.translation) {
            derivation += ", " + otherFlag + " " + deriv.translation[0].value
        }
        if (deriv.inflection) {
            derivation += "(Inflection: " + deriv.inflection + ")"
        }
        return derivation
    })

    const use = word.data?.use?.map(use => use.value).join(", ")

    return (
        <Box
            px="sm" py="md"
            style={{ borderBottom: "1px solid var(--mantine-color-dark-4)" }}
        >
            {/* Word header */}
            <Grid align="center">
                <Grid.Col span="auto">
                    {flag} {" "}
                    <Text span fw={700}>{word.word}</Text> {" "}
                    {classes}
                    {word.comment && " (" + word.comment + ")"}
                    {translations &&
                        <>
                            {", "} {otherFlag} {" "}
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
                </Grid.Col>
                {/* Only display the chevron if the word has any data other than the translation */}
                {word.data && Object.keys(word.data).some(key => key !== "translation") &&
                    <Grid.Col span="content">
                        <ActionIcon variant="subtle" aria-label="Expand entry" onClick={toggle} style={{ float: "right" }}>
                            <i
                                className="fa-solid fa-chevron-down"
                                style={{
                                    transform: opened ? "rotate(180deg)" : "rotate(0)",
                                    transition: "all 0.35s ease"
                                }}
                            />
                        </ActionIcon>
                    </Grid.Col>
                }
            </Grid>

            {/* Word content */}
            <Collapse in={opened}>
                <Box mt="md">
                    {grammar && <Text>Grammar: {grammar}</Text>}
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
                </Box>
            </Collapse>
        </Box>
    )
}

export default Word