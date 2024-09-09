import { ActionIcon, Box, Collapse, Grid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// 
import IWord from "../../interfaces/word";
import { fullClasses } from "../../interfaces/class";
import { handleEntry, handleParenthesis, handleTranslations } from "./helpers/word";
import Links from "./Links";
import EntryList from "./EntryList";
import useSettingsStore from "../../stores/settings";
import { ReactNode } from "react";

function Word({ word }: { word: IWord }) {
    const { settings } = useSettingsStore()
    // handles expand/collapse
    const [opened, { toggle }] = useDisclosure(settings.expandResults)

    // TODO add links to words and translations?
    // TODO some things in italics?

    // ignoring the url property since it only has sfw files 🪦

    const flag = word.language === "en" ? "🇬🇧" : "🇸🇪"
    const otherFlag = word.language === "en" ? "🇸🇪" : "🇬🇧"
    const classes = word.class?.split(", ").map((item) => fullClasses[item] || item)
    const translations = word.data?.translation
    const grammar = handleEntry(word.data?.grammar)
    const definitions = handleEntry(word.data?.definition, otherFlag)

    // not really sure what the level is
    // level is also ignored in the original website
    const synonyms = handleEntry(word.data?.synonym)
    const examples = handleEntry(word.data?.example, otherFlag, true)
    const idioms = handleEntry(word.data?.idiom, otherFlag, true)

    // I think there's always only one explanation
    // but just to be sure, treat as an array
    const explanation = handleEntry(word.data?.explanation, otherFlag)

    // some compounds have comments but it looks like they're not supposed to
    // the comments are not displayed in the original website
    const compounds = handleEntry(word.data?.compound, otherFlag, true)
    const derivations = handleEntry(word.data?.derivation, otherFlag, true)
    const use = handleEntry(word.data?.use)

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

    const inflections = word.data?.paradigm?.map(para => {
        return handleEntry(para.inflection)
    }).join(", ")

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
                    {flag} {" "}
                    <Text span fw={700}>{word.value}</Text> {" "}
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

            {/* Other word data */}
            {/* Only display if the word has any data other than the translation */}
            {word.data && Object.keys(word.data).some(key => key !== "translation") &&
                <Collapse in={opened}>
                    <Box mt="md">
                        {grammar && <Text>Grammar: {grammar}</Text>}
                        {pronunciations && <Text>Pronunciation: {pronunciationLink}</Text>}
                        {explanation && <Text>Explanation: {explanation}</Text>}
                        {variants && <Text>Variants: {variants}</Text>}
                        {see && see.length > 0 && <Text>See: {" "} <Links links={see} /></Text>}
                        {inflections && <Text>Inflections: {inflections}</Text>}
                        {use && <Text>Use: {use}</Text>}
                        {synonyms && <Text>Synonyms: {synonyms}</Text>}
                        {definitions && <Text>Definition: {definitions}</Text>}
                        {derivations && <><Text>Derivations: </Text><EntryList entries={derivations} /></>}
                        {examples && <><Text>Examples: </Text><EntryList entries={examples} /></>}
                        {idioms && <><Text>Idioms: </Text><EntryList entries={idioms} /></>}
                        {compounds && <><Text>Compounds: </Text><EntryList entries={compounds} /></>}
                        {related && <Text>Related: {related}</Text>}
                    </Box>
                </Collapse>
            }
        </Box>
    )
}

export default Word