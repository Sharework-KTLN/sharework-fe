'use client';
import { Card, Button, Typography, Tag , Image} from "antd";
import { EnvironmentOutlined, MoneyCollectOutlined, ClockCircleOutlined , LaptopOutlined,
    SolutionOutlined , CalendarOutlined , HourglassOutlined, SendOutlined, HeartOutlined, HeartFilled, 
    ExportOutlined} from "@ant-design/icons";
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface Job {
    title: string;
    company: string;
    location: string;
    specialization: string;
    description: string;
    requirement: string;
    jobType: string;
    salary: string;
    create_date: string;
    end_date: string;
    image: string;
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
    color:"gray",
    fontSize:"13px"
};

const info2Style = {
    fontWeight:"bold",
    fontSize:"13px"
};

const RecruitmentInfoDetail = () =>{
    const [job, setJob] = useState<Job | null >(null);
    const [savedJob, setSavedJob] = useState(false);

    useEffect(() => {
        // Lấy dữ liệu từ sessionStorage
        const storedJob = sessionStorage.getItem('selectedJob');
        if (storedJob) {
            setJob(JSON.parse(storedJob)); // Chuyển đổi lại dữ liệu từ string thành object
        }
    }, []);

    // Kiểm tra nếu chưa có job, hiển thị thông báo hoặc placeholder
    if (!job) {
        return <div>Đang tải dữ liệu...</div>;
    }

    const descriptionSentences = job.description.split('.').filter(Boolean);

    const calculateDaysRemaining = (endDate: string) => {
        const today = new Date(); // Lấy ngày hiện tại
        today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00 để tránh sai lệch do thời gian
    
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00 để so sánh chính xác
    
        const timeDifference = end.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Chuyển đổi milliseconds sang ngày
    
        return daysRemaining;
    };

    // Lưu công việc vào sessionStorage
    const handleSaveJob = () => {
        const savedJobs = JSON.parse(sessionStorage.getItem('savedJobs') || '[]');
        savedJobs.push(job); // Thêm công việc vào mảng đã lưu
        sessionStorage.setItem('savedJobs', JSON.stringify(savedJobs)); // Cập nhật lại sessionStorage
        setSavedJob(!savedJob); // Đổi trạng thái đã lưu
    };
    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {/* Job Details Section */}
            <div className="w-full lg:w-3/4">
                <Card className="shadow-md">
                    <Title level={3}>{job.title}</Title>
                    <div className="flex gap-2 items-center mb-3">
                        <Tag icon={<MoneyCollectOutlined />} color="green">{job.salary}</Tag>
                        <Tag icon={<EnvironmentOutlined />} color="blue">{job.location}</Tag>
                        <Tag icon={<HourglassOutlined/>} color="orange">{job.requirement}</Tag>
                        <Tag icon={<ClockCircleOutlined/>} color="default">Còn {calculateDaysRemaining(job.end_date)} ngày đến hạn nộp hồ sơ</Tag>
                    </div>
                    <Button 
                        type="primary" className="mb-4" 
                        style={{background:"#D4421E", fontWeight:"500",marginRight:"10px"}}
                        icon={<SendOutlined/>}
                    >Ứng tuyển ngay</Button>

                    <Button 
                        type="primary" className="mb-4" ghost
                        style={{
                            color: savedJob ? "#D4421E" : "#D4421E", 
                            borderColor: "#D4421E", 
                            fontWeight: "500"
                        }}
                        onClick={handleSaveJob}
                        icon={savedJob ? <HeartFilled style={{ color: "#D4421E" }} /> : <HeartOutlined />} // Đổi icon
                    >{savedJob ? "Đã lưu" : "Lưu tin"} 
                    </Button>
                    
                    <Title level={4}>Thông tin chi tiết</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {descriptionSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>
                    
                    <Title level={4}>Thời gian làm việc</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            <li>8:00 - 17:00 từ thứ 2 đến thứ 6</li>
                            <li>Có thể thực tập tối thiểu 3 ngày/tuần</li>
                        </ul>
                    </div>
                    
                    <Title level={4}>Cách thức ứng tuyển</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
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
                            src="https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"
                            alt="Logo công ty"
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                            />
                        </div>

                        {/* Thông tin công ty */}
                        <div>
                            <Text strong>{job.company}</Text>
                            <br />
                            <Text>Lĩnh vực: {job.specialization}</Text>
                            <br/>
                            <Text>Địa điểm: {job.location}</Text>
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
                <div style={{marginTop:"10px"}}>
                    <Card className="shadow-md p-4">
                        <Title level={4}>Thông tin chung</Title>
                        {/* Chia cột chứa hình ảnh và thông tin */}
                        <div className="flex flex-col gap-4"> {/* Thêm flex-col để sắp xếp theo cột */}
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <SolutionOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Học vấn</span>
                                    <span className="block" style={info2Style}>Đại học trở lên</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    < LaptopOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2"> {/* Sử dụng flex-col cho 2 span xuống dòng */}
                                    <span className="block" style={info1Style}>Hình thức làm việc</span>
                                    <span className="block" style={info2Style}>{job.jobType}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <CalendarOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Hạn nộp hồ sơ</span>
                                    <span className="block" style={info2Style}>{job.end_date}</span>
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