import { z } from "zod";

const queryValidationSchema = z.object({
    query: z.string()
        .max(50, "Too long!")
        // characters from database
        .regex(/^$|^[a-zA-Z0-9\s.,!?-ÄÅÖàâäåèéêôöüÀÂÃáçíîï/:; ]+$/, {
            message: "Can't use that character!",
        }).optional()
})

export default queryValidationSchema