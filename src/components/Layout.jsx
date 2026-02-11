// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F9FF' }}>
            <Navbar />
            <main className="flex-grow container mx-auto py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;