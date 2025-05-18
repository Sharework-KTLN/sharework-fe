'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Form, Input, message, Upload, Select, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

import { industries } from '@/constants/industries';
import CustomButton from '@/components/CustomButton';
import { Company } from '@/types/company';
import axios from 'axios';

const CompanyInformationPage = () => {
    const [form] = Form.useForm();
    const description = Form.useWatch('description', form);
    const specialize = Form.useWatch('specialize', form);
    const location = Form.useWatch('location', form);
    const logo = Form.useWatch('logo', form);
    const image_company = Form.useWatch('image_company', form);

    const [messageApi, contextHolder] = message.useMessage();
    const user = useSelector((state: RootState) => state.recruiter);

    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);

    const missingFields = company ? getMissingCompanyFields(company) : [];

    // Gọi API để lấy thông tin công ty ngay khi component được render
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const companyRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/recruiter/${user.id}`);

                if (!companyRes.ok) {
                    throw new Error("Không tìm thấy công ty của bạn!");
                }

                const companyData = await companyRes.json();
                setCompany(companyData);
                console.log("Company data:", companyData);

                //  Chuẩn hoá dữ liệu cho Upload component (fileList)
                const logoFile = companyData.logo
                    ? [{
                        uid: '-1',
                        name: 'logo.png',
                        status: 'done',
                        url: companyData.logo,
                    }]
                    : [];

                const imageCompanyFile = companyData.image_company
                    ? [{
                        uid: '-2',
                        name: 'image_company.png',
                        status: 'done',
                        url: companyData.image_company,
                    }]
                    : [];

                form.setFieldsValue({
                    name: companyData.name,
                    address: companyData.address,
                    phone: companyData.phone,
                    email: companyData.email,
                    specialize: companyData.specialize,
                    logo: logoFile,
                    image_company: imageCompanyFile,
                    description: companyData.description,
                    location: companyData.location,
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
    const onFinish = async (values: Record<string, unknown> & { logo?: UploadFile[]; image_company?: UploadFile[] }) => {
        try {
            setLoading(true);
            console.log('Received values of form: ', values);
            const formData = new FormData();
            formData.append('name', values.name as string);
            formData.append('address', values.address as string);
            formData.append('phone', values.phone as string);
            formData.append('email', values.email as string);
            formData.append('description', values.description as string);
            formData.append('specialize', values.specialize as string);
            formData.append('location', values.location as string);

            // Thêm logo (nếu là File)
            if (values.logo?.[0]?.originFileObj) {
                formData.append('logo', values.logo[0].originFileObj);
            }

            // Thêm ảnh đại diện công ty
            if (values.image_company?.[0]?.originFileObj) {
                formData.append('image_company', values.image_company[0].originFileObj);
            }

            // Gọi API gửi formData
            const companyId = company?.id; // ID công ty bạn cần cập nhật
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            messageApi.success('Cập nhật thông tin công ty thành công!');
            console.log('API response:', response.data);

        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi cập nhật thông tin công ty.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                    <Spin size="large" />
                </div>
            )}

            <div className="max-w-7xl mx-auto mt-10 p-8 border border-gray-300 rounded-xl shadow-lg">


                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Chỉnh sửa thông tin công ty
                </h2>

                {missingFields.length > 0 && (
                    <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p className="font-semibold mb-2">
                            Vui lòng cập nhật đầy đủ thông tin công ty trước khi đăng bài tuyển dụng.
                        </p>
                    </div>
                )}

                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên công ty"
                    >
                        <Input placeholder="Nhập tên công ty" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ công ty"
                    >
                        <Input placeholder="Nhập địa chỉ công ty" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                    >
                        <Input placeholder="Nhập số điện thoại công ty" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input placeholder="Nhập email công ty" />
                    </Form.Item>

                    <Form.Item
                        name="logo"
                        label="Logo công ty"
                        validateStatus={isEmpty(logo) ? 'warning' : undefined}
                        help={isEmpty(logo) ? 'Vui lòng thêm logo công ty!' : undefined}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            name="logo"
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            style={{
                                border: '2px dashed #1890ff',
                                padding: '10px',
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{ textAlign: 'center', color: '#1890ff' }}>
                                <UploadOutlined style={{ fontSize: '24px', marginBottom: 8 }} />
                                <div>Chọn logo</div>
                            </div>
                        </Upload>

                    </Form.Item>

                    <Form.Item
                        name="image_company"
                        label="Ảnh đại diện công ty"
                        validateStatus={isEmpty(image_company) ? 'warning' : undefined}
                        help={isEmpty(image_company) ? 'Vui lòng thêm hình ảnh công ty!' : undefined}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            name="image_company"
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            style={{
                                border: '2px dashed #1890ff',
                                padding: '10px',
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{ textAlign: 'center', color: '#1890ff' }}>
                                <UploadOutlined style={{ fontSize: '24px', marginBottom: 8 }} />
                                <div>Chọn ảnh đại diện</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả công ty"
                        validateStatus={isEmpty(description) ? 'warning' : undefined}
                        help={isEmpty(description) ? 'Vui lòng thêm mô tả công ty.' : undefined}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn về công ty của bạn" />
                    </Form.Item>

                    <Form.Item
                        name="specialize"
                        label="Chuyên môn công ty"
                        validateStatus={isEmpty(specialize) ? 'warning' : undefined}
                        help={isEmpty(specialize) ? 'Vui lòng thêm chuyên môn công ty!' : undefined}
                    >
                        <Select
                            placeholder="Chọn chuyên môn công ty"
                            options={industries}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Khu vực hoạt động"
                        validateStatus={isEmpty(location) ? 'warning' : undefined}
                        help={isEmpty(location) ? 'Vui lòng thêm khu vực hoạt động của công ty!' : undefined}
                    >
                        <Input placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội, Đà Nẵng..." />
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

        </>
    );
};

// ====== Các hàm tiện ích ======

const isEmpty = (value: unknown) => {
    return value === undefined || value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);
};



const fieldLabels: Record<string, string> = {
    name: 'Tên công ty',
    address: 'Địa chỉ',
    phone: 'Số điện thoại',
    email: 'Email',
    logo: 'Logo công ty',
    image_company: 'Ảnh văn phòng',
    specialize: 'Chuyên môn',
    description: 'Mô tả công ty',
    location: 'Khu vực hoạt động',
};

const getMissingCompanyFields = (company: Company): string[] => {
    const requiredFields = Object.keys(fieldLabels);
    return requiredFields.filter((field) => {
        const value = company[field as keyof Company];
        return !value || String(value).trim() === '';
    });
};

export default CompanyInformationPage;
