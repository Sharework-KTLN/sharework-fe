'use client';
import { Card, Button, Typography, Tag, Image } from "antd";
import {
    EnvironmentOutlined, MoneyCollectOutlined, ClockCircleOutlined, LaptopOutlined,
    SolutionOutlined, CalendarOutlined, HourglassOutlined, SendOutlined, HeartOutlined, HeartFilled,
    ExportOutlined, RiseOutlined, TeamOutlined
} from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomButton from "@/components/CustomButton";

const { Title, Text } = Typography;

interface Job {
    id: number;
    title: string;
    description: string;
    status: string;
    approval_status: string;
    experience_required: string;
    salary_range: string;
    work_location: string; // Địa chỉ làm việc (thay vì location)
    created_at: string;
    updated_at: string;
    company_id: number;
    recruiter_id: number;
    required_skills: string; // Yêu cầu kỹ năng
    specialize: string; // Lĩnh vực cần tuyển
    salary_type: string; // Hình thức lương (net/gross, theo giờ/tháng, v.v.)
    deadline: string; // Hạn bài đăng
    work_type: string; // Hình thức làm việc (toàn thời gian, bán thời gian, remote, v.v.)
    work_schedule: string; // Thời gian làm việc
    vacancies: number; // Số lượng tuyển dụng
    benefits: string; // Phúc lợi công việc
    educational_level: string; // Trình độ học vấn
    work_level: string; // Cấp bậc làm việc
    candidate_required: string; // Yêu cầu ứng viên
    company_name: string; // Tên công ty
    company_logo: string;
    recruiter: string; // Tên người tuyển dụng
}

const iconStyle = {
    backgroundColor: "#52c41a", // Màu nền cho icon
    borderRadius: "50%", // Tạo hình tròn
    padding: "8px", // Khoảng cách bên trong vòng tròn
    display: "flex", // Đảm bảo icon nằm giữa vòng tròn
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    marginRight: "8px"
};

const info1Style = {
    color: "gray",
    fontSize: "13px"
};

const info2Style = {
    fontWeight: "bold",
    fontSize: "13px"
};

