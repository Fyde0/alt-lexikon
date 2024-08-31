import express, { Request, Response, NextFunction } from "express"
import Database from "better-sqlite3"
import cors from "cors"
// 
import log from "./helpers/log"
import searchController from "./controllers/words"

const app = express()
const port = 3000

// TODO debug logs

// Fake delay
// app.use((req: Request, res: Response, next: NextFunction) => {
//     setTimeout(next, 1000)
// })

// open db
export const file_db = new Database("words.db")
// for better performance
file_db.pragma("journal_mode = WAL")

app.use(cors())

// routes
app.get("/words", searchController.searchWords)
app.get("/words/:word", searchController.specificWord)

app.listen(port, () => {
    log("Server started")
})