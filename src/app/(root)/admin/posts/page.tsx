'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Select } from 'antd';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

interface JobPost {
    id: number;
    title: string;
    company_name: string;
    recruiter_name: string;
    work_location: string;
    created_at: string;
    status: string;
    approval_status: string; // Thêm approval_status vào đây
}

const ManagePostPage = () => {
    const router = useRouter();
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hàm fetch jobs từ backend
    const fetchJobs = async (approvalStatus?: string) => {
        try {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin`;
            if (approvalStatus) {
                url += `?approval_status=${approvalStatus}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await res.json();
            setJobs(data);
            setFilteredJobs(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = jobs.filter((job) =>
            job.title.toLowerCase().includes(value.toLowerCase()) ||
            job.company_name.toLowerCase().includes(value.toLowerCase()) ||
            job.recruiter_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredJobs(filtered);
    };

    const handleApprovalStatusChange = (value: string) => {
        setSelectedApprovalStatus(value);
        fetchJobs(value);
        setSearchText(''); // Reset search khi đổi approvalStatus
    };

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'Công ty',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'recruiter_name',
            key: 'recruiter_name',
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái phê duyệt',
            dataIndex: 'approval_status',
            key: 'approval_status',
            render: (approvalStatus: string) => {
                let color = 'orange';
                let label = 'Chờ duyệt';

                if (approvalStatus === 'Approved') {
                    color = 'green';
                    label = 'Đã duyệt';
                } else if (approvalStatus === 'Rejected') {
                    color = 'red';
                    label = 'Từ chối';
                }

                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'open' ? 'green' : 'red'}>
                    {status === 'open' ? 'Mở' : 'Đã đóng'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: JobPost) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <CustomButton
                        text="Duyệt"
                        onClick={() => handleApprove(record.id)}
                        backgroundColor="#4CAF50"
                        hoverColor="#388E3C"
                        textColor="white"
                        disabled={record.approval_status === 'Approved'}
                        style={{
                            width: '100px',
                            height: '60px',
                            fontSize: '15px',
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                            opacity: record.approval_status === 'Approved' ? 0.6 : 1,
                            cursor: record.approval_status === 'Approved' ? 'not-allowed' : 'pointer',
                        }}
                    />
                    <CustomButton
                        text="Từ chối"
                        onClick={() => handleReject(record.id)}
                        backgroundColor="orange"
                        hoverColor="darkorange"
                        disabled={record.approval_status === 'Approved' || record.approval_status === 'Rejected'}
                        style={{
                            width: '100px',
                            height: '60px',
                            fontSize: '15px',
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                            opacity: record.approval_status === 'Approved' || record.approval_status === 'Rejected' ? 0.6 : 1,
                            cursor: record.approval_status === 'Approved' || record.approval_status === 'Rejected' ? 'not-allowed' : 'pointer',
                        }}
                    />
                    <CustomButton
                        text="Xem chi tiết"
                        onClick={() => handleViewDetail(record.id)}
                        backgroundColor="blue"
                        hoverColor="darkblue"
                        style={{
                            width: '120px',
                            height: '60px',
                            fontSize: '14px',
                            fontWeight: '700',
                            borderRadius: '6px',
                            border: 'none',
                            transition: 'background-color 0.3s ease',
                        }}
                    />
                </div>
            ),
        }
    ];

    const handleApprove = async (id: number) => {
        try {
            // Gửi yêu cầu PUT hoặc PATCH để cập nhật trạng thái approval_status
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/approve/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to approve job');
            }
            // Sau khi duyệt thành công, gọi lại API để lấy lại danh sách công việc
            fetchJobs(selectedApprovalStatus);
        } catch (error) {
            console.error('Error approving job:', error);
            alert('Có lỗi xảy ra khi duyệt công việc!');
        }
    };


    const handleReject = async (id: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/reject/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to reject job');
            }
            // Sau khi từ chối thành công, gọi lại API để lấy lại danh sách công việc
            fetchJobs(selectedApprovalStatus);
        } catch (error) {
            console.error('Error rejecting job:', error);
            alert('Có lỗi xảy ra khi từ chối công việc!');
        }
    };


    const handleViewDetail = (id: number) => {
        router.push(`/admin/postDetail?id=${id}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý bài đăng</h2>
            <div className="flex justify-between mb-4">
                <Search
                    placeholder="Tìm kiếm theo tiêu đề, công ty, hoặc nhà tuyển dụng"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchText}
                    style={{ width: 300 }}
                    allowClear
                />
                <Select
                    placeholder="Lọc theo trạng thái duyệt"
                    onChange={handleApprovalStatusChange}
                    allowClear
                    style={{ width: 200 }}
                    value={selectedApprovalStatus}
                >
                    <Option value="Approved">Đã duyệt</Option>
                    <Option value="Rejected">Từ chối</Option>
                    <Option value="Pending">Chờ duyệt</Option>
                </Select>
            </div>

            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={filteredJobs.map((job) => ({ ...job, key: job.id }))}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 1000 }}
                />
            </div>
        </div>
    );
};

export default ManagePostPage;
