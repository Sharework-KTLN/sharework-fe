'use client';

import React from 'react';
import { formatDate } from '@/utils/dateUltil';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { Form, Input, Select, Avatar, DatePicker } from 'antd';
import CustomButton from '@/components/CustomButton';
import { Company } from '@/types/company';
import { industries } from '@/constants/industries';


const { Option } = Select;

const PostJobPage = () => {

    const [form] = Form.useForm();
    const user = useSelector((state: RootState) => state.user);
    const [company, setCompany] = useState<Company | null>(null);

    // Gọi API để lấy thông tin công ty ngay khi component được render
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const companyRes = await fetch(`http://localhost:8080/companies/recruiter/${user.id}`);

                if (!companyRes.ok) {
                    throw new Error("Không tìm thấy công ty của bạn!");
                }

                const companyData = await companyRes.json();
                setCompany(companyData); // Lưu thông tin công ty vào state
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu công ty:", error);
            }
        };

        if (user?.id) {
            fetchCompany();
        }
    }, [user?.id]); // Chỉ chạy lại khi user.id thay đổi

    const handleButtonPostJob = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const onFinish = async (values: Record<string, unknown>) => {
        try {
            // console.log("values", values);
            // alert("Đăng bài tuyển dụng thành công!");
            // 🔹 Gọi API để tạo bài đăng
            const response = await fetch("http://localhost:8080/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    recruiter_id: user?.id, // 🔥 Thay bằng ID thật nếu có
                    company_id: company?.id,   // 🔥 Thay bằng ID thật nếu có
                }),
            });
            const data = await response.json();

            if (response.ok) {
                alert("Đăng bài tuyển dụng thành công!");
                form.resetFields();  // 🔥 Xóa dữ liệu trong form sau khi đăng thành công
            } else {
                alert("Lỗi khi đăng bài: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi request:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };
    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#F5F4F9',
                paddingTop: '5px',
                msOverflowY: 'scroll',
                padding: '20px',
            }}
        >
            <div
                style={{
                    width: '90%',
                    height: '100px',
                    marginLeft: '5%',
                    border: '1px solid rgba(0, 0, 0, 0.1)', // Màu border mềm hơn
                    borderRadius: '12px', // Bo góc mềm mại
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    gap: '20px', // Khoảng cách giữa các phần
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Thêm hiệu ứng đổ bóng
                }}
            >
                {/* Phần Avatar + Thông tin nhà tuyển dụng (50%) */}
                <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                    <Avatar
                        size={70}
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Recruiter Avatar"
                    />
                    <div style={{ marginLeft: '15px' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{user.full_name}</p>
                        <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                            Mã nhà tuyển dụng:
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Phần thông tin công ty (50%) */}
                <div style={{ width: '50%' }}>
                    <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Tên công ty:</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'black', margin: '4px 0' }}>
                        {company?.name}
                    </p>
                </div>
            </div>

            <div
                style={{
                    width: '90%',
                    minHeight: '100vh', // ✅ Cho phép mở rộng theo nội dung
                    marginLeft: '5%',
                    marginTop: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.1)', // Màu border mềm hơn
                    borderRadius: '12px', // Bo góc mềm mại
                    backgroundColor: '#FFF',
                    padding: '20px',
                    overflowY: 'auto', // ✅ Kích hoạt thanh cuộn nếu nội dung quá dài
                    display: 'flex',
                    flexDirection: 'column', // ✅ Đảm bảo Form không bị kéo dài
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Thêm hiệu ứng đổ bóng
                }}
            >
                <p
                    className='text-base font-bold mt-2'
                >
                    Nhu cầu tuyển dụng của bạn là gì?
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    style={{
                        marginTop: '20px'
                    }}
                >
                    {/* Vị trí cần tuyển */}
                    <Form.Item
                        name="title"
                        label="Vị trí cần tuyển"
                        rules={[{ required: true, message: 'Hãy nhập vị trí!' }]}
                    >
                        <Input placeholder="Nhập vị trí" />
                    </Form.Item>

                    {/* Yêu cầu kỹ năng & Số lượng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name="required_skills"
                            label="Yêu cầu kỹ năng"
                            style={{ flex: 2 }}
                            rules={[{ required: true, message: 'Hãy nhập kỹ năng yêu cầu!' }]}
                        >
                            <Input placeholder="Nhập kỹ năng yêu cầu" />
                        </Form.Item>

                        <Form.Item
                            name="experience_required"
                            label="Kinh nghiệm"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn kinh nghiệm!' }]}
                        >
                            <Select placeholder="Chọn kinh nghiệm">
                                <Option value="no_experience">Không yêu cầu kinh nghiệm</Option>
                                <Option value="<1">Dưới 1 năm</Option>
                                <Option value="1-2">1 - 2 năm</Option>
                                <Option value="2-3">2 - 3 năm</Option>
                                <Option value="3-4">3 - 4 năm</Option>
                                <Option value="4-5">4 - 5 năm</Option>
                                <Option value=">5">Trên 5 năm</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="educational_level"
                            label="Học vấn"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn học vấn!' }]}
                        >
                            <Select placeholder="Chọn học vấn">
                                <Option value="university">Đại học</Option>
                                <Option value="college">Cao đẳng</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="work_level"
                            label="Cấp bậc"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn cấp bậc!' }]}
                        >
                            <Select placeholder="Chọn cấp bậc">
                                <Option value="intern">Thực tập sinh</Option>
                                <Option value="staff">Nhân viên</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="vacancies"
                            label="Số lượng"
                            style={{ flex: 1 }}
                        >
                            <Input type="number" placeholder="Nhập số lượng" />
                        </Form.Item>
                    </div>

                    {/* Lĩnh vực, Mức lương, Hình thức lương, Hạn bài đăng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name="specialize"
                            label="Lĩnh vực"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn lĩnh vực!' }]}
                        >
                            <Select placeholder="Chọn lĩnh vực">
                                {industries.map((item) => (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="salary_range"
                            label="Mức lương"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn mức lương!' }]}
                        >
                            <Select>
                                <Option value="negotiable">Thỏa thuận</Option>
                                <Option value="<10_trieu">Dưới 10 triệu</Option>
                                <Option value="10-15_trieu">10 - 15 triệu</Option>
                                <Option value="15-20_trieu">15 - 20 triệu</Option>
                                <Option value="20-25_trieu">20 - 25 triệu</Option>
                                <Option value=">30_trieu">Trên 30 triệu</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="work_type"
                            label="Hình thức làm việc"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn hình thức làm việc!' }]}
                        >
                            <Select placeholder="Chọn hình thức làm việc">
                                <Option value="full_time">Toàn thời gian</Option>
                                <Option value="part_time">Bán thời gian</Option>
                                <Option value="remote">Làm việc từ xa</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="deadline"
                            label="Hạn bài đăng"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn hạn bài đăng!' }]}
                        >
                            <DatePicker
                                format="DD-MM-YYYY"
                                placeholder="Chọn ngày"
                                onChange={(date) => console.log('Ngày đã chọn:', formatDate(date))}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>

                    {/* Mô tả công việc */}
                    <Form.Item
                        name="description"
                        label="Mô tả công việc"
                    >
                        <Input.TextArea
                            placeholder="Nhập mô tả công việc"
                            rows={4}
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Yêu cầu ứng viên */}
                    <Form.Item
                        name="candidate_required"
                        label="Yêu cầu ứng viên"
                    >
                        <Input.TextArea
                            placeholder="Nhập yêu cầu ứng viên"
                            rows={4}
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Thời gian làm việc */}
                    <Form.Item
                        name="work_schedule"
                        label="Thời gian làm việc"
                    >
                        <Input.TextArea
                            placeholder="Nhập thời gian làm việc"
                            rows={2}
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Quyền lợi */}
                    <Form.Item
                        name="benefits"
                        label="Quyền lợi"
                    >
                        <Input.TextArea
                            placeholder="Nhập quyền lợi"
                            rows={4}
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Địa chỉ làm việc */}
                    <Form.Item
                        name="work_location"
                        label="Địa chỉ làm việc"
                    >
                        <Input.TextArea
                            placeholder="Nhập địa chỉ"
                            rows={4}
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Submit Button */}
                    <Form.Item
                        style={{ textAlign: 'right' }}
                    >
                        <CustomButton
                            text="Đăng tuyển"
                            onClick={handleButtonPostJob}
                            backgroundColor="#AF40FF" // Xanh dương nhẹ
                            hoverColor="#5B42F3" // Xanh dương đậm hơn khi hover
                            textColor="white"
                            style={{
                                width: '150px',
                                fontWeight: '900px',
                                fontFamily: 'Arial, sans-serif',
                                right: 0,
                                borderRadius: '6px', // Bo góc nhẹ cho nút
                                border: 'none', // Loại bỏ border
                                padding: '10px 20px', // Thêm padding để nút rộng hơn
                                transition: 'background-color 0.3s ease', // Hiệu ứng chuyển màu mượt mà
                            }}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default PostJobPage;
