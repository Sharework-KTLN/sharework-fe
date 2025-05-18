'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginAdmin, logoutAdmin } from '@/redux/slice/adminSlice';
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import CustomButton from '../../../../components/CustomButton';

const Header = () => {
    const user = useSelector((state: RootState) => state.admin);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra token trong localStorage khi trang được load
        const savedToken = localStorage.getItem("adminToken");
        if (savedToken && !user.id) {
            // Gọi API để lấy thông tin người dùng và cập nhật Redux
            const fetchUser = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                        headers: { "Authorization": `Bearer ${savedToken}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        dispatch(loginAdmin({ ...data, token: savedToken })); // Cập nhật Redux
                    } else {
                        localStorage.removeItem("adminToken");
                        dispatch(logoutAdmin());
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy user:", error);
                    localStorage.removeItem("adminToken");
                    dispatch(logoutAdmin());
                }
            };
            fetchUser();
        }
    }, [dispatch, user.id]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        dispatch(logoutAdmin());
        router.push("/auth/admin/login");
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <div className="flex items-center" onClick={handleLogout}>
                <span>{user.full_name}</span>
                <CustomButton
                        onClick={handleLogout}
                        backgroundColor="transparent"
                        hoverColor="#f0f0f0"
                        textColor="inherit"
                        style={{
                            padding: 4,
                            borderRadius: 6,
                            minWidth: 'auto',
                            lineHeight: 0,
                            border: 'none',
                        }}
                        text="" // Không hiện chữ nào, chỉ icon thôi
                        >
                        <LogoutOutlined style={{ fontSize: 18, color: 'inherit' }} />
                </CustomButton>
            </div>
            
        </header>
    );
};

export default Header;
