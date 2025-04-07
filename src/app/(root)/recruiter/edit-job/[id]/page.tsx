'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, message } from 'antd';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

const { Option } = Select;

const EditJobPage = () => {

    const [messageApi, contextHolder] = message.useMessage();


    const [form] = Form.useForm();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/jobs/job/${id}`);
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
                    vacancies: job.vacancies,
                    industry: job.industry,
                    salary_range: job.salary_range,
                    salary_type: job.salary_type,
                    deadline: job.deadline ? dayjs(job.deadline) : null,
                    work_type: job.work_type ? [normalizeWorkType(job.work_type)] : [],
                    work_location: job.work_location,
                    work_schedule: job.work_schedule,
                    description: job.description,
                });
            } catch (error) {
                message.error('Không thể tải dữ liệu công việc!');
            }
        };

        fetchJobData();
    }, [id, form]);

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
            console.log('Dữ liệu mới nhất:', values);
            setLoading(true);

            messageApi.success('Cập nhật thành công!');
        } catch (error) {
            messageApi.error('Cập nhật thất bại!');
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
                <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
                    <Form.Item name="title" label="Vị trí cần tuyển" rules={[{ required: true }]}>
                        <Input placeholder="Nhập vị trí" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item name="required_skills" label="Yêu cầu kỹ năng" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Input placeholder="Nhập kỹ năng yêu cầu" />
                        </Form.Item>
                        <Form.Item name="vacancies" label="Số lượng" style={{ flex: 1 }}>
                            <Input type="number" placeholder="Nhập số lượng" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item name="industry" label="Lĩnh vực" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select>
                                <Option value="Software">Công nghệ thông tin</Option>
                                <Option value="Marketing">Marketing</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="salary_range" label="Mức lương" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select>
                                <Option value="Thỏa thuận">Thỏa thuận</Option>
                                <Option value="20-30 triệu">20 - 30 triệu</Option>
                                <Option value="10-20 triệu">10 - 20 triệu</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="salary_type" label="Hình thức lương" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Select>
                                <Option value="Tháng">VND/tháng</Option>
                                <Option value="Tuần">VND/tuần</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="deadline" label="Hạn bài đăng" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item name="work_type" label="Hình thức làm việc" rules={[{ required: true }]}>
                        <Select mode="multiple" placeholder="Chọn hình thức làm việc">
                            <Option value="fulltime">Full-time</Option>
                            <Option value="parttime">Part-time</Option>
                            <Option value="onsite">Onsite</Option>
                            <Option value="hybrid">Hybrid</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="work_location" label="Địa chỉ làm việc">
                        <Input.TextArea placeholder="Nhập địa chỉ" autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Form.Item>

                    <Form.Item name="work_schedule" label="Thời gian làm việc">
                        <Input.TextArea placeholder="Nhập thời gian làm việc" autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả công việc">
                        <Input.TextArea placeholder="Nhập mô tả công việc" autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Form.Item>

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
