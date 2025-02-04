'use client';

import React, { useCallback } from 'react';
import AuthForm from '@/components/AuthForm';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

export default function Login() {

    // Định nghĩa các dữ liệu cần thiết cho form đăng nhập
    const title = "Chào mừng bạn đã quay trở lại";
    const subtitle = "Cùng xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng";
    const fields = [
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> },
        { name: "password", label: "Mật khẩu:", placeholder: "Mật khẩu", icon: <LockOutlined />, type: "password" }
    ];
    const buttonText = "Đăng nhập";
    const linkText = "Quên mật khẩu";
    const linkHref = "/auth/forgot-password";

    // Sử dụng useCallback để tránh tạo lại handleLogin mỗi lần render
    const handleLogin = useCallback((formData: Record<string, string>) => {
        console.log("Dữ liệu đăng nhập:", formData);
        // Gọi API đăng nhập tại đây
    }, []);

    return (
        <AuthForm
            title={title}
            subtitle={subtitle}
            fields={fields}
            buttonText={buttonText}
            linkText={linkText}
            linkHref={linkHref}
            onSubmit={handleLogin}
        />
    );
}