'use client';

import React from 'react';
import Link from 'next/link';
import CustomButton from '@/components/CustomButton';
import { Input, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const backgroundImage = 'https://vinit.com.vn/wp-content/uploads/2020/05/tuyen-dung-300x225-1.jpg';



export default function Login() {


    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
            }}
        >
            <div
                style={{
                    width: '60%',
                }}
            >
                <Row style={{ marginTop: '10%' }}>
                    <Col span={20} offset={4}>
                        <h1 style={{ fontSize: 22, fontWeight: 'bold', color: 'blue' }}>
                            Chào mừng bạn đã quay trở lại
                        </h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: '1%' }}>
                    <Col span={20} offset={4}>
                        <h1 style={{ fontSize: 16, color: 'gray' }}>
                            Cùng xây dựng hồ sơ nổi bật và nhận được cơ hội sự nghiệp lý tưởng
                        </h1>
                    </Col>
                </Row>
                <Row style={{ marginTop: '1.5%' }}>
                    <Col offset={4}>
                        <p>Email:</p>
                    </Col>
                </Row>
                <Row>
                    <Col offset={4} span={16}>
                        <Input size='large' placeholder='Email' prefix={<MailOutlined />} />
                    </Col>
                </Row>
                <Row style={{ marginTop: '1.5%' }}>
                    <Col offset={4}>
                        <p>Password:</p>
                    </Col>
                </Row>
                <Row>
                    <Col offset={4} span={16}>
                        <Input.Password size='large' placeholder='Password' prefix={<LockOutlined />} />
                    </Col>
                </Row>
                <Row style={{ marginTop: '1.5%' }}>
                    <Col offset={4} span={16}>
                        <p
                            style={{
                                margin: 0,
                                textAlign: 'right',
                                fontWeight: '500'
                            }}
                        >
                            <Link href="/">Quên mật khẩu</Link>
                        </p>
                    </Col>
                </Row>
                <Row style={{ marginTop: '1.5%' }}>
                    <Col offset={4} span={16}>
                        <CustomButton
                            text='Đăng nhập'
                            onClick={() => console.log('click')}
                            style={{
                                width: '100%',
                                height: 40,
                                borderRadius: 10,
                                fontSize: '16px',
                            }}
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '2%' }}>
                    <Col offset={4} span={16}>
                        <p
                            style={{
                                margin: 0,
                                textAlign: 'center',
                                fontWeight: '500'
                            }}
                        >
                            Bạn chưa có tài khoản?{' '} <Link href='/auth/register'>Đăng ký ngay</Link>
                        </p>
                    </Col>
                </Row>
            </div>
            <div
                style={{
                    width: '40%',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
            </div>
        </div>
    );
}