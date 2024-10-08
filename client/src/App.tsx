import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTheme, DEFAULT_THEME, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
// 
import "./assets/css/index.css"
import Root from "./pages/Root"
import useSettingsStore from "./stores/settings"

function App() {
    const { settings } = useSettingsStore()

    // React Query
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
                staleTime: 1000 * 60 * 60
            }
        }
    })

    // Mantine
    const theme = createTheme({
        fontFamily: settings.font === "Default" ? DEFAULT_THEME.fontFamily : settings.font,
        primaryColor: settings.accentColor
    })

    // React Router
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "/",
                    lazy: () => import("./pages/Home")
                },
                {
                    path: "/:word?",
                    lazy: () => import("./pages/Results")
                }
            ]
        }
    ],
        { basename: import.meta.env.BASE_URL }
    )

    return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </MantineProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)