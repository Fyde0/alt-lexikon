import express from "express"
import Database from "better-sqlite3"
// 
import { IWordLang } from "./interfaces/word"
import log from "./helpers/log"

const app = express()
const port = 3000

const file_db = new Database("words.db")
// for better performance
file_db.pragma("journal_mode = WAL")

app.get("/search/:query", (req, res) => {
    const { query } = req.params
    const results = file_db
        .prepare("SELECT DISTINCT word, language FROM Words WHERE word LIKE ?")
        .all(query + "%") as IWordLang[]

    // simple sorting by lenght
    results.sort((a, b) => {
        // exact match first
        if (a.word === query) return -1
        if (b.word === query) return 1
        // shorter first
        return a.word.length - b.word.length
    })

    // only 20 results
    results.splice(20)
    
    return res.status(200).json(results)
})

app.listen(port, () => {
    log("Server started")
})