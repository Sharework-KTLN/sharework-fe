'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface User {
    full_name: string;
    role: string;
}

interface Company {
    name: string;
}

type MonthlyStat = {
    month: string;
    totalUsers: number;
    totalCompanies: number;
    totalJobs: number;
};

const AdminDashboard = () => {
    const user = useSelector((state: RootState) => state.user);

    // State để lưu trữ thống kê tổng quan
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        totalJobs: 0,
    });

    // State để lưu trữ thống kê theo tháng
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]); // Lưu trữ dữ liệu thống kê theo tháng
    const [selectedMonth, setSelectedMonth] = useState<string>(''); // Tháng đã chọn

    // State để lưu trữ danh sách người dùng và công ty
    const [userList, setUserList] = useState<User[]>([]);
    const [companyList, setCompanyList] = useState<Company[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch thống kê tổng quan
                const statsResponse = await axios.get('http://localhost:8080/user/admin/dashboard');
                setStats(statsResponse.data);  // Lưu trữ thống kê
                
                // Fetch thống kê theo tháng
                const monthlyStatsResponse = await axios.get('http://localhost:8080/user/admin/monthlystats');
                setMonthlyStats(monthlyStatsResponse.data);  // Lưu trữ thống kê theo tháng

                // Fetch danh sách người dùng
                const usersResponse = await axios.get('http://localhost:8080/user/alluser');
                setUserList(usersResponse.data.data);  // Lưu trữ danh sách người dùng

                // Fetch danh sách công ty
                const companiesResponse = await axios.get('http://localhost:8080/companies/admin/companies');
                setCompanyList(companiesResponse.data);  // Lưu trữ danh sách công ty
                
                setLoading(false);  // Đặt loading thành false khi dữ liệu đã được lấy
            } catch (err) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu.');
                setLoading(false);  // Dừng loading ngay cả khi có lỗi
            }
        };

        fetchDashboardData();
    }, []); // Chỉ chạy một lần khi component được render lần đầu tiên

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Dữ liệu biểu đồ tổng quan
    const chartData = {
        labels: selectedMonth ? ['Người dùng', 'Công ty', 'Công việc'] : ['Người dùng', 'Công ty', 'Công việc'], // Nhãn cho biểu đồ
        datasets: [
            {
                label: selectedMonth ? `Tháng ${selectedMonth}` : 'Tổng quan', // Dựa vào tháng đã chọn
                data: selectedMonth
                    ? monthlyStats
                        .filter((item) => item.month === selectedMonth)
                        .map((item) => [item.totalUsers, item.totalCompanies, item.totalJobs])
                        .flat()
                    : [stats.totalUsers, stats.totalCompanies, stats.totalJobs], // Dữ liệu tổng quan
                backgroundColor: ['#4B9CD3', '#4CAF50', '#FFEB3B'], // Màu sắc cho các cột
                borderColor: ['#2C6FAF', '#388E3C', '#FBC02D'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: selectedMonth ? `Thống kê tháng ${selectedMonth}` : 'Thống kê tổng quan', // Tiêu đề động
            },
            legend: {
                display: false, // Tắt hiển thị legend
            },
        },
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-4">Chào mừng, {user.full_name}!</h2>
            <p className="mb-6">Đây là trang tổng quan của Admin.</p>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="p-4 bg-green-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Công ty đã đăng ký</h3>
                    <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                </div>
                <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Công việc đang tuyển</h3>
                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                </div>
            </div>

            {/* Dropdown chọn tháng */}
            <div className="mb-6">
                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="p-2 border rounded-md"
                >
                    <option value="">Tổng quan</option>
                    {monthlyStats.map((item, index) => (
                        <option key={index} value={item.month}>
                            Tháng {item.month}
                        </option>
                    ))}
                </select>
            </div>

            {/* Biểu đồ */}
            <div className="mb-6">
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Danh sách người dùng */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Danh sách người dùng</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {userList.map((user, i) => (
                        <li key={i} className="p-2 bg-white rounded-md shadow-sm">
                            <div className="font-semibold">{user.full_name}</div>
                            <div className="text-sm text-gray-500">Vai trò: {user.role}</div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Danh sách công ty */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Danh sách công ty</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {companyList.map((company, i) => (
                        <li key={i} className="p-2 bg-white rounded-md shadow-sm">
                            <div className="font-semibold">{company.name}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;