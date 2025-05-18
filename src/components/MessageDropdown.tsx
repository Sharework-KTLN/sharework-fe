'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Dropdown, Space, List, Badge, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { resetChatTrigger } from '@/redux/slice/chatSlice';
import { RootState } from '@/redux/store';
import { CommentOutlined, CloseOutlined } from '@ant-design/icons';
import { Conversation } from '@/types/conversation';
import { Message } from '@/types/message';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);

const MessageDropdown = () => {

    // Redux
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user);
    const chat = useSelector((state: RootState) => state.chat);


    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messagesByConversation, setMessagesByConversation] = useState<{ [key: number]: Message[] }>({});
    const [openConversations, setOpenConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

    // useEffect(() => {
    //     console.log("messagesByConversation: ", messagesByConversation);
    //     console.log("conversations: ", conversations);
    //     console.log("openConversations: ", openConversations);
    // }, [conversations, messagesByConversation, openConversations]);

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

            // Thêm tin nhắn mới vào state
            setMessagesByConversation(prev => ({
                ...prev,
                [message.conversation_id]: [
                    ...(prev[message.conversation_id] || []),
                    message
                ]
            }));
        });

        // Dọn dẹp khi component unmount
        return () => {
            socket.off('newMessage');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []); // Chỉ chạy một lần khi component được mount

    useEffect(() => {
        if (!user?.id) return;

        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations/?userId=${user.id}&role=${user.role}`);
                const fetchedConversations: Conversation[] = res.data;
                setConversations(fetchedConversations);

                // Fetch all messages cho mỗi conversation
                const messagesMap: { [key: number]: Message[] } = {};
                await Promise.all(
                    fetchedConversations.map(async (c) => {
                        try {
                            const resMsg = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/${c.id}`);
                            messagesMap[c.id] = resMsg.data;
                        } catch (err) {
                            console.error(`Lỗi khi tải tin nhắn cho conversation ${c.id}:`, err);
                        }
                    })
                );
                setMessagesByConversation(messagesMap);
            } catch (error) {
                console.error("Lỗi khi tải hội thoại:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user?.id, user?.role]);

    const handleOpenChat = useCallback(async (conversation: Conversation) => {
        if (!openConversations.find(c => c.id === conversation.id)) {
            setOpenConversations(prev => [...prev, conversation]);

            // Tham gia vào room của cuộc trò chuyện này qua socket
            socket.emit('joinConversation', conversation.id);
        }

        if (!messagesByConversation[conversation.id]) {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/${conversation.id}`);
                setMessagesByConversation(prev => ({
                    ...prev,
                    [conversation.id]: res.data,
                }));
            } catch (error) {
                console.error('Lỗi khi tải tin nhắn:', error);
            }
        }
    }, [setOpenConversations, messagesByConversation, openConversations]);

    const handleSendMessage = (conversationId: number) => {
        const content = inputValues[conversationId]?.trim();
        console.log("content: ", content);
        if (!content || !user?.id) return;

        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        const isRecruiter = user.role === 'recruiter';
        const receiverId = isRecruiter ? conversation.candidate_id : conversation.recruiter_id;

        // Thay vì thêm tin nhắn trực tiếp vào state, gửi qua socket
        socket.emit('sendMessage', {
            conversationId,
            senderId: user.id,
            content,
            receiverId: receiverId ?? 0
        });

        setInputValues(prev => ({ ...prev, [conversationId]: '' }));
    };

    const handleCloseChat = (conversationId: number) => {
        // Rời khỏi room của cuộc trò chuyện này
        socket.emit('leaveConversation', conversationId);

        setOpenConversations(prev => prev.filter(c => c.id !== conversationId));
    };

    // Xử lý khi component unmount
    useEffect(() => {
        return () => {
            // Rời khỏi tất cả các room khi component unmount
            openConversations.forEach(conversation => {
                socket.emit('leaveConversation', conversation.id);
            });
        };
    }, [openConversations]);

    const dropdownContent = (
        <div style={{ width: 350, maxHeight: 400, overflowY: 'auto', background: '#fff', borderRadius: '8px', padding: '8px' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>Đang tải...</div>
            ) : conversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                    Chưa có cuộc hội thoại nào
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={conversations}
                    renderItem={(item) => {
                        const messages = messagesByConversation[item.id] || [];
                        const lastMessage = messages[messages.length - 1];
                        const unreadCount = messages.filter(msg => !msg.is_read && msg.receiver_id === user.id).length;
                        const isRecruiter = user.role === 'recruiter';
                        console.log("item: ", item);
                        return (
                            <List.Item
                                onClick={() => handleOpenChat(item)}
                                style={{ cursor: 'pointer', padding: '8px', borderBottom: '1px solid #f0f0f0' }}
                            >
                                {item.candidate ? (
                                    <>
                                        <List.Item.Meta

                                            avatar={
                                                item.candidate?.profile_image
                                                    ? <Avatar src={item.candidate.profile_image} />
                                                    : <Avatar>{item.candidate?.full_name?.[0] || '?'}</Avatar>
                                            }
                                            title={<span style={{ fontWeight: 'bold' }}>{item.candidate?.full_name || 'Ứng viên ẩn danh'}</span>}
                                            description={<span style={{ color: '#888' }}>{lastMessage?.content || ''}</span>}
                                        />
                                        <Badge count={unreadCount} overflowCount={99}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <List.Item.Meta

                                            avatar={
                                                item.recruiter?.profile_image
                                                    ? <Avatar src={item.recruiter.profile_image} />
                                                    : <Avatar>{item.recruiter?.full_name?.[0] || '?'}</Avatar>
                                            }
                                            title={<span style={{ fontWeight: 'bold' }}>{item.recruiter?.full_name || 'Ứng viên ẩn danh'}</span>}
                                            description={<span style={{ color: '#888' }}>{lastMessage?.content || ''}</span>}
                                        />
                                        <Badge count={unreadCount} overflowCount={99}
                                        />
                                    </>
                                )}
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );

    // Thêm function để bắt đầu chat với một user
    const handleStartChatWithUser = useCallback(async (otherUserId: number, role: 'candidate' | 'recruiter') => {
        if (!user?.id) return;

        // Kiểm tra nếu đã tồn tại conversation giữa 2 người
        const existingConversation = conversations.find(c => {
            if (user.role === 'recruiter') {
                return c.recruiter_id === user.id && c.candidate_id === otherUserId;
            } else {
                return c.candidate_id === user.id && c.recruiter_id === otherUserId;
            }
        });

        if (existingConversation) {
            // Nếu đã có conversation, mở nó lên
            handleOpenChat(existingConversation);
            return;
        }

        try {
            // Tạo conversation mới
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/conversations`, {
                candidate_id: user.role === 'candidate' ? user.id : otherUserId,
                recruiter_id: user.role === 'recruiter' ? user.id : otherUserId,
            });

            const newConversation: Conversation = res.data;

            // Cập nhật vào state
            setConversations(prev => [...prev, newConversation]);

            // Mở khung chat mới
            setOpenConversations(prev => [...prev, newConversation]);

            // Tham gia room qua socket
            socket.emit('joinConversation', newConversation.id);

            // Tải tin nhắn lần đầu (sẽ là rỗng)
            setMessagesByConversation(prev => ({
                ...prev,
                [newConversation.id]: [],
            }));
        } catch (error) {
            console.error("Lỗi khi tạo cuộc hội thoại mới:", error);
        }
    }, [conversations, user, setConversations, setOpenConversations, setMessagesByConversation, handleOpenChat]);

    // Lắng nghe sự kiện trigger chat từ Redux
    useEffect(() => {
        if (!chat.trigger || !chat.targetUserId || !chat.targetUserRole) return;

        // Gọi hàm mở chat với user được yêu cầu từ nơi khác
        handleStartChatWithUser(chat.targetUserId, chat.targetUserRole);

        // Reset trigger sau khi xử lý
        dispatch(resetChatTrigger());
    }, [chat.trigger, chat.targetUserId, chat.targetUserRole, dispatch, handleStartChatWithUser]);


    return (
        <>
            <Dropdown
                dropdownRender={() => dropdownContent}
                trigger={['click']}
                placement="bottomRight"
                arrow
            >
                <Space>
                    <Avatar
                        size="default"
                        icon={<CommentOutlined />}
                        style={{ cursor: 'pointer', backgroundColor: '#1677ff' }}
                    />
                </Space>
            </Dropdown>

            {/* Khung chat */}
            <div style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                zIndex: 999,
            }}>
                {openConversations.map((conversation) => {
                    const messages = messagesByConversation[conversation.id] || [];
                    return (
                        <div key={conversation.id} style={{
                            width: 320,
                            height: 380,
                            background: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div
                                style={{
                                    padding: '8px',
                                    background: '#1677ff',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{conversation.candidate ? conversation.candidate?.full_name : conversation.recruiter?.full_name}</span>
                                    {(conversation.recruiter?.companies && conversation.recruiter) && (
                                        <span style={{ fontSize: '12px', color: '#b3c1dc', fontWeight: 'bold' }}>
                                            {conversation.recruiter.companies[0].name}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleCloseChat(conversation.id)}
                                    style={{ color: '#fff' }}
                                />
                            </div>

                            {/* Tin nhắn */}
                            <div style={{ flex: 1, padding: '8px', height: '250px', overflowY: 'auto', background: '#f9f9f9' }}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <div key={msg.id} style={{
                                            display: 'flex',
                                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                                            marginBottom: '8px',
                                        }}>
                                            <div style={{
                                                background: isMe ? '#d6f5d6' : '#e6f0ff',
                                                color: 'black',
                                                padding: '8px 12px',
                                                borderRadius: '20px',
                                                maxWidth: '70%',
                                                wordBreak: 'break-word',
                                            }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Nhập tin nhắn */}
                            <div style={{ padding: '8px', borderTop: '1px solid #ccc', display: 'flex', gap: '8px' }}>
                                <Input
                                    placeholder="Nhập tin nhắn..."
                                    value={inputValues[conversation.id] || ''}
                                    onChange={(e) => setInputValues(prev => ({ ...prev, [conversation.id]: e.target.value }))}
                                    onPressEnter={() => handleSendMessage(conversation.id)}
                                    style={{ flex: 1, borderRadius: '20px' }}
                                />
                                <Button type="primary" shape="round" onClick={() => handleSendMessage(conversation.id)}>
                                    Gửi
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MessageDropdown;
