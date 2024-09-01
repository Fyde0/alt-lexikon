import util from "node:util"

const debuglog = util.debuglog("lexikon")

export function logInfo(message: string) {
    console.log("[" + now() + "]" + " " + message)
}

export function logDebug(message: string) {
    debuglog("[DEBUG] " + "[" + now() + "]" + " " + message)
}

export function logError(message: string) {
    console.error("[ERROR] " + "[" + now() + "]" + " " + message)
}

function now() {
    return new Date().toISOString()
}