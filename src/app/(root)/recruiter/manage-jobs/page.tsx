'use client';

import React from 'react'
import CustomButton from '@/components/CustomButton'
import dayjs from 'dayjs'

const samplePosts = [
    {
        id: 1,
        title: 'Thực tập sinh lập trình',
        skills: ['Figma', 'Làm việc nhóm', 'Tin học văn phòng'],
        applicants: 1,
        postedDate: dayjs().subtract(2, 'day').format('DD-MM-YYYY'),
    },
    {
        id: 2,
        title: 'Nhân viên Marketing',
        skills: ['SEO', 'Google Ads', 'Facebook Ads'],
        applicants: 3,
        postedDate: dayjs().subtract(5, 'day').format('DD-MM-YYYY'),
    },
    {
        id: 3,
        title: 'Thiết kế đồ họa',
        skills: ['Photoshop', 'Illustrator', 'Figma'],
        applicants: 2,
        postedDate: dayjs().subtract(1, 'week').format('DD-MM-YYYY'),
    },
    {
        id: 4,
        title: 'Kế toán tổng hợp',
        skills: ['Excel', 'Phân tích dữ liệu', 'Lập báo cáo'],
        applicants: 5,
        postedDate: dayjs().subtract(10, 'day').format('DD-MM-YYYY'),
    },
    {
        id: 5,
        title: 'Nhân viên bán hàng',
        skills: ['Giao tiếp tốt', 'Chốt đơn', 'Quản lý kho'],
        applicants: 4,
        postedDate: dayjs().subtract(3, 'day').format('DD-MM-YYYY'),
    },
];

const page = () => {
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
            <p
                className='text-base font-bold mt-2 ml-3'
            >
                Thư viện bài đăng của bạn
            </p>
            {samplePosts.map((post) => (
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
                    {/* Cột 1 - Thông tin công việc */}
                    <div style={{ flex: 2 }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                            {post.title}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Yêu cầu:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '5px' }}>
                            {post.skills.map((skill, index) => (
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
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <p style={{ fontSize: '14px', color: '#555' }}>
                            <strong>Số lượng ứng tuyển: </strong> {post.applicants} ứng viên
                        </p>
                    </div>

                    {/* Cột 2 - Ngày đăng */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#555' }}>📅 Ngày đăng:</p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{post.postedDate}</p>
                    </div>

                    {/* Cột 3 - Hành động */}
                    <div style={{ flex: 1, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <CustomButton
                            text="Xem bài đăng"
                            backgroundColor="blue"
                            hoverColor="darkblue"
                            textColor="white"
                            onClick={() => alert('Xem bài đăng')}
                        />
                        <CustomButton
                            text="Chỉnh sửa"
                            backgroundColor="orange"
                            hoverColor="darkorange"
                            textColor="white"
                            onClick={() => alert('Chỉnh sửa')}
                        />
                        <CustomButton
                            text="Ẩn bài đăng"
                            backgroundColor="gray"
                            hoverColor="darkgray"
                            textColor="white"
                            onClick={() => alert('Ẩn bài đăng')}
                        />
                    </div>
                </div>
            ))}
            {/* <div
                style={{
                    width: '98%',
                    height: '80px',
                    marginLeft: '1%',
                    marginTop: '10px',
                    border: '0px solid gray',
                    borderRadius: '5px',
                    backgroundColor: '#FFFFFF'
                }}
            >
                
            </div> */}

        </div>
    )
}

export default page
