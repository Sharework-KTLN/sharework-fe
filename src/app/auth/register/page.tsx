'use client';

import React, { useCallback, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';

export default function Register() {

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Định nghĩa các giá trị cho form đăng ký
    const title = "Chào mừng bạn đến với Sharework";
    const subtitle = "Cùng xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng";
    const fields = [
        { name: "fullname", label: "Họ và tên:", placeholder: "Nhập họ tên", icon: <UserOutlined /> },
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> },
        { name: "password", label: "Mật khẩu:", placeholder: "Mật khẩu", icon: <LockOutlined />, type: "password" },
        { name: "confirmPassword", label: "Xác nhận mật khẩu:", placeholder: "Nhập lại mật khẩu", icon: <LockOutlined />, type: "password" }
    ];
    const buttonText = "Đăng ký";

    // Sử dụng useCallback để tránh tạo lại handleRegister mỗi lần render
    const handleRegister = useCallback(async (formData: Record<string, string>) => {

        setLoading(true);
        setErrors({});

        if (formData.password !== formData.confirmPassword) {
            setLoading(false);
            setErrors({ confirmPassword: "Mật khẩu không khớp" });
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setErrors(data);
            } else {
                messageApi.open({
                    type: 'success',
                    content: 'Đăng ký thành công!',
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
            });
            console.error('error: ', error);
        } finally {
            setLoading(false);
        }
    }, []);
    return (
        <>
            {contextHolder}
            <Spin spinning={loading}>
                <AuthForm
                    title={title}
                    subtitle={subtitle}
                    fields={fields}
                    buttonText={buttonText}
                    onSubmit={handleRegister}
                    errors={errors}
                />
            </Spin>
        </>


    );
}

