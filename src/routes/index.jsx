import { createBrowserRouter } from "react-router";
import DefaultLayout from "./DefaultLayout";
import Home from "../User/pages/Home/Home";
import Cart from "../User/common/Cart/Cart";
import Favorite from "../User/common/Favorite/Favorite";
import Custom from "../User/pages/Custom/Custom";
import MenCollections from "../User/pages/MenCollections/MenCollections";
import WomenCollections from "../User/pages/WomenCollections/WomenCollections";
import UserProfile from "../User/pages/UserProfile/UserProfile";

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
            {
                path: "/profile",
                element: <UserProfile />,
            },
        ]
    }
])
export default router;
