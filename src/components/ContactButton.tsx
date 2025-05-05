'use client';

import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { MessageOutlined } from '@ant-design/icons';
import { triggerChat } from '@/redux/slice/chatSlice';

interface ContactButtonProps {
    userId: number;
    userRole: 'candidate' | 'recruiter';
    buttonText?: string;
    buttonStyle?: React.CSSProperties;
    buttonType?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
    buttonSize?: 'large' | 'middle' | 'small';
    icon?: boolean;
}

/**
 * ContactButton - Nút liên hệ có thể sử dụng ở bất kỳ trang nào
 * 
 * @param userId - ID của người dùng cần liên hệ
 * @param userRole - Vai trò của người dùng ('candidate' hoặc 'recruiter')
 * @param buttonText - Văn bản hiển thị trên nút (mặc định: "Liên hệ")
 * @param buttonStyle - CSS inline style cho nút
 * @param buttonType - Loại nút Ant Design
 * @param buttonSize - Kích thước nút
 * @param icon - Hiển thị icon tin nhắn
 */
const ContactButton: React.FC<ContactButtonProps> = ({
    userId,
    userRole,
    buttonText = "Liên hệ",
    buttonStyle,
    buttonType = "primary",
    buttonSize = "middle",
    icon = true
}) => {
    const dispatch = useDispatch();

    const handleContact = () => {
        // Kích hoạt action trong Redux để thông báo cho MessageDropdown mở chat
        dispatch(triggerChat({
            userId,
            userRole
        }));
    };

    return (
        <Button
            type={buttonType}
            size={buttonSize}
            icon={icon ? <MessageOutlined /> : null}
            onClick={handleContact}
            style={buttonStyle}
        >
            {buttonText}
        </Button>
    );
};

export default ContactButton;