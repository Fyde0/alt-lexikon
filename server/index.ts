import express, { Request, Response, NextFunction } from "express"
import Database from "better-sqlite3"
import cors from "cors"
import helmet from "helmet"
import { rateLimit } from 'express-rate-limit'
// 
import { logDebug, logInfo } from "./helpers/log"
import searchController from "./controllers/words"

// TODO debug logs

const app = express()
const port = process.env.PORT || "3000"

// Fake delay
// app.use((req: Request, res: Response, next: NextFunction) => {
//     setTimeout(next, 1000)
// })

app.use(cors())
app.use(helmet())
app.disable('x-powered-by')
// Trust proxy on local network (reverse proxy)
app.set("trust proxy", "loopback")

// rate limiter, 100 requests per minute
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false
})

app.use(limiter)

// open db
// TODO check if db is correct (maybe do a test query?)
logDebug("Opening database file")
const db_file = process.env.DB_FILE || "words.db"
const file_db = new Database(db_file, { readonly: true })

// DON'T DO THIS
// file_db.pragma("journal_mode = WAL")

// copy db to memory
const buffer = file_db.serialize()
file_db.close()

logDebug("Copying database to memory")
export const mem_db = new Database(buffer, { readonly: true })

// logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logInfo(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.ip}]`)
    next()
})

// routes
app.get("/words", searchController.searchWords)
app.get("/words/:word", searchController.specificWord)

// fallback 404
app.use((req, res, next) => {
    res.status(404).send("¯\\(º_o)/¯")
})

app.listen(port, () => {
    logInfo("Server listening on port " + port)
})