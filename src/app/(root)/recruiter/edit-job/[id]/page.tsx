'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, message } from 'antd';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatDate } from '@/utils/dateUltil';
import { useParams } from 'next/navigation';
import { industries } from '@/constants/industries';

const { Option } = Select;

const EditJobPage = () => {

    const user = useSelector((state: RootState) => state.recruiter);

    const [messageApi, contextHolder] = message.useMessage();


    const [form] = Form.useForm();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/detail/${id}`);
                if (res.status !== 200) {
                    console.log('Không thể tải dữ liệu công việc!');
                    return;
                }
                const job = res.data;

                if (!job) {
                    message.error('Không tìm thấy công việc!');
                    return;
                }

                form.setFieldsValue({
                    title: job.title,
                    required_skills: job.required_skills,
                    experience_required: job.experience_required,
                    education: job.educational_level,
                    position: job.work_level,
                    vacancies: job.vacancies,
                    industry: job.specialize,
                    education_level: job.education_level,
                    salary_range: job.salary_range,
                    salary_type: job.salary_type,
                    deadline: job.deadline ? dayjs(job.deadline) : null,
                    work_type: job.work_type ? [normalizeWorkType(job.work_type)] : [],
                    work_location: job.work_location,
                    work_schedule: job.work_schedule,
                    description: job.description,
                    candidate_required: job.candidate_required,
                    benefits: job.benefits,
                });
            } catch (error) {
                message.error('Không thể tải dữ liệu công việc!');
            }
        };
        if (user.id) {
            fetchJobData();
        }

    }, [id, form, user.id]);

    const normalizeWorkType = (workType: string) => {
        switch (workType.toLowerCase()) {
            case 'toàn thời gian':
            case 'full-time':
                return 'fulltime';
            case 'bán thời gian':
            case 'part-time':
                return 'parttime';
            case 'onsite':
                return 'onsite';
            case 'kết hợp':
            case 'hybrid':
                return 'hybrid';
            default:
                return workType.toLowerCase();
        }
    };

    const handleUpdateJob = async () => {
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
            setLoading(true);
            const token = localStorage.getItem("recruiterToken");

            if (!token) {
                messageApi.error("Bạn cần đăng nhập để cập nhật bài đăng.");
                return;
            }

            // Format lại deadline về định dạng YYYY-MM-DD (nếu cần)
            if (values.deadline && dayjs(String(values.deadline)).isValid()) {
                if (values.deadline && (typeof values.deadline === 'string' || dayjs.isDayjs(values.deadline))) {
                    values.deadline = dayjs(values.deadline).format("YYYY-MM-DD");
                }
            }

            // Gửi request PUT để cập nhật
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Lỗi không xác định khi cập nhật.");
            }

            messageApi.success("Cập nhật thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật bài đăng:", error);
            if (error instanceof Error) {
                messageApi.error(`Cập nhật thất bại! ${error.message}`);
            } else {
                messageApi.error('Cập nhật thất bại! Lỗi không xác định.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh', // Đảm bảo div chiếm hết chiều cao màn hình
            }}
        >
            {contextHolder}
            <div
                style={{
                    width: '90%',
                    // maxWidth: '1200px', // Giới hạn độ rộng tối đa của form
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Đổ bóng
                    padding: '20px',
                    backgroundColor: '#fff',
                }}
            >
                <h2>Chỉnh sửa bài đăng</h2>
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: '20px' }}
                >
                    {/* Vị trí cần tuyển */}
                    <Form.Item name="title" label="Vị trí cần tuyển" rules={[{ required: true }]}>
                        <Input placeholder="Nhập vị trí" />
                    </Form.Item>

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
                            name="education"
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
                            name="position"
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
                            name="industry"
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
                                <Option value="100">100$</Option>
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

                    {/* Trình độ học vấn - Cấp bậc - Kinh nghiệm */}
                    {/* <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item name="education_level" label="Trình độ học vấn" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select placeholder="Chọn trình độ học vấn">
                                <Option value="Không yêu cầu">Không yêu cầu</Option>
                                <Option value="Cao đẳng">Cao đẳng</Option>
                                <Option value="Đại học">Đại học</Option>
                                <Option value="Sau đại học">Sau đại học</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="position_level" label="Cấp bậc" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select placeholder="Chọn cấp bậc">
                                <Option value="Thực tập sinh">Thực tập sinh</Option>
                                <Option value="Nhân viên">Nhân viên</Option>
                                <Option value="Trưởng nhóm">Trưởng nhóm</Option>
                                <Option value="Quản lý">Quản lý</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="experience" label="Kinh nghiệm" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select placeholder="Chọn kinh nghiệm">
                                <Option value="Không yêu cầu">Không yêu cầu</Option>
                                <Option value="Dưới 1 năm">Dưới 1 năm</Option>
                                <Option value="1-2 năm">1 - 2 năm</Option>
                                <Option value="Trên 2 năm">Trên 2 năm</Option>
                            </Select>
                        </Form.Item>
                    </div> */}

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

                    {/* Nút cập nhật */}
                    <Form.Item style={{ textAlign: 'right' }}>
                        <CustomButton
                            text={'Cập nhật'}
                            onClick={handleUpdateJob}
                            backgroundColor="#AF40FF"
                            hoverColor="#5B42F3"
                            textColor="white"
                            style={{
                                width: '150px',
                                fontWeight: '900px',
                                fontFamily: 'Arial, sans-serif',
                                borderRadius: '6px',
                                border: 'none',
                                padding: '10px 20px',
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    </Form.Item>
                </Form>


            </div>

        </div>
    );
};

export default EditJobPage;
