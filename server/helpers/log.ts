function log(message: string) {
    console.log("[" + now() + "]" + " " + message)
}

function now() {
    return new Date().toISOString()
}

export default log