'use client';

import React, { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import dayjs from 'dayjs';
import { Job } from '@/types/job';
import { useRouter } from 'next/navigation';

const ManageJobPage = () => {
    const [posts, setPosts] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true); // State để hiển thị loading
    const [isMounted, setIsMounted] = useState(false); // State kiểm tra nếu đang ở môi trường client
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // Chỉ thiết lập isMounted thành true khi component đã render trên client
    }, []);

    useEffect(() => {
        // Gọi API lấy danh sách bài đăng của recruiter_id = 1
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:8080/jobs/recruiter/1");
                if (!response.ok) {
                    throw new Error("Lỗi khi tải bài đăng");
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi tải bài đăng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleButtonViewPost = (post_id: number) => {
        if (isMounted) {
            router.push(`/recruiter/manage-jobs/${post_id}`);
        }
    };

    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#F5F4F9',
                paddingTop: '5px',
                msOverflowY: 'scroll',
                padding: '20px',
            }}
        >
            <p className='text-base font-bold mt-2 ml-3'>
                Thư viện bài đăng của bạn
            </p>
            {loading ? (
                <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Đang tải...</p>
            ) : posts.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Không có bài đăng nào.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            width: '98%',
                            marginLeft: '1%',
                            marginTop: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#FFFFFF',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ flex: 2 }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                                {post.title}
                            </h2>
                            <p style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Yêu cầu:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '5px' }}>
                                {post.required_skills?.split(',').map((skill, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            backgroundColor: '#E8F5E9',
                                            color: '#2E7D32',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                            <p style={{ fontSize: '14px', color: '#555' }}>
                                <strong>Số lượng ứng tuyển: </strong> {post.vacancies} ứng viên
                            </p>
                        </div>

                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', color: '#555' }}>📅 Ngày đăng:</p>
                            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {dayjs(post.created_at).format('DD-MM-YYYY')}
                            </p>
                        </div>

                        <div style={{ flex: 1, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <CustomButton
                                text="Xem bài đăng"
                                backgroundColor="blue"
                                hoverColor="darkblue"
                                textColor="white"
                                onClick={() => handleButtonViewPost(post.id)}
                            />
                            <CustomButton
                                text="Chỉnh sửa"
                                backgroundColor="orange"
                                hoverColor="darkorange"
                                textColor="white"
                                onClick={() => alert(`Chỉnh sửa bài đăng ID: ${post.id}`)}
                            />
                            <CustomButton
                                text="Ẩn bài đăng"
                                backgroundColor="gray"
                                hoverColor="darkgray"
                                textColor="white"
                                onClick={() => alert(`Ẩn bài đăng ID: ${post.id}`)}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageJobPage;
