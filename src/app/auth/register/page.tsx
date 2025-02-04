'use client';

import React, { useCallback } from 'react';
import AuthForm from '@/components/AuthForm';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

export default function Register() {

    // Định nghĩa các giá trị cho form đăng ký
    const title = "Chào mừng bạn đến với Sharework";
    const subtitle = "Cùng xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng";
    const fields = [
        { name: "fullname", label: "Họ và tên:", placeholder: "Nhập họ tên", icon: <UserOutlined /> },
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> },
        { name: "password", label: "Mật khẩu:", placeholder: "Mật khẩu", icon: <LockOutlined />, type: "password" },
        { name: "confirm-password", label: "Xác nhận mật khẩu:", placeholder: "Nhập lại mật khẩu", icon: <LockOutlined />, type: "password" }
    ];
    const buttonText = "Đăng ký";

    // Sử dụng useCallback để tránh tạo lại handleRegister mỗi lần render
    const handleRegister = useCallback((formData: Record<string, string>) => {
        console.log("Dữ liệu đăng ký:", formData);
        // Gọi API đăng ký tại đây
    }, []);
    return (
        <AuthForm
            title={title}
            subtitle={subtitle}
            fields={fields}
            buttonText={buttonText}
            onSubmit={handleRegister}
        />
    );
}

