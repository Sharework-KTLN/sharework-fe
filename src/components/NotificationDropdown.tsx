import React, { useMemo } from 'react';
import { Dropdown, Avatar, Badge } from 'antd';
import { BellFilled } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu của thông báo
type Notification = {
    id: string;
    message: string;
};

const NotificationDropdown: React.FC = () => {
    const notifications = useMemo<Notification[]>(() => [], []);  // Thay đổi thành dữ liệu thực tế nếu có API

    const notificationMenu: MenuProps['items'] = useMemo(() => {
        // Nếu không có thông báo
        if (notifications.length === 0) {
            return [
                {
                    label: <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Thông báo</span>,
                    key: 'title',
                    disabled: true
                },
                { type: 'divider' },
                {
                    label: (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
                            <Image
                                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                                alt="No notifications"
                                width={100}
                                height={50}
                                style={{ opacity: 0.6 }}
                            />
                            <p style={{ marginTop: 10, color: '#888' }}>Bạn chưa có thông báo nào</p>
                        </div>
                    ),
                    key: 'no-notifications',
                    disabled: true
                }
            ];
        }

        // Nếu có thông báo
        return [
            {
                label: <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Thông báo</span>,
                key: 'title',
                disabled: true
            },
            { type: 'divider' },
            ...notifications.map((notif) => ({
                label: notif.message,
                key: notif.id,
            }))
        ];
    }, [notifications]);

    return (
        <Dropdown menu={{ items: notificationMenu }} placement="bottomRight" arrow trigger={['click']}>
            <Badge count={notifications.length} offset={[-5, 5]}>
                <Avatar size="default" icon={<BellFilled />} style={{ cursor: 'pointer', color: 'blue' }} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationDropdown;