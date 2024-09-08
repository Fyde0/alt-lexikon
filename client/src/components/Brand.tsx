import { useNavigate } from "react-router-dom"
import { Button, Flex, Title } from "@mantine/core"

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
                    <i className="fa-solid fa-book" />
                    <span>Alt-Lexikon</span>
                </Flex>
            </Title>
        </Button>
    )
}

export default Brand