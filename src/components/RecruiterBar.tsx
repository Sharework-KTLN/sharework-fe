'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useState } from 'react';
import { Menu, Col, Row } from 'antd';
import type { MenuProps } from 'antd';
import useWindowWidth from '@/hooks/useWindowWidth';
import CustomButton from './CustomButton';
import UserDropdown from './UserDropdown';
import MessageDropdown from './MessageDropdown';
import NotificationDropdown from './NotificationDropdown';
import { logout } from '@/redux/userSlice';

type MenuItem = Required<MenuProps>['items'][number];

const RecruiterBar: React.FC = () => {


    const windowWidth = useWindowWidth();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // 🟢 Lấy thông tin user từ Redux store
    const user = useSelector((state: RootState) => state.user);

    const menuItems: MenuItem[] = [
        {
            label: (<div onClick={() => router.push('/recruiter')}>Bảng tin</div>),
            key: 'bangtin',
        },
        {
            label: 'Đăng tin',
            key: 'dangtin',
            children: [ // 🟢 Thêm submenu
                {
                    label: (<div onClick={() => router.push('/recruiter/postjob')}>Đăng tin tuyển dụng</div>),
                    key: 'dangtin-tuyendung',
                },
                {
                    label: (<div onClick={() => router.push('/recruiter/manage-jobs')}>Quản lý bài đăng</div>),
                    key: 'quanly-baidang',
                }
            ]
        },
        {
            label: 'Tìm CV',
            key: 'timcv',
        }
    ];
    const [current, setCurrent] = useState('');
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleButtonLogin = () => {
        router.push('/auth/recruiter/login');
    };
    const handleButtonPostJob = () => {
        router.push('/auth/recruiter/register');
    };
    const handleButtonLogout = () => {
        localStorage.removeItem("token"); // Xóa token khỏi localStorage
        // setUser(null); // Reset state user
        dispatch(logout());
        router.push("/auth/candidate/login"); // Chuyển hướng về trang đăng nhập
    };
    return (
        <div

        >
            <Row
                wrap={false}
                style={{
                    padding: '0 20px',  // Khoảng cách giữa Row và lề trái/phải của màn hình
                    margin: '0 auto',  // Căn giữa Row
                    maxWidth: windowWidth - (windowWidth * 0.2), // Chiều rộng tối đa của Row
                    width: '100%',  // Đảm bảo Row chiếm hết không gian của màn hình
                }}
            >
                <Col
                    xs={6} sm={6} md={4} lg={4}
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
                                color: '#D4421E',
                                // whiteSpace: 'nowrap',
                            }}
                            className="text-sm md:text-base lg:text-lg xl:text-xl"
                        >
                            Share Work
                        </span>
                    </div>
                </Col>
                <Col
                    xs={12} sm={12} md={12} lg={13}
                >
                    <div
                        style={{
                            height: 'auto',
                        }}
                    >
                        <Menu
                            onClick={onClick}
                            theme="light"
                            mode="horizontal"
                            selectedKeys={[current]}
                            // defaultSelectedKeys={['trangchu']}
                            items={menuItems}
                            style={{ borderBottom: 'none' }}
                            className="custom-menu"
                        // hidden={windowWidth < 768}
                        />
                    </div>
                </Col>
                <Col
                    xs={6} sm={6} md={4} lg={5}
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
                        {user.id ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}
                            >

                                <NotificationDropdown />
                                <MessageDropdown />
                                <UserDropdown
                                    user={
                                        user
                                    }
                                    onLogout={handleButtonLogout}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}
                            >
                                <CustomButton
                                    text="Đăng nhập"
                                    onClick={handleButtonLogin}
                                    backgroundColor="white"
                                    hoverColor="darkblue"
                                    textColor="orange"
                                    style={{
                                        fontWeight: 'bold',
                                        border: '1px solid orange'
                                    }}
                                />
                                <CustomButton
                                    text="Đăng tin ngay"
                                    onClick={handleButtonPostJob}
                                    backgroundColor="blue"
                                    hoverColor="darkblue"
                                    textColor="white"
                                    style={{
                                        fontWeight: 'bold'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RecruiterBar;
