import { ReactNode } from "react";
import { ActionIcon, Box, Collapse, Grid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// 
import IWord from "../../interfaces/word";
import { fullClasses } from "../../interfaces/class";
import { handleParenthesis, handleTranslations } from "./helpers/word";
import Links from "./Links";
import useSettingsStore from "../../stores/settings";
import Flag from "./Flag";
import Entry from "./Entry";

function Word({ word }: { word: IWord }) {
    const { settings } = useSettingsStore()
    // handles expand/collapse
    const [opened, { toggle }] = useDisclosure(settings.expandResults)

    // TODO some things in italics?

    // ignoring the url property since it only has sfw files 🪦

    // not really sure what the level is
    // level is also ignored in the original website

    const language = word.language === "en" ? "English" : "Swedish"
    const otherLanguage = word.language === "en" ? "Swedish" : "English"
    const classes = word.class?.split(", ").map((item) => fullClasses[item] || item)
    const translations = word.data?.translation

    // doesn't have comments
    // this is not IPA, I don't know what it is, I'm not using it
    const pronunciations = word.data?.phonetic?.map(pronun => "[" + pronun.value + "]").join(", ")
    const pronunciationLink: ReactNode =
        <a
            href={"https://forvo.com/search/" + word.value.replace("|", "") + "/sv/"}
            target="_blank"
        >
            Search on forvo.com
        </a>

    const variants = word.data?.variant?.map(item => {
        let variant = ""
        if (item.alt) { variant += item.alt + " " }
        variant += item.value + handleParenthesis(item.comment)
        return variant
    }).join(", ")

    const inflections = word.data?.paradigm?.map((para, index) => {
        return <Entry key={index} entry={para.inflection} />
    })

    const see = word.data?.see?.filter(see => {
        // animation and phonetic are sfw files 🪦
        // no idea what saldo is but it's not displayed in the original website
        if (see.type !== "saldo" && see.type !== "animation" && see.type !== "phonetic") {
            return true
        }
    }).map(see => see.value)

    const related = word.data?.related?.map(rel => {
        // no flag here because related words are weird
        let newRel = rel.value + handleTranslations(rel.translation)
        let add = []
        rel.type && add.push(rel.type)
        rel.comment && add.push(rel.comment)
        return newRel + handleParenthesis(add.join(", "))
    }).join(", ")

    return (
        <Box
            px="sm" py="md"
            style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
        >
            {/* Word header */}
            <Grid align="center">

                {/* Word, flags, classes, comments and translations */}
                <Grid.Col span="auto">
                    <Flag language={language} /> {" "}
                    <Text span fw={700}>{word.value}</Text> {" "}
                    {classes}
                    {word.comment && " (" + word.comment + ")"}
                    {translations &&
                        <>
                            {", "} <Flag language={otherLanguage} /> {" "}
                            {translations.map((trans, i) => (
                                <span key={i}>
                                    {/* Prepend comma to items, 0 is false so the first item has no comma */}
                                    {i ? ", " : ""}
                                    <Text span fw={700}>{trans.value}</Text>
                                    {handleParenthesis(trans.comment)}
                                </span>
                            ))}
                        </>
                    }
                </Grid.Col>

                {/* Chevron to see the rest of the data  */}
                {/* Only display if the word has any data other than the translation */}
                {word.data && Object.keys(word.data).some(key => key !== "translation") &&
                    <Grid.Col span="content">
                        <ActionIcon variant="subtle" aria-label="Expand entry" onClick={toggle} style={{ float: "right" }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                fill="var(--mantine-primary-color-4)"
                                height="1em" width="1em"
                                style={{
                                    transform: opened ? "rotate(180deg)" : "rotate(0)",
                                    transition: "all 0.35s ease"
                                }}
                            >
                                {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        </ActionIcon>
                    </Grid.Col>
                }
            </Grid>

            {/* Other word data */}
            {/* Only display if the word has any data other than the translation */}
            {word.data && Object.keys(word.data).some(key => key !== "translation") &&
                <Collapse in={opened}>
                    <Box mt="md">
                        {word.data?.grammar && <Text>Grammar: <Entry entry={word.data?.grammar} /></Text>}
                        {pronunciations && <Text>Pronunciation: {pronunciationLink}</Text>}
                        {/* I think there's always only one explanation, but just to be sure, treat as an array */}
                        {word.data?.explanation && <Text>Explanation: <Entry entry={word.data?.explanation} flagLanguage={otherLanguage} /></Text>}
                        {variants && <Text>Variants: {variants}</Text>}
                        {see && see.length > 0 && <Text>See: {" "} <Links links={see} /></Text>}
                        {inflections && <Text>Inflections: {inflections}</Text>}
                        {word.data?.use && <Text>Use: <Entry entry={word.data?.use} /></Text>}
                        {word.data?.synonym && <Text>Synonyms: <Entry entry={word.data?.synonym} /></Text>}
                        {word.data?.definition && <><Text>Definition: <Entry entry={word.data?.definition} flagLanguage={otherLanguage} /></Text></>}
                        {word.data?.derivation && <><Text>Derivations: </Text><Entry entry={word.data?.derivation} flagLanguage={otherLanguage} asList /></>}
                        {word.data?.example && <><Text>Examples: </Text><Entry entry={word.data?.example} flagLanguage={otherLanguage} asList /></>}
                        {word.data?.idiom && <><Text>Idioms: </Text><Entry entry={word.data?.idiom} flagLanguage={otherLanguage} asList /></>}
                        {/* some compounds have comments but it looks like they're not supposed to
                        the comments are not displayed in the original website */}
                        {word.data?.compound && <><Text>Compounds: </Text><Entry entry={word.data?.compound} flagLanguage={otherLanguage} asList /></>}
                        {related && <Text>Related: {related}</Text>}
                    </Box>
                </Collapse>
            }
        </Box>
    )
}

export default Word