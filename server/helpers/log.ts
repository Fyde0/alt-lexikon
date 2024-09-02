import util from "node:util"

const debuglog = util.debuglog("lexikon")

export function logInfo(message: string) {
    console.log("[" + now() + "]" + " " + message)
}

export function logDebug(message: string) {
    debuglog("[" + now() + "]" + " [DEBUG] " + message)
}

export function logError(message: string) {
    console.error("[" + now() + "]" + " [ERROR] " + message)
}

function now() {
    return new Date().toISOString()
}