'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useState, useEffect } from 'react';
import { Menu, Col, Row } from 'antd';
import type { MenuProps } from 'antd';
import useWindowWidth from '@/hooks/useWindowWidth';
import CustomButton from './CustomButton';
import RecruiterDropdown from './RecruiterDropdown';
import RecruiterMessageDropdown from './RecruiterMessageDropdown';
import NotificationDropdown from './NotificationDropdown';
import { loginRecruiter, logoutRecruiter } from '@/redux/slice/recruiterSlice';

type MenuItem = Required<MenuProps>['items'][number];

const RecruiterBar: React.FC = () => {


    const windowWidth = useWindowWidth();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // 🟢 Lấy thông tin user từ Redux store
    const user = useSelector((state: RootState) => state.recruiter);

    useEffect(() => {
        // Kiểm tra token trong localStorage khi trang được load
        const savedToken = localStorage.getItem("recruiterToken");
        if (savedToken && !user.id) {
            // Gọi API để lấy thông tin người dùng và cập nhật Redux
            const fetchUser = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                        headers: { "Authorization": `Bearer ${savedToken}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        dispatch(loginRecruiter({ ...data, token: savedToken })); // Cập nhật Redux
                    } else {
                        localStorage.removeItem("recruiterToken");
                        dispatch(logoutRecruiter());
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy user:", error);
                    localStorage.removeItem("recruiterToken");
                    dispatch(logoutRecruiter());
                }
            };
            fetchUser();
        }
    }, [dispatch, user.id]);

    const menuItems: MenuItem[] = [
        {
            label: (
                <div
                    onClick={() => router.push('/recruiter')}
                    style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                >
                    Bảng tin
                </div>
            ),
            key: 'bangtin',
        },
        {
            label: (
                <div
                    style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                >
                    Đăng tin
                </div>
            ),
            key: 'dangtin',
            children: [ // 🟢 Thêm submenu
                {
                    label: (
                        <div
                            onClick={() => router.push('/recruiter/postjob')}
                            style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                        >
                            Đăng tin tuyển dụng
                        </div>
                    ),
                    key: 'dangtin-tuyendung',
                },
                {
                    label: (
                        <div
                            onClick={() => router.push('/recruiter/manage-jobs')}
                            style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                        >
                            Quản lý bài đăng
                        </div>
                    ),
                    key: 'quanly-baidang',
                }
            ]
        },
        {
            label: (
                <div
                    // onClick={() => router.push('/recruiter/manage-jobs')}
                    style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                >
                    Công ty
                </div>
            ),
            key: 'congty',
            children: [
                {
                    label: (
                        <div
                            onClick={() => router.push('/recruiter/company-information')}
                            style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                        >
                            Thông tin công ty
                        </div>
                    ),
                    key: 'thongtin-congty',
                }
            ]
        },
        {
            label: (
                <div
                    onClick={() => router.push('/recruiter/find-candidate')}
                    style={{ fontSize: '16px', transition: 'color 0.3s ease' }}  // Thêm transition để hiệu ứng mượt mà
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1677FF'}  // Màu khi hover
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'black'}  // Màu trở lại khi không hover
                >
                    Tìm CV
                </div>
            ),
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
        localStorage.removeItem("recruiterToken"); // Xóa token khỏi localStorage
        // setUser(null); // Reset state user
        dispatch(logoutRecruiter());
        router.push("/auth/recruiter/login"); // Chuyển hướng về trang đăng nhập
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
                            items={menuItems}

                            style={{
                                borderBottom: 'none',
                                fontFamily: 'Arial, sans-serif', // Chỉnh font chữ cho menu
                            }}
                        />
                    </div>
                </Col>
                <Col
                    xs={6} sm={6} md={4} lg={5}
                    style={{
                        minWidth: '50px',
                        height: '50px',
                    }}
                >
                    <div
                        style={{
                            height: '%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {user.id !== null ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    marginTop: '5px'
                                }}
                            >

                                <NotificationDropdown />
                                <RecruiterMessageDropdown />
                                <RecruiterDropdown
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
                                    gap: 16,
                                    marginTop: '5px'
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
                                        fontSize: 14,
                                        height: 40,
                                        width: 120,
                                        border: '1px solid orange',
                                        padding: '0 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                                <CustomButton
                                    text="Đăng tin ngay"
                                    onClick={handleButtonPostJob}
                                    backgroundColor="blue"
                                    hoverColor="darkblue"
                                    textColor="white"
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        height: 40,
                                        width: 120,
                                        border: '1px solid orange',
                                        padding: '0 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
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
