import { Response } from "express"
import { logError } from "./log"

export function serverError(res: Response, error: any) {
    // 500 Internal Server Error
    logError(error)
    return res.status(500).json({ "error": "Server error" })
}