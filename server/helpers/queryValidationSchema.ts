import { z } from "zod";

const queryValidationSchema = z.object({
    query: z.string()
        .max(50, "The query is too long!")
        // characters from database
        .regex(/^$|^[a-zA-Z0-9\s.,!?-ÄÅÖàâäåèéêôöüÀÂÃáçíîï/:; ]+$/, {
            message: "The query contains invalid characters!",
        }).optional()
})

export default queryValidationSchema