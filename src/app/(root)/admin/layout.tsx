'use client';

import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Nội dung chính */}
            <div className="flex flex-col flex-1">
                <Header />
                {/* <main className="flex-1 p-6">{children}</main> */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
