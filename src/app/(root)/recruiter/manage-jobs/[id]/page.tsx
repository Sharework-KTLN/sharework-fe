"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { Job } from "@/types/job";
import { Company } from "@/types/company";

export default function JobDetailPage() {

    const router = useRouter();

    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobRes = await fetch(`http://localhost:8080/jobs/job/${id}`);
                if (!jobRes.ok) throw new Error("Lỗi khi tải công việc");
                const jobData = await jobRes.json();
                setJob(jobData);

                if (jobData.company_id) {
                    const companyRes = await fetch(`http://localhost:8080/companies/${jobData.company_id}`);
                    if (!companyRes.ok) throw new Error("Lỗi khi tải công ty");
                    const companyData = await companyRes.json();
                    setCompany(companyData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-bold">Đang tải...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-bold text-red-500">Không tìm thấy công việc</p>
            </div>
        );
    }

    const handleButtonEditPost = (post_id: number) => {
        router.push(`/recruiter/edit-job/${post_id}`);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
                {company?.logo && (
                    <Image src={company.logo} alt="Logo công ty" width={80} height={80} className="rounded-full" />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                    <p className="text-lg text-gray-600">{company?.name || "Không có thông tin công ty"}</p>
                </div>
            </div>

            {/* Thông tin công việc */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold text-gray-700">Thông tin công việc</h2>
                <div className="grid grid-cols-2 gap-4 mt-3 text-gray-600">
                    <p><strong>💰 Mức lương:</strong> {job.salary_range} ({job.salary_type})</p>
                    <p><strong>📍 Địa điểm:</strong> {job.work_location}</p>
                    <p><strong>🕒 Hình thức:</strong> {job.work_type}</p>
                    <p><strong>⏳ Hạn nộp:</strong> {dayjs(job.deadline).format("DD-MM-YYYY")}</p>
                </div>
            </div>

            {/* Mô tả công việc */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold text-gray-700">📋 Mô tả công việc</h2>
                <p className="mt-2 text-gray-600">{job.description}</p>
            </div>

            {/* Yêu cầu kỹ năng */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold text-gray-700">🛠 Yêu cầu kỹ năng</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(job.required_skills ?? "").split(",").map((skill, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            </div>

            {/* Phúc lợi */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold text-gray-700">🎁 Phúc lợi</h2>
                <p className="mt-2 text-gray-600">{job.benefits}</p>
            </div>

            {/* Hành động */}
            <div className="flex justify-end gap-4 mt-8">
                <button className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition duration-300">
                    Ẩn bài đăng
                </button>
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => handleButtonEditPost(job.id)}
                >
                    Chỉnh sửa bài đăng ✏️
                </button>
            </div>
        </div>
    );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import dayjs from "dayjs";
// import { Job } from "@/types/job";
// import { Company } from '@/types/company';
// export default function JobDetailPage() {
//     const { id } = useParams();
//     const [job, setJob] = useState<Job | null>(null);
//     const [company, setCompany] = useState<Company | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const jobRes = await fetch(`http://localhost:8080/jobs/job/${id}`);
//                 if (!jobRes.ok) throw new Error("Lỗi khi tải công việc");
//                 const jobData = await jobRes.json();
//                 console.log("jobdata:", jobData.company_id);
//                 setJob(jobData);
//                 if (jobData.company_id) {
//                     const companyRes = await fetch(`http://localhost:8080/companies/${jobData.company_id}`);
//                     if (!companyRes.ok) throw new Error("Lỗi khi tải công ty");
//                     const companyData = await companyRes.json();
//                     setCompany(companyData);
//                 }
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();

//     }, [id]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <p className="text-lg font-bold">Đang tải...</p>
//             </div>
//         );
//     }

//     if (!job) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <p className="text-lg font-bold text-red-500">Không tìm thấy công việc</p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             {/* Hero Section */}
//             <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg text-center">
//                 <h1 className="text-3xl font-bold">{job.title}</h1>
//                 <p className="mt-2 text-lg">{company?.name || "Thông tin công ty không khả dụng"}</p>
//             </div>

//             {/* Thông tin tổng quan */}
//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//                 {/* <div className="flex items-center gap-4">
//           {company.logo && (
//             <Image src={job.company.logo} alt="Logo công ty" width={50} height={50} className="rounded-full" />
//           )}
//           <div>
//             <h2 className="text-xl font-bold">{job.company.name}</h2>
//             <p className="text-gray-500">{job.industry}</p>
//           </div>
//         </div> */}

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                     <p className="text-gray-700"><strong>💰 Mức lương:</strong> {job.salary_range} ({job.salary_type})</p>
//                     <p className="text-gray-700"><strong>📍 Địa điểm:</strong> {job.work_location}</p>
//                     <p className="text-gray-700"><strong>🕒 Hình thức:</strong> {job.work_type}</p>
//                     <p className="text-gray-700"><strong>⏳ Hạn nộp:</strong> {dayjs(job.deadline).format("DD-MM-YYYY")}</p>
//                 </div>
//             </div>

//             {/* Mô tả công việc */}
//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//                 <h2 className="text-2xl font-bold text-indigo-600">📋 Mô tả công việc</h2>
//                 <p className="mt-2 text-gray-700">{job.description}</p>
//             </div>

//             {/* Yêu cầu kỹ năng */}
//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//                 <h2 className="text-2xl font-bold text-indigo-600">🛠 Yêu cầu kỹ năng</h2>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                     {(job.required_skills ?? "").split(",").map((skill, index) => (
//                         <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
//                             {skill.trim()}
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Phúc lợi */}
//             <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
//                 <h2 className="text-2xl font-bold text-indigo-600">🎁 Phúc lợi</h2>
//                 <p className="mt-2 text-gray-700">{job.benefits}</p>
//             </div>

//             {/* Nút Ứng tuyển */}
//             <div className="text-center mt-8">
//                 <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition duration-300">
//                     Ứng tuyển ngay 🚀
//                 </button>
//             </div>
//         </div>
//     );
// }
