import React, { useState, useEffect } from 'react';
import { Avatar, List, Input, Button, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Message } from '@/types/message';

const socket = io('http://localhost:8080');

interface StandaloneChatboxProps {
    conversationId: number;  // ID của cuộc hội thoại
}

const StandaloneChatbox: React.FC<StandaloneChatboxProps> = ({ conversationId }) => {
    const user = useSelector((state: RootState) => state.user);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Socket.IO event listeners
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Lắng nghe sự kiện có tin nhắn mới
        socket.on('newMessage', (message: Message) => {
            console.log('Received new message:', message);

            if (message.conversation_id === conversationId) {
                setMessages(prev => [...prev, message]);
            }
        });

        // Dọn dẹp khi component unmount
        return () => {
            socket.off('newMessage');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [conversationId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/messages/${conversationId}`);
                setMessages(res.data);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Gửi tin nhắn qua socket
        socket.emit('sendMessage', {
            conversationId,
            senderId: user.id,
            content: newMessage.trim(),
            receiverId: 0, // Truyền receiverId tùy theo logic của bạn
        });

        // Clear input after sending
        setNewMessage('');
    };

    return (
        <div style={{ width: '400px', background: '#fff', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>Đang tải...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                        Chưa có tin nhắn nào
                    </div>
                ) : (
                    <List
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                <List.Item.Meta
                                    avatar={
                                        item.sender?.profile_image ? (
                                            <Avatar src={item.sender.profile_image} />
                                        ) : (
                                            <Avatar>{item.sender?.full_name?.[0] || '?'}</Avatar>
                                        )
                                    }
                                    title={<span>{item.sender?.full_name || 'Ẩn danh'}</span>}
                                    description={<span>{item.content}</span>}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn"
                    style={{ marginRight: '8px' }}
                />
                <Button type="primary" onClick={handleSendMessage}>
                    Gửi
                </Button>
            </div>
        </div>
    );
};

export default StandaloneChatbox;
