import { Link } from "react-router-dom"

function Links({ links }: { links: string[] }) {
    return (
        links.map((link, i) => {
            return (
                <span key={i}>
                    {i ? ", " : ""}
                    <Link to={"/" + link}>{link}</Link>
                </span>
            )
        })
    )

}

export default Links