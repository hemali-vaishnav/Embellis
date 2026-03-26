import { createBrowserRouter } from "react-router";
import DefaultLayout from "./DefaultLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <DefaultLayout />
        ),
        children: [


        ]
    }
])
export default router;