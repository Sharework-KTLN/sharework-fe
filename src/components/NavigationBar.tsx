'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';
import { Menu, Col, Row } from 'antd';
import useWindowWidth from '@/hooks/useWindowWidth';
import CustomButton from '@/components/CustomButton';
import { useEffect } from 'react';
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/slice/userSlice';

type MenuItem = Required<MenuProps>['items'][number];

const NavigationBar: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const windowWidth = useWindowWidth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const user = useSelector((state: RootState) => state.user);

    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    // Định nghĩa mapping giữa đường dẫn và key
    const routeMap: Record<string, string> = {
        '/candidate/work': 'vieclam',
        '/candidate/profileManagement': 'quanlyhoso',
        '/candidate/infoBusiness': 'congty',
        '/candidate/CVManagement': 'quanlycv',
    };
    // Xác định mục nào đang được chọn
const matchedRoute = Object.keys(routeMap).find((route) => pathname.startsWith(route));
const selectedKey = matchedRoute ? routeMap[matchedRoute] : 'trangchu';

    const items: MenuItem[] = [
        { label: 'Trang chủ', key: 'trangchu', onClick: () => router.push('/') },
        {
            label: 'Việc làm',
            key: 'vieclam',

            children: [
                { label: 'Việc đã ứng tuyển', key: 'vieclamdaungtuyen', onClick: () => router.push('/candidate/work/applied') },
                { label: 'Việc yêu thích', key: 'vieclamyeuthich', onClick: () => router.push('/candidate/work/favorites') },
            ],
        },
        { label: 'Quản lí hồ sơ', key: 'quanlyhoso', onClick: () => router.push('/candidate/profileManagement') },
        { label: 'Quản lí CV', key: 'quanlycv', onClick: () => router.push('/candidate/CVManagement') },
        { label: 'Công ty', key: 'congty', onClick: () => router.push('/candidate/infoBusiness') },
    ];

    useEffect(() => {
        const token = searchParams.get('token');
        console.log("token:", token);

        if (token) {
            localStorage.setItem('userToken', token); // Lưu token vào localStorage
            router.replace('/'); // Xóa token khỏi URL
        }
    }, [searchParams, router]);

    useEffect(() => {
        const fetchUser = async () => {
            const savedToken = localStorage.getItem("userToken");
            if (!savedToken) {
                dispatch(logout()); // Xóa Redux nếu không có token
                return;
            }
            try {
                const res = await fetch("http://localhost:8080/auth/me", {
                    headers: { "Authorization": `Bearer ${savedToken}` },
                });

                const data = await res.json();
                if (res.ok) {
                    dispatch(login({ ...data, token: savedToken })); // Cập nhật Redux
                } else {
                    localStorage.removeItem("userToken");
                    dispatch(logout());
                }
            } catch (error) {
                console.error("Lỗi khi lấy user:", error);
                localStorage.removeItem("userToken");
                dispatch(logout());
            }
        };

        if (!user.id) { // Chỉ gọi API nếu Redux chưa có user
            fetchUser();
        }
    }, [dispatch, user.id]);

    const handleButtonLogin = () => {
        router.push('/auth/candidate/login');
    };
    const handleButtonRegister = () => {
        router.push('/auth/candidate/register');
    };
    const handleButtonPostJob = () => {
        router.push('/recruiter');
    };
    const handleButtonLogout = async () => {
        localStorage.removeItem("userToken"); // Xóa token khỏi localStorage
        // setUser(null); // Reset state user
        dispatch(logout());
        router.push("/auth/candidate/login"); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div className='navbar'>
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
                    xs={6} sm={6} md={4} lg={4}
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
                    xs={12} sm={12} md={12} lg={12}
                >
                    <div
                        style={{
                            height: 'auto',
                        }}
                    >
                        <Menu
                            theme="light"
                            mode="horizontal"
                            selectedKeys={[selectedKey]}
                            // defaultSelectedKeys={['trangchu']}
                            items={items}
                            style={{ borderBottom: 'none' }}
                            className="custom-menu"
                        // hidden={windowWidth < 768}
                        />
                    </div>
                </Col>
                <Col
                    xs={6} sm={6} md={4} lg={8}
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
                        {user.id !== null ? (
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
                                        fontSize: 14,
                                        height: 40,
                                        width: 120,
                                        border: "1px solid orange",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                                <CustomButton
                                    text="Đăng ký"
                                    onClick={handleButtonRegister}
                                    backgroundColor="blue"
                                    hoverColor="darkblue"
                                    textColor="white"
                                    style={{
                                        fontWeight: 'bold',
                                        height: 40,
                                        width: 120,
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                />
                                <CustomButton
                                    text="Đăng tin tuyển dụng"
                                    onClick={handleButtonPostJob}
                                    backgroundColor="grey"
                                    hoverColor="darkblue"
                                    textColor="white"
                                    style={{
                                        fontWeight: 'bold',
                                        height: 40,
                                        width: 180,
                                        fontSize: 14,
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
            <style jsx global>{`
            /* Đổi màu các mục khi hover, chọn hoặc active */
            .custom-menu .ant-menu-item:hover, 
            .custom-menu .ant-menu-item-active,
            .custom-menu .ant-menu-item-selected,
            .custom-menu .ant-menu-submenu-title:hover,
            .custom-menu .ant-menu-submenu-title.ant-menu-submenu-title-selected {
                color: #1677FF !important;
                font-weight: bold;
            }

            /* Đảm bảo background trong suốt khi mục được chọn hoặc active */
            .custom-menu .ant-menu-item-selected,
            .custom-menu .ant-menu-item-active {
                background-color: transparent !important;
            }

            /* Đặt font size và font weight cho tất cả các mục */
            .custom-menu .ant-menu-item,
            .custom-menu .ant-menu-submenu-title {
                font-size: 14px;
                font-weight: bold;
            }

            /* Đổi màu border-bottom gạch chân khi hover hoặc chọn */
            .custom-menu .ant-menu-item-selected::after,
            .custom-menu .ant-menu-item:hover::after,
            .custom-menu .ant-menu-submenu-title:hover::after,
            .custom-menu .ant-menu-submenu-title.ant-menu-submenu-title-selected::after {
                border-bottom: 2px solid #1677FF !important;
            }

            /* Style cho navbar */
            .navbar {
                position: sticky;
                top: 0;
                width: 100%;
                z-index: 1000;
                background: white;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
            `}</style>
        </div>
    );
};

export default NavigationBar;
