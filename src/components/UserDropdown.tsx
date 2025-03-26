import React, { useMemo } from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// Định nghĩa kiểu dữ liệu cho user
interface User {
    id: number | null;
    full_name: string;
    email: string;
    candidateId: string;
    profile_image: string;
    token: string | null;
    role: string;
}

interface UserDropdownProps {
    user: User;
    onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {

    const userMenu: MenuProps['items'] = useMemo(() => {
        const userInfo = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size="default" src={user.profile_image || undefined} icon={!user.profile_image && <UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', color: 'blue' }}>{user.full_name}</span>
                    <span style={{ fontSize: '12px', color: 'gray' }}>{user.role === 'recruiter' ? 'Mã ntd: ' : 'Mã ứng viên'}</span>
                    <span style={{ fontSize: '12px', color: 'gray' }}>{user.email}</span>
                </div>
            </div>
        );

        return [
            {
                label: userInfo,
                key: 'fullname',
                disabled: true
            },
            { type: 'divider' },
            { label: 'Cài đặt thông tin cá nhân', key: 'profile', icon: <EditOutlined /> },
            { label: 'Đổi mật khẩu', key: 'change-password', icon: <LockOutlined /> },
            { type: 'divider' },
            { label: <span style={{ color: 'red' }}>Đăng xuất</span>, key: 'logout', icon: <LogoutOutlined />, onClick: onLogout }
        ];
    }, [user, onLogout]);

    // Menu dropdown
    // const userMenu: MenuProps['items'] = useMemo(() => [

    //     {
    //         label: userInfo,
    //         key: 'fullname',
    //         disabled: true
    //     },
    //     { type: 'divider' },
    //     { label: 'Cài đặt thông tin cá nhân', key: 'profile', icon: <EditOutlined /> },
    //     { label: 'Đổi mật khẩu', key: 'change-password', icon: <LockOutlined /> },
    //     { type: 'divider' },
    //     { label: <span style={{ color: 'red' }}>Đăng xuất</span>, key: 'logout', icon: <LogoutOutlined />, onClick: onLogout }
    // ], [user, onLogout]);

    return (
        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
            <Avatar size="default" src={user.profile_image || undefined} icon={!user.profile_image && <UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
    );
};

export default UserDropdown;