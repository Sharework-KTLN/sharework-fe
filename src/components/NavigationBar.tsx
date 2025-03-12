'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { MenuProps } from 'antd';
import { Menu, Col, Row } from 'antd';
import useWindowWidth from '@/hooks/useWindowWidth';
import CustomButton from '@/components/CustomButton';
import { useEffect, useState } from 'react';
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';

type MenuItem = Required<MenuProps>['items'][number];
type User = {
    id: string;
    full_name: string;
    email: string;
    candidateId: string;
    profile_image: string;
}

const NavigationBar: React.FC = () => {

    // const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const windowWidth = useWindowWidth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const items: MenuItem[] = [
        {
            label: (<div onClick={() => router.push('/')}>Trang chủ</div>),
            key: 'trangchu',
        },
        {
            label: (<div onClick={() => router.push('/candidate/work')}>Việc làm</div>),
            key: 'vieclam',
        },
        {
            label: (<div onClick={() => router.push('/candidate/profileManagement')}>Quản lí hồ sơ</div>),
            key: 'quanlyhoso',
        },
        {
            label: (<div onClick={() => router.push('/candidate/infoBusiness')}>Công ty</div>),
            key: 'congty',
        }
    ];

    useEffect(() => {
        const token = searchParams.get('token');
        console.log("token:", token);

        if (token) {
            localStorage.setItem('token', token); // Lưu token vào localStorage
            router.replace('/'); // Xóa token khỏi URL
        }
    }, [searchParams, router]);

    useEffect(() => {

        const fetchUser = async () => {
            const savedToken = localStorage.getItem("token");
            if (!savedToken) {
                setUser(null);
                return;
            }
            try {
                const res = await fetch("http://localhost:8080/auth/me", {
                    headers: { "Authorization": `Bearer ${savedToken}` },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data); // Lưu thông tin user vào state
                } else {
                    localStorage.removeItem("token"); // Xóa token nếu không hợp lệ
                    setUser(null);
                }
            } catch (error) {
                console.error("Lỗi khi lấy user:", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        };

        fetchUser();

    }, [router, searchParams]);
    useEffect(() => {
        console.log("user:", user);
    }, [user]);
    const handleButtonLogin = () => {
        router.push('/auth/login');
    };
    const handleButtonLogout = async () => {
        localStorage.removeItem("token"); // Xóa token khỏi localStorage
        setUser(null); // Reset state user
        router.push("/auth/login"); // Chuyển hướng về trang đăng nhập
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
                        onClick={() => router.push('/')}
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
                            // defaultSelectedKeys={['trangchu']}
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
                        {user ? (
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
