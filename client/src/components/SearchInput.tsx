import { useEffect } from "react";
import { Button, Combobox, Grid, Group, Kbd, Loader, TextInput, useCombobox } from "@mantine/core";
import { useForm } from '@mantine/form';
// 
import { searchWords } from "../api/words"
import { useNavigate } from "react-router-dom";
import useSettingsStore from "../stores/settings";

function SearchInput({ word }: { word: string | undefined }) {
    const { settings } = useSettingsStore()
    const navigate = useNavigate()

    const combobox = useCombobox()
    const form = useForm({
        initialValues: {
            query: word || "",
        },
        onValuesChange: () => {
            combobox.openDropdown()
            combobox.resetSelectedOption()
        }
    })

    // search options query
    const searchQuery = searchWords({ query: form.values.query })

    // select first option when data changes
    useEffect(() => {
        combobox.selectFirstOption()
    }, [searchQuery.data])

    // appends characters to input field, used for å, ä, ö
    function appendToInput(char: string) {
        form.setFieldValue("query", form.values.query + char)
        form.getInputNode("query")?.focus()
    }

    function handleSubmit(word: string) {
        combobox.closeDropdown()
        navigate("/" + word)
    }

    return (
        // onSubmit for Enter key
        <form
            onSubmit={form.onSubmit(() => handleSubmit(form.values.query))}
            style={{ width: "100%" }}
        >
            <Combobox
                // onSubmit for when selecting an option in the list
                onOptionSubmit={(option) => handleSubmit(option)}
                withinPortal={false}
                store={combobox}
            >
                <Grid maw="500px" mx="auto" px="md" align="center">

                    {/* Text input */}
                    <Grid.Col span="auto">
                        <Combobox.Target >
                            <TextInput
                                key={form.key("query")}
                                {...form.getInputProps("query")}

                                placeholder="Search dictionary"

                                error={searchQuery.isError && searchQuery.error.message}
                                autoFocus={true}

                                onFocus={(event) => {
                                    // selects the content when focused
                                    // (useful when autofocus)
                                    event.currentTarget.select()
                                    // opens the dropdown when focused
                                    // but not on autofocus
                                    if (form.isTouched("query")) {
                                        combobox.openDropdown()
                                    }
                                }}
                                onClick={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}

                                rightSection={searchQuery.isFetching && <Loader size={18} />}
                            />
                        </Combobox.Target>
                    </Grid.Col>
                    
                    {settings.showCharacters &&
                        <Grid.Col span="content">
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
                        </Grid.Col>
                    }

                    {/* Search button */}
                    <Grid.Col span="content">
                        <Button type="submit">Search</Button>
                    </Grid.Col>

                </Grid>

                {/* Search results */}
                {searchQuery.isSuccess &&
                    <Combobox.Dropdown>
                        <Combobox.Options>
                            {searchQuery.data.length === 0 && <Combobox.Empty>No results found</Combobox.Empty>}
                            {
                                searchQuery.data.map((item, i) => (
                                    <Combobox.Option value={item.word} key={i}>
                                        {item.language === "en" ? "🇬🇧" : "🇸🇪"} {item.word}
                                        {item.key !== "Word" && " (" + item.key + ": " + item.match + ")"}
                                    </Combobox.Option>
                                ))
                            }
                        </Combobox.Options>
                    </Combobox.Dropdown>
                }
            </Combobox>
        </form>
    )
}

export default SearchInput