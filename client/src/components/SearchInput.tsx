import { useEffect, useState } from "react";
import { Button, Combobox, Grid, Loader, TextInput, useCombobox } from "@mantine/core";
// 
import { searchWords } from "../api/words";
import { IWordLang } from "../interfaces/word";

function SearchInput() {
    const [query, setQuery] = useState<string>("")
    const combobox = useCombobox()

    const wordsQuery = searchWords({ query: query })

    // select first option when data changes
    useEffect(() => {
        combobox.selectFirstOption()
    }, [wordsQuery.data])

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
                            error={wordsQuery.isError && wordsQuery.error.message}

                            autoFocus={true}

                            onChange={(event) => {
                                setQuery(event.currentTarget.value)
                                combobox.resetSelectedOption()
                            }}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}

                            rightSection={wordsQuery.isFetching && <Loader size={18} />}
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
            {wordsQuery.isSuccess &&
                <Combobox.Dropdown>
                    <Combobox.Options>
                        {wordsQuery.data.length === 0 && <Combobox.Empty>No results found</Combobox.Empty>}
                        {
                            wordsQuery.data.map((item, i) => (
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