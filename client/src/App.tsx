import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTheme, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
// 
import "./assets/css/index.css"
import Root from "./pages/Root"

function App() {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
                staleTime: 1000 * 60 * 60
            }
        }
    })

    const theme = createTheme({
        fontFamily: 'Montserrat, sans-serif'
    })

    return (
        <MantineProvider
            defaultColorScheme="dark"
            theme={theme}
        >
            <QueryClientProvider client={queryClient}>
                <Root />
            </QueryClientProvider>
        </MantineProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)