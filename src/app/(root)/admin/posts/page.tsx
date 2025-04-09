'use client';  // Thêm dòng này nếu chưa có

import React, { useState, useEffect } from 'react';
import { Table, Tag, Space } from "antd";
import CustomButton from "@/components/CustomButton"; // Import button của bạn
import { useRouter } from "next/navigation"; // Để điều hướng đến trang chi tiết
import dayjs from 'dayjs';

interface JobPost {
    id: number;
    title: string;
    company_name: string;
    recruiter_name: string;
    work_location: string;
    created_at: string;
    status: string;
}

const ManagePostPage = () => {
    const router = useRouter(); // Để điều hướng đến trang chi tiết
    const [jobs, setJobs] = useState<JobPost[]>([]); // Chỉ định kiểu cho jobs
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state có kiểu string hoặc null
    
    useEffect(() => {
            const fetchJobs = async () => {
              try {
                // Đảm bảo URL này trỏ đến backend của bạn chạy trên port 8080
                const response = await fetch("http://localhost:8080/jobs/admin");
                if (!response.ok) {
                  throw new Error("Failed to fetch jobs");
                }
                const data = await response.json();
                setJobs(data);
              } catch (err) {
                if (err instanceof Error) {
                  setError(err.message);
                } else {
                  setError("An unknown error occurred");
                }
              } finally {
                setLoading(false);
              }
            };
          
            fetchJobs();
    }, []);

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: "Công ty",
            dataIndex: "company_name",
            key: "company_name",
        },
        {
            title: "Nhà tuyển dụng",
            dataIndex: "recruiter_name",
            key: "recruiter_name",
        },
        {
            title: "Địa điểm",
            dataIndex: "work_location",
            key: "work_location",
        },
        {
            title: "Ngày đăng",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "open" ? "green" : "red"}>
                    {status === "open" ? "Mở" : "Đã đóng"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: unknown, record: JobPost) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <CustomButton
                        text="Duyệt"
                        onClick={() => handleApprove(record.id)}
                        backgroundColor="#4CAF50" // ✅ Xanh lá thường
                        hoverColor="#388E3C"
                        textColor="white"
                        style={{
                            width: '100px',
                            height: '80px',
                            fontSize: '15px', 
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                        }}
                    />
                    <CustomButton
                        text="Từ chối"
                        onClick={() => handleReject(record.id)}
                        backgroundColor="orange"
                        hoverColor="darkorange"
                        style={{
                            width: '100px',
                            height: '80px',
                            fontSize: '15px', 
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                        }}
                    />
                    <CustomButton
                        text="Xem chi tiết"
                        onClick={() => handleViewDetail(record.id)}
                        backgroundColor="blue"
                        hoverColor="darkblue"
                        style={{
                            width: '100px',
                            height: '80px',
                            fontSize: '15px', 
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                        }}
                    />
                </div>
            ),
        },
    ];
    const handleApprove = (id: number) => {
        console.log("Duyệt bài đăng:", id);
    };

    const handleReject = (id: number) => {
        console.log("Từ chối bài đăng:", id);
    };

    const handleViewDetail = (id: number) => {
        router.push(`/admin/postDetail?id=${id}`);

    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý bài đăng</h2>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={jobs.map((job) => ({ ...job, key: job.id }))}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

export default ManagePostPage;