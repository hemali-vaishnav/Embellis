
import React from 'react'
import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';
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
