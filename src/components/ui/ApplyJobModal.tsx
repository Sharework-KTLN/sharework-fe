// components/ApplyJobModal.tsx
'use client';

import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface ApplyJobModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  jobTitle: string;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ open, onCancel, onSubmit, jobTitle }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.cv = fileList;
      onSubmit(values);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      // validation error, do nothing
    }
  };

  const uploadProps = {
    beforeUpload: (file: unknown) => {
      setFileList([file as UploadFile]);
      return false; // prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title={
        <div>
          <span>Ứng tuyển: </span>
          <span style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold', marginLeft: 4 }}>
            {jobTitle}
          </span>
        </div>
      }

      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Nộp đơn ứng tuyển
        </Button>,
      ]}
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ fullName: '', email: '', phone: '', coverLetter: '' }}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Tải CV">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Chọn tệp CV</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Thư giới thiệu"
            name="coverLetter"
            rules={[{ required: true, message: 'Vui lòng nhập thư giới thiệu' }]}
          >
            <Input.TextArea placeholder="Viết thư giới thiệu..." rows={6} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ApplyJobModal;
