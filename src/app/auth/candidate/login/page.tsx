'use client';

import React, { useCallback, useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/userSlice';
import { AppDispatch } from '@/redux/store';

export default function Login() {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
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

    // const handleLogin = useCallback(async (formData: Record<string, string>) => {
    //     setLoading(true);
    //     setErrors({});
    //     try {
    //         const response = await fetch("http://localhost:8080/auth/login", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(formData),
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             setErrors(data);
    //             return;
    //         }
    //         // Lưu token vào localStorage
    //         localStorage.setItem("token", data.token);

    //         // Decode token để lấy thông tin user
    //         // const decodedUser = jwtDecode<JwtPayload>(data.token);
    //         const decodedUser = jwtDecode<{ id: number, full_name: string, email: string, avatar: string }>(data.token);
    //         // 👉 Cập nhật Redux store
    //         dispatch(login({
    //             id: decodedUser.id,
    //             full_name: decodedUser.full_name,
    //             email: decodedUser.email,
    //             avatar: decodedUser.avatar,
    //             token: data.token
    //         }));

    //         // setUser(decodedUser);
    //         console.log("user: ", user);
    //         // Cập nhật UI bằng cách refresh router
    //         // router.refresh();

    //         messageApi.success("Đăng nhập thành công!", 2, () => {
    //             router.push("/");
    //         });
    //     } catch (error) {
    //         messageApi.error("Lỗi đăng nhập, vui lòng thử lại!");
    //         console.error("Lỗi đăng nhập:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [router, messageApi, dispatch]);
    const handleLogin = useCallback(async (formData: Record<string, string>) => {
        setLoading(true);
        setErrors({});
        try {
            // 🟢 Gửi yêu cầu đăng nhập
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

            // 🟢 Lưu token vào localStorage
            localStorage.setItem("token", data.token);

            // 🟢 Gọi API lấy thông tin user từ CSDL
            const userResponse = await fetch("http://localhost:8080/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${data.token}`
                }
            });

            const userData = await userResponse.json();
            if (!userResponse.ok) {
                messageApi.error("Lỗi khi lấy thông tin người dùng");
                return;
            }

            // 🟢 Cập nhật Redux với thông tin user
            dispatch(login({ ...userData, token: data.token }));

            messageApi.success("Đăng nhập thành công!", 2, () => {
                router.push("/");
            });

        } catch (error) {
            messageApi.error("Lỗi đăng nhập, vui lòng thử lại!");
            console.error("Lỗi đăng nhập:", error);
        } finally {
            setLoading(false);
        }
    }, [router, messageApi, dispatch]);


    // Định nghĩa các dữ liệu cần thiết cho form đăng nhập
    const title = "Chào mừng bạn đã quay trở lại";
    const subtitle = "Cùng xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng";
    const fields = [
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> },
        { name: "password", label: "Mật khẩu:", placeholder: "Mật khẩu", icon: <LockOutlined />, type: "password" }
    ];
    const buttonText = "Đăng nhập";
    const linkText = "Quên mật khẩu";
    const linkHref = "/auth/candidate/forgot-password";

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
                    errors={errors}
                />
            </Spin>
        </>

    );
}