import { useEffect, useState } from "react";
import { Button, Combobox, Grid, Loader, TextInput, useCombobox } from "@mantine/core";
// 
import { searchWords } from "../api/words";

function SearchInput() {
    const [query, setQuery] = useState<string>("")
    const combobox = useCombobox()

    const words = searchWords({ query: query })

    // select first option when data changes
    useEffect(() => {
        combobox.selectFirstOption()
    }, [words.data])

    return (
        <Combobox
            // onOptionSubmit={handleSubmit}
            withinPortal={false}
            store={combobox}
        >
            <Grid>

                {/* Text input */}
                <Grid.Col span="auto">
                    <Combobox.Target >
                        <TextInput
                            placeholder="Search dictionary"
                            value={query}
                            autoFocus={true}
                            onChange={(event) => {
                                setQuery(event.currentTarget.value)
                                combobox.resetSelectedOption()
                            }}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                            rightSection={words.isFetching && <Loader size={18} />}
                        />
                    </Combobox.Target>
                </Grid.Col>

                {/* Search button */}
                <Grid.Col span="content">
                    <Button
                    // onClick={handleSubmit}
                    >
                        Search
                    </Button>
                </Grid.Col>

            </Grid>

            {/* Search results */}
            {words.isSuccess &&
                <Combobox.Dropdown>
                    <Combobox.Options>
                        {words.data.length === 0 && <Combobox.Empty>No results found</Combobox.Empty>}
                        {
                            words.data.map((item: any, i: number) => (
                                <Combobox.Option value={item.word} key={i}>
                                    {item.language === "en" ? "🇬🇧" : "🇸🇪"} {item.word}
                                </Combobox.Option>
                            ))
                        }
                    </Combobox.Options>
                </Combobox.Dropdown>
            }
        </Combobox>
    )
}

export default SearchInput