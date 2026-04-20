import { createBrowserRouter } from "react-router";
import DefaultLayout from "./DefaultLayout";
import Home from "../components/Home/Home";
import Cart from "../common/Cart/Cart";
import Favorite from "../common/Favorite/Favorite";
import Custom from "../components/Custom/Custom";

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
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/favorite",
                element: <Favorite />,
            },
            {
                path: "/custom",
                element: <Custom />,
            },
        ]
    }
])
export default router;
