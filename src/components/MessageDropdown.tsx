import React from 'react';
import { Avatar, Space } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const MessageDropdown = () => {
    const handleButtonMessageClick = () => {
        alert('You clicked on Button Message!');
    };
    return (
        <Space
            onClick={handleButtonMessageClick}
        >
            <Avatar
                size={'default'}
                icon={<CommentOutlined />}
                style={{ cursor: 'pointer' }}
            ></Avatar>
        </Space>
    );
};

export default MessageDropdown;
