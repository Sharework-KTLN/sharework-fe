'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const AdminDashboard = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="p-6 bg-white rounded-lg shadow overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-4">Chào mừng, {user.full_name}!</h2>
            <p className="mb-6">Đây là trang tổng quan của Admin.</p>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
                    <p className="text-2xl font-bold">1,245</p>
                </div>
                <div className="p-4 bg-green-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Công ty đã đăng ký</h3>
                    <p className="text-2xl font-bold">325</p>
                </div>
                <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Công việc đang tuyển</h3>
                    <p className="text-2xl font-bold">892</p>
                </div>
            </div>

            {/* Danh sách người dùng */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Danh sách người dùng</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {[...Array(20)].map((_, i) => (
                        <li key={i} className="p-2 bg-white rounded-md shadow-sm">Người dùng {i + 1}</li>
                    ))}
                </ul>
            </div>

            {/* Danh sách công ty */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Danh sách công ty</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {[...Array(15)].map((_, i) => (
                        <li key={i} className="p-2 bg-white rounded-md shadow-sm">Công ty {i + 1}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
// 'use client';

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';

// const AdminDashboard = () => {
//     const user = useSelector((state: RootState) => state.user);

//     return (
//         <div className="p-6 bg-white rounded-lg shadow">
//             <h2 className="text-2xl font-bold mb-4">Chào mừng, {user.full_name}!</h2>
//             <p>Đây là trang tổng quan của Admin.</p>
//         </div>
//     );
// };

// export default AdminDashboard;
