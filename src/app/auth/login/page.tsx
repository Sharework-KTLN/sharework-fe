'use client';

import React, { useCallback, useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [user, setUser] = useState<JwtPayload | null>(null);
    // Kiểm tra nếu có token thì decode lấy user
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, []);

    const handleLogin = useCallback(async (formData: Record<string, string>) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors(data);
                return;
            }

            // Lưu token vào localStorage
            localStorage.setItem("token", data.token);

            // Decode token để lấy thông tin user
            const decodedUser = jwtDecode<JwtPayload>(data.token);
            setUser(decodedUser);

            // Cập nhật UI bằng cách refresh router
            router.refresh();

            messageApi.success("Đăng nhập thành công!", 2, () => {
                router.push("/");
            });
        } catch (error) {
            messageApi.error("Lỗi đăng nhập, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }, [router]);

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

    return (
        <>
            {contextHolder}
            <Spin spinning={loading}>
                <AuthForm
                    title={title}
                    subtitle={subtitle}
                    fields={fields}
                    buttonText={buttonText}
                    linkText={linkText}
                    linkHref={linkHref}
                    onSubmit={handleLogin}
                />
            </Spin>
        </>

    );
}