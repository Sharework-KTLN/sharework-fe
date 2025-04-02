'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/userSlice';

const Header = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Kiểm tra token trong localStorage khi trang được load
        const savedToken = localStorage.getItem("token");
        if (savedToken && !user.id) {
            // Gọi API để lấy thông tin người dùng và cập nhật Redux
            const fetchUser = async () => {
                try {
                    const res = await fetch("http://localhost:8080/auth/me", {
                        headers: { "Authorization": `Bearer ${savedToken}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        dispatch(login({ ...data, token: savedToken })); // Cập nhật Redux
                    } else {
                        localStorage.removeItem("token");
                        dispatch(logout());
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy user:", error);
                    localStorage.removeItem("token");
                    dispatch(logout());
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
