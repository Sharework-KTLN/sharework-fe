'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginAdmin, logoutAdmin } from '@/redux/slice/adminSlice';

const Header = () => {
    const user = useSelector((state: RootState) => state.admin);
    const dispatch = useDispatch<AppDispatch>();

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

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <div>{user.full_name}</div>
        </header>
    );
};

export default Header;
