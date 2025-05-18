'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Select } from 'antd';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';

interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: 'admin' | 'candidate' | 'recruiter';
    created_at: string;
}

const { Search } = Input;
const { Option } = Select;

const ManageUserPage = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (role?: string) => {
        try {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/alluser`;
            if (role) {
                url += `?role=${role}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data.data);
            setFilteredUsers(data.data);
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
        fetchUsers();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = users.filter((user) =>
            user.full_name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        fetchUsers(value);
        setSearchText(''); // Reset search khi đổi role
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 200,
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role: string) => {
                const color = role === 'admin' ? 'purple' : role === 'candidate' ? 'volcano' : 'green';
                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 160,
            render: (_: unknown, record: User) => (
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
                    <CustomButton
                        text="Chặn"
                        onClick={() => handleBlock(record.id)} // Tạo một hàm xử lý cho button Chặn
                        backgroundColor="red" // Màu đỏ cho sự chú ý
                        hoverColor="darkred" // Màu khi hover
                        style={{
                            width: '70px',
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
        router.push(`/admin/userDetail?id=${id}`);
    };

    const handleBlock = (id: number) => {
        router.push(`/admin/userDetail?id=${id}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
            <div className="flex justify-between mb-4">
                <Search
                    placeholder="Tìm kiếm theo tên hoặc email"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchText}
                    style={{ width: 300 }}
                    allowClear
                />
                <Select
                    placeholder="Lọc theo vai trò"
                    onChange={handleRoleChange}
                    allowClear
                    style={{ width: 200 }}
                    value={selectedRole}
                >
                    <Option value="candidate">Ứng viên</Option>
                    <Option value="recruiter">Nhà tuyển dụng</Option>
                    <Option value="admin">Quản trị viên</Option>
                </Select>
            </div>

            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={filteredUsers.map((user) => ({ ...user, key: user.id }))}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 1000 }}
                />
            </div>
        </div>
    );
};

export default ManageUserPage;
