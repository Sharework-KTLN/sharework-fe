'use client';

import React from 'react';
import Image from 'next/image';
import { Select, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import CustomButton from '@/components/CustomButton';

const { Option } = Select;

// Dữ liệu mẫu
const candidates = [
    {
        id: 1,
        name: "Hiệp Phan",
        university: "Đại học Công nghiệp",
        skills: ["Figma", "Excel", "Photoshop"],
        email: "hiep@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 2,
        name: "Lan Nguyễn",
        university: "Đại học Bách Khoa",
        skills: ["React", "Node.js", "JavaScript"],
        email: "lannguyen@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 3,
        name: "Minh Trần",
        university: "Đại học Kinh tế",
        skills: ["Excel", "PowerPoint", "Data Analysis"],
        email: "minhtran@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 4,
        name: "Bảo Lê",
        university: "Đại học Sư phạm",
        skills: ["Java", "Spring Boot", "SQL"],
        email: "baole@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 5,
        name: "Hà Linh",
        university: "Đại học Công nghệ",
        skills: ["Python", "Machine Learning", "AI"],
        email: "haling@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 6,
        name: "Hoàng Nam",
        university: "Đại học FPT",
        skills: ["C#", "Unity", "Game Development"],
        email: "hoangnam@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 7,
        name: "Thủy Tiên",
        university: "Đại học Hoa Sen",
        skills: ["Digital Marketing", "SEO", "Google Ads"],
        email: "thuytien@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 8,
        name: "Quốc Bảo",
        university: "Đại học Văn Lang",
        skills: ["PHP", "Laravel", "MySQL"],
        email: "quocbao@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
    {
        id: 9,
        name: "Duy Khánh",
        university: "Đại học Quốc tế",
        skills: ["Android", "Kotlin", "Firebase"],
        email: "duykhanh@gmail.com",
        avatar: "/assets/images/default-avatar.webp",
    },
];

const RecruiterHomePage = () => {
    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                background: '#F5F4F9', // Gradient nhẹ nhàng
                padding: '20px',
                display: 'flex',
                flexDirection: 'column', // Các phần khác sẽ nằm dưới vùng tìm kiếm
                gap: '20px', // Giãn cách giữa các phần
            }}
        >
            {/* Vùng tìm kiếm */}
            <div
                style={{
                    width: '100%',
                    height: '100px', // ✅ Giữ cố định chiều cao
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden', // ✅ Đảm bảo không bị kéo dài
                }}
            >
                {/* Chọn tỉnh/thành phố */}
                <Select placeholder="Chọn tỉnh/thành phố" style={{ flex: 1 }}>
                    <Select.Option value="hanoi">Hà Nội</Select.Option>
                    <Select.Option value="hcm">TP. Hồ Chí Minh</Select.Option>
                    <Select.Option value="danang">Đà Nẵng</Select.Option>
                </Select>

                {/* Chọn chuyên môn */}
                <Select placeholder="Chọn chuyên môn" style={{ flex: 1 }}>
                    <Select.Option value="it">Công nghệ thông tin</Select.Option>
                    <Select.Option value="marketing">Marketing</Select.Option>
                    <Select.Option value="design">Thiết kế đồ họa</Select.Option>
                </Select>

                {/* Chọn skill */}
                <Select placeholder="Chọn kỹ năng" style={{ flex: 1 }}>
                    <Select.Option value="react">React.js</Select.Option>
                    <Select.Option value="node">Node.js</Select.Option>
                    <Select.Option value="figma">Figma</Select.Option>
                </Select>

                {/* Nút Tìm kiếm */}
                <CustomButton
                    text="Tìm kiếm"
                    backgroundColor="#007BFF"
                    hoverColor="#0056b3"
                    textColor="white"
                    style={{
                        width: '120px',
                        fontSize: 14,
                        fontWeight: 'bold',
                        padding: '10px 15px',
                        borderRadius: '5px'
                    }}
                    onClick={() => { alert('Tìm kiếm...'); }}
                />
            </div>

            {/* Các phần khác của trang (nằm dưới vùng tìm kiếm) */}

            {/* Banner */}
            <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                <Image
                    src="/assets/images/banner-recruiter-homepage.webp"
                    alt="Recruiter Home Banner"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <p
                className='text-5sm ml-2'
            >
                Tìm kiếm ứng viên tìm năng:
            </p>
            {/* Danh sách ứng viên */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 ứng viên mỗi hàng
                    gap: "20px",
                }}
            >
                {candidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#F8F9FA",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease", // Hiệu ứng chuyển động
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                        onClick={() => alert(`Bạn đã chọn ứng viên: ${candidate.name}`)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0, 0, 0, 0.1)";
                        }}
                    >
                        {/* Avatar từ Ant Design */}
                        <Avatar size={60} icon={<UserOutlined />} />

                        {/* Thông tin ứng viên */}
                        <div style={{ marginLeft: "15px", flex: 1 }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px" }}>
                                {candidate.name}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#555", marginBottom: "3px" }}>
                                <strong>Trường:</strong> {candidate.university}
                            </p>
                            <p style={{ fontSize: "14px", color: "#555", marginBottom: "3px" }}>
                                <strong>Chuyên môn:</strong> {candidate.skills.join(", ")}
                            </p>
                            <p style={{ fontSize: "14px", color: "#007BFF" }}>
                                <strong>Liên hệ:</strong> {candidate.email}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h2>Các phần khác của trang...</h2>
            </div>
        </div>
    );
};

export default RecruiterHomePage;
