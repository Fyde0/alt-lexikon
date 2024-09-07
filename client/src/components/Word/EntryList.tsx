import { List } from "@mantine/core"

function EntryList({ entries }: { entries: string[] }) {
    return (
        <List withPadding>
            {
                entries.map((entry, i) => {
                    return <List.Item key={i}>{entry}</List.Item>
                })
            }
        </List>
    )
}

export default EntryList