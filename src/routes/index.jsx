import { createBrowserRouter, Navigate } from "react-router";
import DefaultLayout from "./DefaultLayout";
import Home from "../User/pages/Home/Home";
import Cart from "../User/common/Cart/Cart";
import Favorite from "../User/common/Favorite/Favorite";
import Custom from "../User/pages/Custom/Custom";
import MenCollections from "../User/pages/MenCollections/MenCollections";
import WomenCollections from "../User/pages/WomenCollections/WomenCollections";
import UserProfile from "../User/pages/UserProfile/UserProfile";
import ProductDetails from "../User/pages/ProductDetails/ProductDetails";
import HandworkCollections from "../User/pages/HandworkCollections/HandworkCollections";
import AdminGuard from "../Admin/AdminGuard";
import AdminLayout from "../Admin/AdminLayout";
import UploadCatalog from "../Admin/pages/Catalog/UploadCatalog";
import Users from "../Admin/pages/Users/Users";
import CustomOrders from "../Admin/pages/CustomOrders/CustomOrders";

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
            {
                path: "/product/:id",
                element: <ProductDetails />,
            },
            {
                path: "/collections/handwork/:gender",
                element: <HandworkCollections />,
            },
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminGuard>
                <AdminLayout />
            </AdminGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="catalog" replace />,
            },
            {
                path: "catalog",
                element: <UploadCatalog />,
            },
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "custom-orders",
                element: <CustomOrders />,
            },
        ],
    },
])
export default router;
