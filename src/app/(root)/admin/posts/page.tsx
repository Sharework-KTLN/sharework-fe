'use client';  // Thêm dòng này nếu chưa có

import React from "react";
import { Table, Tag, Space } from "antd";
import CustomButton from "@/components/CustomButton"; // Import button của bạn
import { useRouter } from "next/navigation"; // Để điều hướng đến trang chi tiết

interface JobPost {
    id: number;
    title: string;
    salary_range: string;
    work_type: string;
    work_location: string;
    company_name: string; // Thêm thông tin công ty
    vacancies: number; // Số lượng tuyển dụng
    status: string;
    recruiter_name: string; // Tên người đăng
}

const ManagePostPage = () => {
    const router = useRouter(); // Để điều hướng đến trang chi tiết
    const jobPosts: JobPost[] = [
        {
            id: 1,
            title: "Frontend Developer",
            salary_range: "$1,500 - $2,500",
            work_type: "Full-time",
            work_location: "Hà Nội, Vietnam",
            company_name: "ABC Tech",
            vacancies: 3,
            status: "open",
            recruiter_name: "Nguyễn Văn A"
        },
        {
            id: 2,
            title: "Backend Developer",
            salary_range: "$1,800 - $3,000",
            work_type: "Full-time",
            work_location: "TP. Hồ Chí Minh, Vietnam",
            company_name: "XYZ Solutions",
            vacancies: 2,
            status: "closed",
            recruiter_name: "Lê Thị B"
        },
        // Thêm dữ liệu giả lập để kiểm tra
    ];

    const columns = [
        {
            title: "Vị trí",
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
            title: "Số lượng tuyển",
            dataIndex: "vacancies",
            key: "vacancies",
        },
        {
            title: "Lương",
            dataIndex: "salary_range",
            key: "salary_range",
        },
        {
            title: "Hình thức",
            dataIndex: "work_type",
            key: "work_type",
        },
        {
            title: "Địa điểm",
            dataIndex: "work_location",
            key: "work_location",
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
            render: (_: any, record: JobPost) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <CustomButton
                        text="Duyệt"
                        onClick={() => handleApprove(record.id)}
                        backgroundColor="green"
                        hoverColor="darkgreen"
                        style={{
                            flex: 1,
                            fontFamily: 'Roboto, sans-serif',
                        }}
                    />
                    <CustomButton
                        text="Từ chối"
                        onClick={() => handleReject(record.id)}
                        backgroundColor="orange"
                        hoverColor="darkorange"
                        style={{
                            flex: 1,
                            fontFamily: 'Roboto, sans-serif',
                        }}
                    />
                    <CustomButton
                        text="Xoá"
                        onClick={() => handleDelete(record.id)}
                        backgroundColor="red"
                        hoverColor="darkred"
                        style={{
                            flex: 1,
                            fontFamily: 'Roboto, sans-serif',
                        }}
                    />
                    <CustomButton
                        text="Xem chi tiết"
                        onClick={() => handleViewDetail(record.id)}
                        backgroundColor="blue"
                        hoverColor="darkblue"
                        style={{
                            flex: 1,
                            fontFamily: 'Roboto, sans-serif',
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

    const handleDelete = (id: number) => {
        console.log("Xóa bài đăng:", id);
    };

    const handleViewDetail = (id: number) => {
        // Điều hướng đến trang chi tiết, có thể sử dụng router.push()
        router.push(`/admin/post-detail/${id}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý bài đăng</h2>
            <Table
                columns={columns}
                dataSource={jobPosts.map(job => ({ ...job, key: job.id }))}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default ManagePostPage;
