import { isWithInflection, isWithTranslation, WordDataEntry, WordDataEntryWithInflection, WordDataEntryWithInflectionAndTranslation, WordDataEntryWithTranslation } from "../../interfaces/word";
import { handleParenthesis } from "./helpers/word";
import Flag from "./Flag";
import { List, Text } from "@mantine/core";

function Entry(
    {entry, flagLanguage, asList = false}: 
    {
        entry?: WordDataEntry[] | WordDataEntryWithInflection[] | WordDataEntryWithTranslation[] | WordDataEntryWithInflectionAndTranslation[];
        flagLanguage?: string;
        asList?: boolean;
    }) {

        const entries = entry?.map((item) => {
            // entry value and comment in parenthesis
            const value = item.value + handleParenthesis(item.comment)
            // add inflection if it exists
            let infl = ""
            if (isWithInflection(item)) {
                infl = handleParenthesis(item.inflection, "Inflection")
            }
            // add translation if it exists, add flag if in props
            let trans = <></>;
            if (isWithTranslation(item)) {
                trans = 
                    <>{
                        item.translation?.map(trans => {
                            return trans.value !== "" && trans.value
                        }).join(", ") || ""
                    }</>

                if (flagLanguage) {
                    trans = <>{", "} <Flag language={flagLanguage} /> {trans}</>
                } else {
                    trans = <>{", "} {trans}</>
                }
            }
            
            return (
                <>{value}{infl}{trans}</>
            )
        })

        if (asList) {
            return (
                <>
                    {/* 
                    Lists are broken, this is a fix, see: 
                    https://github.com/mantinedev/mantine/issues/2778#issuecomment-1288176323
                    */}
                    <style>
                        {`
                            li {
                                display: flex;
                                
                                &::before {
                                    content: ' ';
                                    display: list-item;
                                }
                            }
                        `}
                    </style>
                    <List>
                        {
                            entries?.map((entry, i) => {
                                return <List.Item key={i}><Text span>{entry}</Text></List.Item>
                            })
                        }
                    </List>
                </>
            )
        } else {
            return (
            <>{
                entries?.map((entry, index) => {
                    return <Text key={index} span>{(index ? ", " : "")}{entry}</Text>
                })
            }</>
            )
        }
}

export default Entry;
