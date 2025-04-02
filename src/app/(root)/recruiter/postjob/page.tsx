'use client';

import React from 'react';
import { formatDate } from '@/utils/dateUltil';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { Form, Input, Select, Avatar, DatePicker } from 'antd';
import CustomButton from '@/components/CustomButton';
import { Company } from '@/types/company';


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
                    border: '1px solid gray',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 20px',
                    gap: '20px', // Khoảng cách giữa các phần
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
                    border: '1px solid gray',
                    borderRadius: '5px',
                    backgroundColor: '#FFF',
                    padding: '20px',
                    overflowY: 'auto', // ✅ Kích hoạt thanh cuộn nếu nội dung quá dài
                    display: 'flex',
                    flexDirection: 'column', // ✅ Đảm bảo Form không bị kéo dài
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
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy nhập kỹ năng yêu cầu!' }]}
                        >
                            <Input placeholder="Nhập kỹ năng yêu cầu" />
                        </Form.Item>
                        <Form.Item
                            name="vacancies"
                            label="Số lượng"
                            style={{ flex: 1 }}
                        // rules={[{ required: true, type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }]}
                        >
                            <Input type="number" placeholder="Nhập số lượng" />
                        </Form.Item>
                    </div>

                    {/* Lĩnh vực, Mức lương, Hình thức lương, Hạn bài đăng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name="industry"
                            label="Lĩnh vực"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn lĩnh vực!' }]}
                        >
                            <Select>
                                <Option value="it">Công nghệ thông tin</Option>
                                <Option value="marketing">Marketing</Option>
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
                                <Option value="100">100$</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="salary_type"
                            label="Hình thức lương"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Hãy chọn hình thức lương!' }]}
                        >
                            <Select>
                                <Option value="vnd_month">VND/tháng</Option>
                                <Option value="vnd_week">VND/tuần</Option>
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

                    {/* Hình thức làm việc */}
                    <Form.Item
                        name="work_type"
                        label="Hình thức làm việc"
                        rules={[{ required: true, message: 'Hãy chọn ít nhất 1 hình thức làm việc!' }]}
                    >
                        <div>
                            <label><input type="checkbox" value="fulltime" /> Full-time</label> &nbsp;
                            <label><input type="checkbox" value="parttime" /> Part-time</label> &nbsp;
                            <label><input type="checkbox" value="onsite" /> Onsite</label> &nbsp;
                            <label><input type="checkbox" value="hybrid" /> Hybrid</label>
                        </div>
                    </Form.Item>

                    {/* Địa chỉ làm việc */}
                    <Form.Item
                        name="work_location"
                        label="Địa chỉ làm việc"
                    >
                        <Input.TextArea
                            placeholder="Nhập địa chỉ"
                            autoSize={{ minRows: 2, maxRows: 5 }} // Tuỳ chỉnh độ cao
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
                            autoSize={{ minRows: 2, maxRows: 5 }} // Tuỳ chỉnh độ cao
                            style={{
                                fontSize: '14px', // Kích thước chữ
                                fontFamily: 'Arial, sans-serif', // Font chữ
                                fontWeight: '500px' // Độ đậm của chữ (tùy chỉnh nếu cần)
                            }}
                        />
                    </Form.Item>
                    {/* Mô tả công việc việc */}
                    <Form.Item
                        name="description"
                        label="Mô tả công việc"
                    >
                        <Input.TextArea
                            placeholder="Nhập mô tả công việc"
                            autoSize={{ minRows: 2, maxRows: 5 }} // Tuỳ chỉnh độ cao
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
                            backgroundColor="green"
                            hoverColor="darkgreen"
                            textColor="white"
                            style={{
                                width: '150px',
                                fontSize: 15,
                                fontWeight: 'bold',
                                font: 'Arial, sans-serif',
                                right: 0,
                            }}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default PostJobPage;
