import { useEffect } from "react";
import { Button, Combobox, Grid, Loader, TextInput, useCombobox } from "@mantine/core";
import { useForm } from '@mantine/form';
// 
import { searchWords } from "../api/words"
import { useNavigate } from "react-router-dom";

function SearchInput({ word }: { word: string | undefined }) {
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

    return (
        // onSubmit for Enter key
        <form onSubmit={form.onSubmit(() => navigate("/" + form.values.query))}>
            <Combobox
                // onSubmit for when selecting an option in the list
                onOptionSubmit={(option) => navigate("/" + option)}
                withinPortal={false}
                store={combobox}
            >
                <Grid maw="500px" mx="auto" px="md">

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