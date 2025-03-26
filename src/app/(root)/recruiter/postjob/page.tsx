'use client';
import React from 'react'
import { formatDate } from '@/utils/dateUltil';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Avatar, DatePicker } from 'antd';
import CustomButton from '@/components/CustomButton'


const { Option } = Select;

const page = () => {

    const [form] = Form.useForm();

    const handleButtonPostJob = () => {
        alert('Đăng bài tuyển dụng thành công!');
    };

    const onFinish = (values: any) => {
        console.log('Form Data:', values);
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
                        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Hiệp Phan</p>
                        <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                            Mã nhà tuyển dụng:
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            hiepphannguyen123abc@gmail.com
                        </p>
                    </div>
                </div>

                {/* Phần thông tin công ty (50%) */}
                <div style={{ width: '50%' }}>
                    <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Tên công ty:</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'black', margin: '4px 0' }}>Hoa hồng đen group</p>
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
                    onFinish={onFinish}
                    style={{
                        marginTop: '20px'
                    }}
                >
                    {/* Vị trí cần tuyển */}
                    <Form.Item name="position" label="Vị trí cần tuyển" rules={[{ required: true, message: 'Hãy nhập vị trí!' }]}>
                        <Input placeholder="Nhập vị trí" />
                    </Form.Item>

                    {/* Yêu cầu kỹ năng & Số lượng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item name="skills" label="Yêu cầu kỹ năng" style={{ flex: 1 }}>
                            <Input placeholder="Nhập kỹ năng yêu cầu" />
                        </Form.Item>
                        <Form.Item name="quantity" label="Số lượng" style={{ flex: 1 }}>
                            <Input type="number" placeholder="Nhập số lượng" />
                        </Form.Item>
                    </div>

                    {/* Lĩnh vực, Mức lương, Hình thức lương, Hạn bài đăng */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item name="field" label="Lĩnh vực" style={{ flex: 1 }}>
                            <Select>
                                <Option value="it">Công nghệ thông tin</Option>
                                <Option value="marketing">Marketing</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="salary" label="Mức lương" style={{ flex: 1 }}>
                            <Select>
                                <Option value="negotiable">Thỏa thuận</Option>
                                <Option value="100">100$</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="salaryType" label="Hình thức lương" style={{ flex: 1 }}>
                            <Select>
                                <Option value="vnd_month">VND/tháng</Option>
                                <Option value="vnd_week">VND/tuần</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="deadline" label="Hạn bài đăng" style={{ flex: 1 }}>
                            <DatePicker
                                format="DD-MM-YYYY"
                                placeholder="Chọn ngày"
                                onChange={(date) => console.log('Ngày đã chọn:', formatDate(date))}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>

                    {/* Hình thức làm việc */}
                    <Form.Item name="workType" label="Hình thức làm việc">
                        <div>
                            <label><input type="checkbox" value="fulltime" /> Full-time</label> &nbsp;
                            <label><input type="checkbox" value="parttime" /> Part-time</label> &nbsp;
                            <label><input type="checkbox" value="onsite" /> Onsite</label> &nbsp;
                            <label><input type="checkbox" value="hybrid" /> Hybrid</label>
                        </div>
                    </Form.Item>

                    {/* Địa chỉ làm việc */}
                    <Form.Item name="workAddress" label="Địa chỉ làm việc">
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
                    <Form.Item name="timeWorking" label="Thời gian làm việc">
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
                    <Form.Item name="description" label="Mô tả công việc">
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
                            text="Gửi tin tuyển dụng"
                            onClick={handleButtonPostJob}
                            backgroundColor="green" hoverColor="darkgreen"
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
    )
}

export default page
