'use client';

import React, { useState, useCallback } from 'react';

import Link from 'next/link';
import { Input, Row, Col } from 'antd';
import CustomButton from '@/components/CustomButton';
import { GoogleOutlined } from '@ant-design/icons';

// Định nghĩa kiểu dữ liệu cho từng input field
interface Field {
    name: string;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type?: string;
}

// Định nghĩa kiểu dữ liệu cho props của AuthForm
interface AuthFormProps {
    title: string;
    subtitle: string;
    fields: Field[];
    buttonText: string;
    linkText?: string;
    linkHref?: string;
    onSubmit?: (data: Record<string, string>) => void;
    errors?: Record<string, string>;
}


const AuthForm: React.FC<AuthFormProps> = ({ title, subtitle, fields, buttonText, linkText, linkHref, onSubmit, errors }) => {

    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/auth/google";
    };

    // Phân biệt giữa input field và input password field
    const renderInputField = (field: Field) => {
        if (field.type === "password") {
            return (
                <>
                    <Input.Password
                        size="large"
                        placeholder={field.placeholder}
                        prefix={field.icon}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        status={errors?.[field.name] ? "error" : ""}
                    />
                    {errors?.[field.name] && <p style={{ color: "red" }}>{errors[field.name]}</p>}
                </>
            );
        } else {
            return (
                <>
                    <Input
                        size="large"
                        placeholder={field.placeholder}
                        prefix={field.icon}
                        type={field.type || "text"}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        status={errors?.[field.name] ? "error" : ""}
                    />
                    {errors?.[field.name] && <p style={{ color: "red" }}>{errors[field.name]}</p>}
                </>
            );
        }
    };

    // Xử lý render các Link cho các trang khác nhau
    const renderLinks = () => {
        if (buttonText !== "Gửi yêu cầu") {
            return (
                <Row style={{ marginTop: '2%' }}>
                    <Col offset={4} span={16}>
                        <p style={{ margin: 0, textAlign: 'center', fontWeight: '500' }}>
                            {buttonText === "Đăng nhập"
                                ? "Bạn chưa có tài khoản? "
                                : "Đã có tài khoản? "}
                            <Link href={buttonText === "Đăng nhập" ? "/auth/candidate/register" : "/auth/candidate/login"}>
                                {buttonText === "Đăng nhập" ? "Đăng ký ngay" : "Đăng nhập ngay"}
                            </Link>
                        </p>
                    </Col>
                </Row>
            );
        }
        return (
            <Row style={{ marginTop: "2%", display: "flex", justifyContent: "center", gap: "20px" }}>
                <Link href="/auth/login" style={{ fontWeight: "500" }}>Quay lại đăng nhập</Link>
                <Link href="/auth/register" style={{ fontWeight: "500" }}>Đăng ký tài khoản mới</Link>
            </Row>
        );
    };

    // Xử lý khi người dùng nhập dữ liệu
    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    }, []);

    // Xử lý khi nhấn nút Submit
    const handleSubmit = useCallback(() => {
        if (onSubmit) {
            onSubmit(formData);
        } else {
            console.log("No submit handler provided.");
        }
    }, [formData, onSubmit]);

    return (
        <div style={{ height: '100vh', display: 'flex' }}>
            <div style={{ width: '60%' }}>
                <Row style={{ marginTop: '10%' }}>
                    <Col span={20} offset={4}>
                        <h1 style={{ fontSize: 22, fontWeight: 'bold', color: 'blue' }}>{title}</h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: '1%' }}>
                    <Col span={20} offset={4}>
                        <h1 style={{ fontSize: 16, color: 'gray' }}>{subtitle}</h1>
                    </Col>
                </Row>

                {/* Input Fields */}
                {fields.map((field, index) => (
                    <Row key={index} style={{ marginTop: '1.5%' }}>
                        <Col offset={4}><p>{field.label}</p></Col>
                        <Col offset={4} span={16}>
                            {renderInputField(field)}
                        </Col>
                    </Row>
                ))}

                {/* Forgot Password */}
                {linkText && linkHref && (
                    <Row style={{ marginTop: '1.5%' }}>
                        <Col offset={4} span={16}>
                            <p style={{ margin: 0, textAlign: 'right', fontWeight: '500' }}>
                                <Link href={linkHref || "#"}>{linkText}</Link>
                            </p>
                        </Col>
                    </Row>
                )}

                {/* Submit Button */}
                <Row style={{ marginTop: '1.5%' }}>
                    <Col offset={4} span={16}>
                        <CustomButton
                            text={buttonText}
                            onClick={handleSubmit}
                            style={{
                                width: '100%', height: 40, borderRadius: 10, fontSize: '16px',
                            }}
                        />
                    </Col>
                </Row>

                {/* Link to other auth pages */}
                {renderLinks()}
                {buttonText === "Đăng nhập" && (
                    <>
                        <Row justify="center" style={{ marginTop: '1.5%' }}>
                            <Col>
                                <p style={{ fontWeight: '500', color: 'grey' }}>Hoặc đăng nhập bằng</p>
                            </Col>
                        </Row>
                        <Row justify="center" style={{ marginTop: '1.5%' }}>
                            <Col>
                                <button
                                    onClick={handleLogin}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        background: 'red',
                                        cursor: 'pointer',
                                        color: 'white',
                                    }}
                                >
                                    <GoogleOutlined style={{ fontSize: '24px', color: 'white' }} />
                                    Đăng nhập với Google
                                </button>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
            {/* Background Section */}
            <div
                style={{
                    width: '40%',
                    backgroundImage: `url(https://vinit.com.vn/wp-content/uploads/2020/05/tuyen-dung-300x225-1.jpg)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            />


        </div>
    );
};

export default AuthForm;