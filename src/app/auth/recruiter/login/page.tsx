'use client';

import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import AuthFormRecruiter from '@/components/AuthFormRecruiter';
import { message, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { loginRecruiter } from '@/redux/slice/recruiterSlice';
import { AppDispatch } from '@/redux/store';

const RecuiterLogin = () => {

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [user, setUser] = useState<JwtPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("recruiterToken");
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, []);

    // Định nghĩa các dữ liệu cần thiết cho form đăng nhập
    const title = "Chào mừng bạn đã quay trở lại";
    const subtitle = "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel";
    const fields = [
        { name: "email", label: "Email:", placeholder: "Email", icon: <MailOutlined /> },
        { name: "password", label: "Mật khẩu:", placeholder: "Mật khẩu", icon: <LockOutlined />, type: "password" }
    ];
    const buttonText = "Đăng nhập";
    const linkText = "Quên mật khẩu";
    const linkHref = "/auth/recruiter/forgot-password";

    // Hàm xử lý khi người dùng ấn nút đăng nhập
    const handleLogin = useCallback(async (formData: Record<string, string>) => {
        console.log("Đăng nhập với dữ liệu:", formData);
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                alert("Đăng nhập thất bại: " + data.message);
                setLoading(false);
                return;
            }

            // 🟢 Lưu token vào localStorage
            localStorage.setItem("recruiterToken", data.token);

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
                setLoading(false);
                return;
            }

            // 🟢 Cập nhật Redux với thông tin user
            dispatch(loginRecruiter({
                id: userData.id,
                full_name: userData.full_name,
                email: userData.email,
                profile_image: userData.profile_image || "",
                token: data.token,
                role: userData.role,
                password: "",  // Thêm giá trị mặc định cho password
                file_url: userData.file_url || ""  // Thêm file_url (hoặc giá trị mặc định nếu không có)
            }));
            // console.log('userData', userData);
            // setUser(userData);

            messageApi.success("Đăng nhập thành công!", 1, () => {
                router.push("/recruiter");
            });
        } catch (error) {
            console.log("Lỗi đăng nhập:", error);
            messageApi.error("Lỗi đăng nhập, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }, [dispatch, messageApi, router]);
    return (
        <>
            {contextHolder}
            <Spin spinning={loading}>
                <AuthFormRecruiter
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
};

export default RecuiterLogin;
