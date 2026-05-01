
import React from 'react'
import Header from '../User/common/Header/Header';
import Footer from '../User/common/Footer/Footer';
import { Outlet } from 'react-router';

export default function DefaultLayout() {
    return (
        <div >
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
