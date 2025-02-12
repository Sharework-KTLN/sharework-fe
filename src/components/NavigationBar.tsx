'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { Menu, Col, Row } from 'antd';
import useWindowWidth from '@/hooks/useWindowWidth';
import CustomButton from '@/components/CustomButton';
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';



type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Trang chủ',
        key: 'trangchu',
    },
    {
        label: 'Việc làm',
        key: 'vieclam',
    },
    {
        label: 'Quản lý hồ sơ',
        key: 'quanlyhoso',
    },
    {
        label: 'Công ty',
        key: 'congty',
    }
];


const NavigationBar: React.FC = () => {

    const [isLogin, setIsLogin] = useState(false);

    const windowWidth = useWindowWidth();
    const router = useRouter();

    const handleButtonLogin = () => {
        setIsLogin(true);
    };
    const handleButtonLogout = () => {
        setIsLogin(false);
        router.push('/auth/login');
    };

    return (
        <div>
            <Row
                wrap={false}
                style={{
                    // backgroundColor: 'red',
                    padding: '0 20px',  // Khoảng cách giữa Row và lề trái/phải của màn hình
                    margin: '0 auto',  // Căn giữa Row
                    maxWidth: windowWidth - (windowWidth * 0.01), // Chiều rộng tối đa của Row
                    width: '100%',  // Đảm bảo Row chiếm hết không gian của màn hình
                }}
            >
                <Col
                    xs={6} sm={6} md={4} lg={3}
                    style={{
                        minWidth: '50px',
                        padding: '0',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            borderBottom: '1px solid #f0f0f0',
                            borderRight: '1px solid #f0f0f0',
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 'bold',
                                color: 'blue',
                                // whiteSpace: 'nowrap',
                            }}
                            className="text-sm md:text-base lg:text-lg xl:text-xl"
                        >
                            Share Work
                        </span>
                    </div>
                </Col>
                <Col
                    xs={12} sm={12} md={12} lg={18}
                >
                    <div
                        style={{
                            height: 'auto',
                        }}
                    >
                        <Menu
                            theme="light"
                            mode="horizontal"
                            defaultSelectedKeys={['trangchu']}
                            items={items}
                            style={{}}
                        // hidden={windowWidth < 768}
                        />
                    </div>
                </Col>
                <Col
                    xs={6} sm={6} md={4} lg={3}
                    style={{
                        minWidth: '50px',
                        borderBottom: '1px solid #f0f0f0',
                        borderLeft: '1px solid #f0f0f0',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isLogin ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}
                            >
                                {/* UserMenu and NotificationMenu Dropdown */}
                                <NotificationDropdown />
                                <MessageDropdown />
                                <UserDropdown
                                    user={
                                        {
                                            id: '1',
                                            name: 'Nguyễn Văn A',
                                            email: 'hiep@gmail.com',
                                            candidateId: '123456'
                                        }
                                    }
                                    onLogout={handleButtonLogout}
                                />
                            </div>


                        ) : (
                            <CustomButton
                                text="Đăng nhập"
                                onClick={handleButtonLogin}
                                backgroundColor="blue"
                                hoverColor="darkblue"
                                textColor="white"
                                style={{
                                    fontWeight: 'bold'
                                }}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default NavigationBar;
