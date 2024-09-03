import { Accordion } from "@mantine/core"
// 
import Word from "../components/Word"
import { getWord } from "../api/words"

function Results({ word }: { word: string | undefined }) {

    const getWordQuery = getWord({ word: word })

    if (getWordQuery.isSuccess) {
        return (
            <Accordion multiple={true}>
                {
                    getWordQuery.data.map((word, i) => {
                        // mantine's accordion needs the itemKey
                        return <Word key={i} word={word} itemKey={i} />
                    })
                }
            </Accordion>
        )
    }
}

export default Results