const RecruitmentInfoDetail = () => {
    const searchParams = useSearchParams(); // Use this to get search params
    const id = searchParams.get('id');
    const [jobDetails, setJobDetails] = useState<Job | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return; // Chờ cho đến khi id có sẵn

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch job details");
                }
                const data = await response.json();
                setJobDetails(data); // Lưu thông tin chi tiết công ty vào state
            } catch (error) {
                console.error("Error fetching company details:", error);
                setError("Unable to load company details.");
            }
        };

        fetchJobDetails();
    }, [id]); // Gọi lại khi id thay đổi

    if (error) {
        return <div>{error}</div>;
    }

    if (!jobDetails) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    const descriptionSentences = jobDetails.description.split('.').filter(Boolean);
    const work_ScheduleSentences = jobDetails.work_schedule.split('.').filter(Boolean);
    const required_SkillsSentences = jobDetails.required_skills.split('.').filter(Boolean);
    const benifitsSentences = jobDetails.benefits.split(/(?<!\d)\.(?!\d)/).map(s => s.trim()).filter(Boolean);
    const candidate_requiredSentences = jobDetails.candidate_required.split('.').filter(Boolean);

    const calculateDaysRemaining = (endDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        const timeDifference = end.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (daysRemaining < 0) {
            return "Đã hết hạn nộp hồ sơ";
        }

        return `Còn ${daysRemaining} ngày đến hạn nộp hồ sơ`;
    };

    const handleApproveJob = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/approve/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Bài đăng ${id} đã được duyệt.`);
                // Gọi lại API để cập nhật trạng thái bài đăng
                const updated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${id}`);
                const data = await updated.json();
                setJobDetails(data); // Cập nhật state
            } else {
                console.error(`Duyệt bài thất bại: ${response.status}`);
            }
        } catch (error) {
            console.error('Lỗi duyệt bài:', error);
        }
    };

    const handleRejectJob = async (id: number) => {
        try {
            // Gửi yêu cầu PATCH để cập nhật trạng thái approval_status thành "Rejected"
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/reject/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Bài đăng ${id} đã bị từ chối.`);
                // Sau khi từ chối thành công, gọi lại API để cập nhật trạng thái bài đăng
                const updated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${id}`);
                const data = await updated.json();
                setJobDetails(data); // Cập nhật state với thông tin bài đăng đã cập nhật
            } else {
                console.error(`Từ chối bài thất bại: ${response.status}`);
            }
        } catch (error) {
            console.error('Lỗi từ chối bài:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {/* Job Details Section */}
            <div className="w-full lg:w-3/4">
                <Card className="shadow-md">
                    <Title level={3}>{jobDetails.title}</Title>
                    <div className="flex gap-2 items-center mb-3">
                        <Tag icon={<MoneyCollectOutlined />} color="green">{jobDetails.salary_range}</Tag>
                        <Tag icon={<EnvironmentOutlined />} color="blue">{jobDetails.work_location}</Tag>
                        <Tag icon={<HourglassOutlined />} color="orange">{jobDetails.experience_required}</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="default">{calculateDaysRemaining(jobDetails.deadline)}</Tag>
                    </div>

                    {jobDetails.approval_status !== "Approved" && jobDetails.approval_status !== "Rejected" && (
                        <div className="flex gap-2 mb-3">
                            <CustomButton
                                text="Duyệt"
                                onClick={() => handleApproveJob(Number(id))}
                                backgroundColor="#4CAF50"
                                hoverColor="#388E3C"
                                textColor="white"
                                style={{
                                    width: '80px',
                                    height: '40px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    borderRadius: '6px',
                                    border: 'none',
                                    transition: 'background-color 0.3s ease',
                                }}
                            />

                            <CustomButton
                                text="Từ chối"
                                onClick={() => handleRejectJob(Number(id))}
                                backgroundColor="orange"
                                hoverColor="darkorange"
                                textColor="white"
                                style={{
                                    width: '120px',
                                    height: '40px',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    borderRadius: '6px',
                                    border: 'none',
                                    transition: 'background-color 0.3s ease',
                                }}
                            />
                        </div>
                    )}
                    <Title level={4}>Mô tả công việc</Title>
                    <div style={{ marginTop: "-7px", marginBottom: "7px" }}>
                        <ul className="list-disc pl-5">
                            {descriptionSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Yêu cầu ứng viên</Title>
                    <div style={{ marginTop: "-7px", marginBottom: "7px" }}>
                        <ul className="list-disc pl-5">
                            {required_SkillsSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                            {candidate_requiredSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Thời gian làm việc</Title>
                    <div style={{ marginTop: "-7px", marginBottom: "7px" }}>
                        <ul className="list-disc pl-5">
                            {work_ScheduleSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Quyền lợi</Title>
                    <div style={{ marginTop: "-7px", marginBottom: "7px" }}>
                        <ul className="list-disc pl-5">
                            {benifitsSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Cách thức ứng tuyển</Title>
                    <div style={{ marginTop: "-7px", marginBottom: "7px" }}>
                        <ul className="list-disc pl-5">
                            <li>Gửi CV qua trang đăng tuyển</li>
                            <li>Hoặc gửi email cho công ty</li>
                        </ul>
                    </div>
                </Card>
            </div>

            {/* Company Section */}
            <div className="w-full lg:w-1/4">
                <div>
                    <Card className="shadow-md p-4">
                        <Title level={4}>Công ty</Title>
                        {/* Chia cột chứa hình ảnh và thông tin */}
                        <div className="flex items-center gap-4">
                            {/* Ảnh công ty */}
                            <div className="w-16 h-16">
                                <Image
                                    src={jobDetails.company_logo}
                                    alt={jobDetails.company_name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover"
                                    preview={false}
                                />
                            </div>

                            {/* Thông tin công ty */}
                            <div>
                                <Text strong>{jobDetails.company_name}</Text>
                                <br />
                                <Text>Lĩnh vực: {jobDetails.specialize}</Text>
                                <br />
                                <Text>Địa điểm: {jobDetails.work_location}</Text>
                            </div>
                        </div>
                        <Button
                            type="link"
                            className="mt-3"
                            style={{ color: "#D4421E", fontWeight: "500" }}
                        >
                            Xem trang chi tiết <ExportOutlined />
                        </Button>
                    </Card>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <Card className="shadow-md p-4">
                        <Title level={4}>Thông tin chung</Title>
                        {/* Chia cột chứa hình ảnh và thông tin */}
                        <div className="flex flex-col gap-4"> {/* Thêm flex-col để sắp xếp theo cột */}
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <RiseOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Cấp bậc</span>
                                    <span className="block" style={info2Style}>{jobDetails.work_level}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <SolutionOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Học vấn</span>
                                    <span className="block" style={info2Style}>{jobDetails.educational_level}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <TeamOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Số lượng tuyển</span>
                                    <span className="block" style={info2Style}>{jobDetails.vacancies} người</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    < LaptopOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2"> {/* Sử dụng flex-col cho 2 span xuống dòng */}
                                    <span className="block" style={info1Style}>Hình thức làm việc</span>
                                    <span className="block" style={info2Style}>{jobDetails.work_type}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <CalendarOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Hạn nộp hồ sơ</span>
                                    <span className="block" style={info2Style}>
                                        {jobDetails.deadline?.split('T')[0].split('-').reverse().join('/')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentInfoDetail;