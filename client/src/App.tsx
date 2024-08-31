import ReactDOM from "react-dom/client"
import { createTheme, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "./assets/css/index.css"
// 
import Root from "./pages/Root"

function App() {

    const theme = createTheme({
        fontFamily: 'Montserrat, sans-serif'
    })

    return (
        <MantineProvider
            defaultColorScheme="dark"
            theme={theme}
        >
            <Root />
        </MantineProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)