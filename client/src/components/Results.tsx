import { getWord } from "../api/words"
import Word from "./Word"

function Results({ wordToGet }: { wordToGet: string }) {

    const wordQuery = getWord({ word: wordToGet })

    if (wordQuery.isSuccess) {

        // TODO order?

        return (
            <>
                {
                    wordQuery.data.map((word, i) => {
                        return <Word key={i} word={word} />
                    })
                }
            </>
        )
    }
}

export default Results