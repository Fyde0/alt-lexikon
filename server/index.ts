import express, { Request, Response, NextFunction } from "express"
import Database from "better-sqlite3"
import cors from "cors"
// 
import { logDebug, logInfo } from "./helpers/log"
import searchController from "./controllers/words"

const app = express()
const port = 3000

// TODO debug logs

// Fake delay
// app.use((req: Request, res: Response, next: NextFunction) => {
//     setTimeout(next, 1000)
// })

// open db
// TODO check if db is correct (maybe do a test query?)
logDebug("Opening database")
export const file_db = new Database("words.db")
// for better performance
file_db.pragma("journal_mode = WAL")

app.use(cors())

app.use((req: Request, res: Response, next: NextFunction) => {
    logInfo(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.ip}]`)
    next()
})

// routes
app.get("/words", searchController.searchWords)
app.get("/words/:word", searchController.specificWord)

app.listen(port, () => {
    logInfo("Server started")
})