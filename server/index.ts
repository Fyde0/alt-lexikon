import express from "express"
import Database from "better-sqlite3"
// 
import log from "./helpers/log"
import searchController from "./controllers/words"

const app = express()
const port = 3000

// open db
export const file_db = new Database("words.db")
// for better performance
file_db.pragma("journal_mode = WAL")

// routes
app.get("/words", searchController.searchWords)
app.get("/words/:word", searchController.specificWord)

app.listen(port, () => {
    log("Server started")
})