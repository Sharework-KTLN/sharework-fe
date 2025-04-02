'use client';

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white h-full flex flex-col p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav>
                <Link href="/admin">
                    <div className="p-2 hover:bg-gray-700 rounded">Dashboard</div>
                </Link>
                <Link href="/admin/users">
                    <div className="p-2 hover:bg-gray-700 rounded">Quản lý người dùng</div>
                </Link>
                <Link href="/admin/posts">
                    <div className="p-2 hover:bg-gray-700 rounded">Quản lý bài đăng</div>
                </Link>
                <Link href="/admin/companies">
                    <div className="p-2 hover:bg-gray-700 rounded">Quản lý công ty</div>
                </Link>
                <Link href="/admin/settings">
                    <div className="p-2 hover:bg-gray-700 rounded">Cài đặt</div>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
