'use client';

import React, { useCallback } from 'react';
import AuthForm from '@/components/AuthForm';
import { MailOutlined } from '@ant-design/icons';

export default function ForgotPassword() {

    // Định nghĩa các giá trị cho form quên mật khẩu
    const title = "Quên mật khẩu";
    const subtitle = "Nhập email của bạn để đặt lại mật khẩu.";
    const fields = [
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> }
    ];
    const buttonText = "Gửi yêu cầu";

    // Sử dụng useCallback để tránh tạo lại handleForgotPassword mỗi lần render
    const handleForgotPassword = useCallback((formData: Record<string, string>) => {
        console.log("Email để đặt lại mật khẩu:", formData);
        // Gọi API quên mật khẩu tại đây
    }, []);

    return (
        <AuthForm
            title={title}
            subtitle={subtitle}
            fields={fields}
            buttonText={buttonText}
            onSubmit={handleForgotPassword}
        />
    );
}