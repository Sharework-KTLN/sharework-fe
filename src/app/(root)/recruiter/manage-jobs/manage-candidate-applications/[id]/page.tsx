'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Typography, Spin, Empty, Pagination, Button, Modal, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ContactButton from '@/components/ContactButton';

const { Title, Text } = Typography;

interface Application {
    id: number;
    status: string;
    file_name: string;
    full_name: string;
    phone: string;
    email: string;
    cover_letter: string;
    cv_url: string;
    createdAt: string;
    candidate_id: number;
}

const ApplicantsPage = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
    const [totalApplications, setTotalApplications] = useState(0); // Tổng số ứng viên
    const [visible, setVisible] = useState(false); // Modal gửi tin nhắn
    const [message, setMessage] = useState(''); // Tin nhắn người dùng muốn gửi
    const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${id}`);
                const data = await res.json();
                console.log("Data fetched:", data); // Kiểm tra dữ liệu API

                // Giả sử dữ liệu trả về là mảng trực tiếp
                setApplications(data); // Gán dữ liệu trực tiếp vào state applications
                setTotalApplications(data.length); // Tổng số ứng viên
            } catch (err) {
                console.error('Lỗi khi load ứng viên:', err);
                setApplications([]); // Nếu có lỗi, reset lại state applications
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchApplications();
        }
    }, [id, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSendMessage = () => {
        // Thực hiện gửi tin nhắn đến ứng viên (có thể gọi API gửi tin nhắn)
        console.log('Gửi tin nhắn đến ứng viên:', selectedApplicant?.full_name, message);
        setMessage('');
        setVisible(false); // Đóng modal sau khi gửi
    };

    const openMessageModal = (applicant: Application) => {
        setSelectedApplicant(applicant);
        setVisible(true);
    };

    return (
        <div
            style={{
                width: '95%',
                margin: '0 auto',
                padding: '40px 20px',
                backgroundColor: '#f9f9fb',
                minHeight: '100vh',
            }}
        >
            <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
                Danh sách ứng viên ứng tuyển
            </Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : applications.length === 0 ? (
                <Empty description="Chưa có ứng viên ứng tuyển." style={{ marginTop: '50px' }} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {applications.map((app) => (
                        <Card
                            key={app.id}
                            title={
                                <span className="text-blue-600 text-xl font-semibold">
                                    {app.full_name}
                                </span>
                            }
                            className="shadow-md rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                            hoverable
                            style={{
                                padding: '20px',
                                borderRadius: '16px',
                                backgroundColor: 'white',
                            }}
                            extra={
                                <ContactButton
                                    userId={app.candidate_id}
                                    userRole="candidate"
                                    buttonText="Liên hệ"
                                    buttonType="primary"
                                    buttonSize="large"
                                />
                            }
                        >
                            <p><Text strong>Email:</Text> {app.email}</p>
                            <p><Text strong>Số điện thoại:</Text> {app.phone}</p>
                            <p><Text strong>Trạng thái:</Text> {app.status}</p>
                            <p><Text strong>Ngày ứng tuyển:</Text> {dayjs(app.createdAt).format('DD-MM-YYYY HH:mm')}</p>
                            <p><Text strong>Cover letter:</Text> {app.cover_letter || '(Không có)'}</p>
                            <p>
                                <Text strong>CV:</Text>{' '}
                                <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {app.file_name}
                                </a>
                            </p>
                        </Card>
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {applications.length > 0 && (
                <Pagination
                    current={currentPage}
                    total={totalApplications}
                    pageSize={5}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    style={{ textAlign: 'center', marginTop: '40px' }}
                />
            )}

            {/* Modal gửi tin nhắn */}
            <Modal
                title={`Liên hệ với ${selectedApplicant?.full_name}`}
                open={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSendMessage}>
                        Gửi
                    </Button>,
                ]}
            >
                <Input.TextArea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Nhập tin nhắn của bạn..."
                />
            </Modal>
        </div>
    );

};

export default ApplicantsPage;
