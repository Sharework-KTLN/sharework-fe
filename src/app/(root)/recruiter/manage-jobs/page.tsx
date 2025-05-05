'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import CustomButton from '@/components/CustomButton';
import dayjs from 'dayjs';
import { Job } from '@/types/job';
import { useRouter } from 'next/navigation';

const ManageJobPage = () => {

    const user = useSelector((state: RootState) => state.user);
    const [posts, setPosts] = useState<Job[]>([]);
    const [applicationsCount, setApplicationsCount] = useState<{ [key: number]: number }>({});
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
                const response = await fetch(`http://localhost:8080/jobs/recruiter/${user.id}`);
                if (!response.ok) {
                    setPosts([]);
                    return;
                }
                const data = await response.json();
                if (Array.isArray(data) && data.length === 0) {
                    setPosts([]); // Nếu không có bài đăng, trả về danh sách rỗng
                } else {
                    setPosts(data); // Gán dữ liệu bài đăng nếu có
                }
                console.log("Posts:", data);
            } catch (error) {
                console.error("Lỗi tải bài đăng1:", error);
                setPosts([]); // Set lại danh sách bài đăng rỗng khi có lỗi
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) {
            fetchPosts();
        }

    }, [user?.id]);

    useEffect(() => {
        const fetchApplicationCounts = async () => {
            try {
                const response = await fetch('http://localhost:8080/applications/count-by-job');
                const data = await response.json();
                const map: { [key: number]: number } = {};
                data.forEach((item: { job_id: number; total: number }) => {
                    map[item.job_id] = item.total;
                });
                setApplicationsCount(map);
            } catch (error) {
                console.error("Lỗi khi load số lượng ứng viên:", error);
            }
        };

        fetchApplicationCounts();
    }, []);


    const handleButtonViewPost = (post_id: number) => {
        if (isMounted) {
            router.push(`/recruiter/manage-jobs/${post_id}`);
        }
    };
    const handleButtonEditPost = (post_id: number) => {
        if (isMounted) {
            router.push(`/recruiter/edit-job/${post_id}`);
        }
    };
    const handleButtonViewCandidateAppications = (post_id: number) => {
        if (isMounted) {
            router.push(`/recruiter/manage-jobs/manage-candidate-applications/${post_id}`);
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
                                <strong>Số lượng ứng tuyển: </strong> {applicationsCount[post.id] ?? 0} ứng viên
                            </p>
                        </div>

                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', color: '#555' }}>📅 Ngày đăng:</p>
                            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {dayjs(post.created_at).format('DD-MM-YYYY')}
                            </p>

                            <p style={{ fontSize: '13px', color: dayjs().isAfter(post.deadline) ? 'red' : 'green', fontWeight: 'bold' }}>
                                {dayjs().isAfter(post.deadline)
                                    ? 'Hết hạn'
                                    : `Còn ${dayjs(post.deadline).diff(dayjs(), 'day')} ngày để ứng tuyển`}
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
                                onClick={() => handleButtonEditPost(post.id)}
                            />
                            <CustomButton
                                text="Xem ứng viên đã ứng tuyển"
                                backgroundColor="gray"
                                hoverColor="darkgray"
                                textColor="white"
                                onClick={() => handleButtonViewCandidateAppications(post.id)}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageJobPage;
