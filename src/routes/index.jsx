import { createBrowserRouter } from "react-router";
import DefaultLayout from "./DefaultLayout";
import Home from "../pages/Home/Home";
import Cart from "../common/Cart/Cart";
import Favorite from "../common/Favorite/Favorite";
import Custom from "../pages/Custom/Custom";
import MenCollections from "../pages/MenCollections/MenCollections";
import WomenCollections from "../pages/WomenCollections/WomenCollections";

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
                path: "/collections/men",
                element: <MenCollections />,
            },
            {
                path: "/collections/women",
                element: <WomenCollections />,
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
