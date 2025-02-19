'use client';

import { Card, Button, Typography, Tag , Image} from "antd";
import { EnvironmentOutlined, MoneyCollectOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;

const RecruitmentInfoDetail = () =>{
    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {/* Job Details Section */}
            <div className="w-full lg:w-3/4">
                <Card className="shadow-md">
                    <Title level={3}>Thực Tập Sinh Game Unity</Title>
                    <div className="flex gap-2 items-center mb-3">
                        <Tag icon={<MoneyCollectOutlined />} color="green">2 - 3 triệu</Tag>
                        <Tag icon={<EnvironmentOutlined />} color="blue">Đà Nẵng</Tag>
                        <Tag color="default">Không yêu cầu kinh nghiệm</Tag>
                    </div>
                    <Button type="primary" className="mb-4">Ứng tuyển ngay</Button>
                    
                    <Title level={4}>Thông tin chi tiết</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            <li>Biết ngôn ngữ Unity</li>
                            <li>Biết họp tác làm việc nhóm, lắng nghe và học hỏi</li>
                            <li>Hỗ trợ người dùng về phần mềm</li>
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
                        <Text strong>Công ty Game Nhất Trí</Text>
                        <br />
                        <Text>Địa chỉ: Tòa Azura, Quận Sơn Trà, Đà Nẵng</Text>
                    </div>
                    </div>

                    <Button type="link" className="mt-3">Xem trang chi tiết</Button>
                </Card>
            </div>
        </div>
    );
}

export default RecruitmentInfoDetail;