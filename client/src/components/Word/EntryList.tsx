import { List } from "@mantine/core"

function EntryList({ entries }: { entries: string[] }) {
    return (
        <>
            {/* 
            Lists are broken, this is a fix, see: 
            https://github.com/mantinedev/mantine/issues/2778#issuecomment-1288176323
            */}
            <style>
                {`
                    li {
                        display: flex;
                        
                        &::before {
                            content: ' ';
                            display: list-item;
                        }
                    }
                `}
            </style>
            <List>
                {
                    entries.map((entry, i) => {
                        return <List.Item key={i}>{entry}</List.Item>
                    })
                }
            </List>
        </>
    )
}

export default EntryList