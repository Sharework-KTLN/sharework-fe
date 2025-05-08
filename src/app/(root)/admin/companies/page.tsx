'use client';

import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';

interface Company {
    id: number
    name: string;
    location: string;
    total_jobs: number;
    recruiter?: {
        full_name: string;
  };
}

const { Search } = Input;

const ManageCompanyPage = () => {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = async () => {
        try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/companies/admin/companies');
        if (!res.ok) {
            throw new Error('Failed to fetch companies');
        }
        const data = await res.json();
        setCompanies(data);
        setFilteredCompanies(data);
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
        fetchCompanies();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(value.toLowerCase()) ||
        company.location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCompanies(filtered);
    };

    const columns = [
        {
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'Địa chỉ công ty',
            dataIndex: 'location',
            key: 'location',
            width: 150,
        },
        {
            title: 'Số lượng công việc',
            dataIndex: 'total_jobs',
            key: 'total_jobs',
            width: 150,
        },
        {
            title: 'Người tuyển dụng',
            key: 'recruiter',
            width: 230,
            render: (_: unknown, record: Company) => (
                <span>{record.recruiter?.full_name || 'Không có'}</span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 160,
            render: (_: unknown, record: Company) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <CustomButton
                        text="Xem chi tiết"
                        onClick={() => handleViewDetail(record.id)}
                        backgroundColor="blue"
                        hoverColor="darkblue"
                        style={{
                        width: '120px',
                        height: '35px',
                        fontSize: '14px',
                        fontWeight: '700',
                        borderRadius: '6px',
                        border: 'none',
                        transition: 'background-color 0.3s ease',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        }}
                    />
                </div>
            ),
        },
    ];

    const handleViewDetail = (id: number) => {
        // Kiểm tra giá trị id trước khi chuyển hướng
        console.log(`Navigating to /admin/companyDetail?id=${id}`);
        router.push(`/admin/companyDetail?id=${id}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý công ty</h2>
            <div className="flex justify-between mb-4">
                <Search
                placeholder="Tìm kiếm công ty theo tên hoặc địa chỉ"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={{ width: 300 }}
                allowClear
                />
            </div>

            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Table
                columns={columns}
                dataSource={filteredCompanies.map((company, index) => ({
                    ...company,
                    key: index,
                }))}
                loading={loading}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
                />
            </div>
        </div>
    );
};

export default ManageCompanyPage;
