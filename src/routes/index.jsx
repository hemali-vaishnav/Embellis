import { createBrowserRouter } from "react-router";
import DefaultLayout from "./DefaultLayout";
import Home from "../components/Home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <DefaultLayout />
        ),
        children: [
            {
                path: "/",
                element: <Home />,
            },


        ]
    }
])
export default router;