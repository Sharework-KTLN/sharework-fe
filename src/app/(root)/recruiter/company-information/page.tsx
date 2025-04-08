'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Form, Input, message } from 'antd';
import CustomButton from '@/components/CustomButton';  // Nếu bạn vẫn muốn dùng CustomButton
import { Company } from '@/types/company';
import { address } from 'framer-motion/client';
import { PhoneFilled } from '@ant-design/icons';

const CompanyInformationPage = () => {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const user = useSelector((state: RootState) => state.user);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);

    // Gọi API để lấy thông tin công ty ngay khi component được render
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const companyRes = await fetch(`http://localhost:8080/companies/recruiter/${user.id}`);

                if (!companyRes.ok) {
                    throw new Error("Không tìm thấy công ty của bạn!");
                }

                const companyData = await companyRes.json();
                console.log("Company data:", companyData);
                form.setFieldsValue({
                    name: companyData.name,
                    address: companyData.address,
                    phone: companyData.phone,
                    email: companyData.email,
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu công ty:", error);
            }
        };

        if (user?.id) {
            fetchCompany();
        }
    }, [user?.id, form]);

    // Hàm xử lý khi nhấn nút cập nhật
    const handleUpdateButtonClick = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };
    // Hàm xử lý khi gửi form cập nhật
    const onFinish = async (values: Record<string, unknown>) => {
        try {
            setLoading(true);
            console.log('Received values of form: ', values);

            messageApi.success('Cập nhật thông tin công ty thành công!');

            // if (response.ok) {
            //     messageApi.success('Cập nhật thông tin công ty thành công!');
            // } else {
            //     messageApi.error('Cập nhật thông tin công ty thất bại!');
            // }
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi cập nhật thông tin công ty.');
        } finally {
            setLoading(false);
        }
    };

    // Chỉ hiển thị form khi có dữ liệu công ty
    return (
        <div
            className="max-w-7xl mx-auto mt-10 p-8 border border-gray-300 rounded-xl shadow-lg"
        >
            {contextHolder}
            <h2>Chỉnh sửa thông tin công ty</h2>
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Tên công ty"
                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                >
                    <Input placeholder="Nhập tên công ty" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ công ty"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ công ty!' }]}
                >
                    <Input placeholder="Nhập địa chỉ công ty" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="Nhập số điện thoại công ty" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                >
                    <Input placeholder="Nhập email công ty" />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end">
                        <CustomButton
                            onClick={handleUpdateButtonClick}
                            text="Cập nhật"
                            backgroundColor="#AF40FF"
                            hoverColor="#5B42F3"
                            textColor="white"
                            style={{
                                width: '150px',
                                fontWeight: '900px',
                                fontFamily: 'Arial, sans-serif',
                                borderRadius: '6px',
                                border: 'none',
                                padding: '10px 20px',
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CompanyInformationPage;
