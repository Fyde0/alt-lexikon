import { Button, Group, Kbd } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"

function SwedishCharactersButtons({ form, inputName }: { form: UseFormReturnType<any>, inputName: string }) {
    
    function appendToInput(char: string) {
        form.setFieldValue(inputName, form.values.query + char)
        form.getInputNode(inputName)?.focus()
    }

    return (
        <Group gap={2} align="center">
            <Button
                variant="transparent" p={0} m={0}
                onClick={() => appendToInput("å")}
            >
                <Kbd size="md">å</Kbd>
            </Button>
            <Button
                variant="transparent" p={0} m={0}
                onClick={() => appendToInput("ö")}
            >
                <Kbd size="md">ö</Kbd>
            </Button>
            <Button
                variant="transparent" p={0} m={0}
                onClick={() => appendToInput("ä")}
            >
                <Kbd size="md">ä</Kbd>
            </Button>
        </Group>
    )
}

export default SwedishCharactersButtons