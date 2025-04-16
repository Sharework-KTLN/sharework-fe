'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar = () => {

    const router = useRouter();
    const items: MenuItem[] = [
        {
            key: '1',
            icon: <Image src="/assets/images/home.png" alt="Trang chủ" width={30} height={30} />,
            label: <span
                className="text-sm font-semibold text-gray-800 font-sans"
            >
                Trang chủ
            </span>, // Chỉnh style chữ ở đây
        },
        {
            key: '2',
            icon: <Image src="/assets/images/user.png" alt="Quản lý người dùng" width={25} height={25} />,
            label: <span className="text-sm font-semibold text-gray-800 font-sans">Quản lý người dùng</span>,
        },
        {
            key: '3',
            icon: <Image src="/assets/images/post.png" alt="Quản lý bài đăng" width={25} height={25} />,
            label: <span
                className="text-sm font-semibold text-gray-800 font-sans"
                onClick={() => router.push('/admin/posts')}
            >
                Quản lý bài đăng
            </span>,
            onClick: () => router.push('/admin/posts')
        },
        {
            key: '4',
            icon: <Image src="/assets/images/company.png" alt="Quản lý công ty" width={25} height={25} />,
            label: <span className="text-sm font-semibold text-gray-800 font-sans">Quản lý công ty</span>,
        },
        {
            key: '5',
            icon: <Image src="/assets/images/settings.png" alt="Cài đặt" width={25} height={25} />,
            label: <span className="text-sm font-semibold text-gray-800 font-sans">Cài đặt</span>,
        }
    ];


    return (
        <div className="w-80 bg-white-800 text-white h-full flex flex-col p-4 ">
            {/* Image and Title */}
            <div className="flex items-center mb-6">
                <Image
                    src="/assets/images/logo.png"
                    alt="my-logo"
                    width={40}  // Adjusted size
                    height={40}  // Adjusted size
                />
                <h2 className="text-xl font-bold ml-4 text-orange-600">ShareWork</h2>
            </div>

            {/* Menu */}
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                className="custom-menu"
                mode="inline"
                theme="light"
                items={items}
                inlineCollapsed={false}
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                }}
            />
        </div>
    );
};

export default Sidebar;
