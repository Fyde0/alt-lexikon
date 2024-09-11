import { useNavigate } from "react-router-dom"
import { Button, Flex, Title } from "@mantine/core"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faBook } from "@fortawesome/free-solid-svg-icons"

function Brand() {
    const navigate = useNavigate()

    return (
        <Button
            variant="transparent" color="var(--mantine-color-text)"
            onClick={() => navigate("/")}
            p={0}
        >
            <Title order={1} size="h3" fw={400}>
                <Flex align="center" gap="sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                        fill="var(--mantine-color-text)"
                        height="1em" width="1em"
                    >
                        {/* <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
                        <path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <span>Alt-Lexikon</span>
                </Flex>
            </Title>
        </Button>
    )
}

export default Brand