import { Link } from "react-router-dom"

function Links({ links }: { links: string[] }) {
    if (links.length === 0) {
        return <></>
    }
    links.map((link, i) => {
        return (
            <span key={i}>
                {i ? ", " : ""}
                <Link key={i} to={"/" + link}>{link}</Link>
            </span>
        )
    })
}

export default Links