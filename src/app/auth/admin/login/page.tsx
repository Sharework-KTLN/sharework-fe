'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Form, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '@/redux/slice/adminSlice';
import { AppDispatch } from '@/redux/store';

const AdminLoginPage = () => {

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [user, setUser] = useState<JwtPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, []);

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (!response.ok) {
                messageApi.error(data.email || data.password || "Đăng nhập thất bại!");
                setLoading(false);
                return;
            }

            if (data.user.role !== 'admin') {
                messageApi.error("Bạn không có quyền truy cập vào trang admin!");
                setLoading(false);
                return;
            }

            localStorage.setItem("adminToken", data.token);

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
            dispatch(loginAdmin({
                id: userData.id,
                full_name: userData.full_name,
                email: userData.email,
                profile_image: userData.profile_image || "",
                token: data.token,
                role: userData.role,
                password: "",  // Thêm giá trị mặc định cho password
                file_url: userData.file_url || ""  // Thêm file_url (hoặc giá trị mặc định nếu không có)
            }));

            messageApi.success("Đăng nhập thành công!");
            router.push("/admin");
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            messageApi.error("Lỗi máy chủ, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex items-center w-full justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <Spin spinning={loading}>
                    <Card className="w-full max-w-xl p-10 shadow-2xl rounded-3xl bg-white">
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Đăng Nhập</h2>
                        <Form layout="vertical" onFinish={handleLogin}>
                            <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <CustomButton
                                    text="Đăng Nhập"
                                    onClick={() => { }}
                                    backgroundColor="#4F46E5"
                                    hoverColor="#4338CA"
                                    textColor="white"
                                    style={{ width: '100%', padding: '12px', fontSize: '18px', fontWeight: 'bold' }}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </Spin>
            </div>

        </>
    );
};

export default AdminLoginPage;
