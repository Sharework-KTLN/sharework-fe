'use client';

import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadFile, RcFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ApplyJobModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: unknown) => void;
  jobTitle: string;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ open, onCancel, onSubmit, jobTitle }) => {

  const user = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id'); // 👈 jobId = "1"

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (fileList.length === 0 || !fileList[0].originFileObj) {
        messageApi.error('Vui lòng chọn file CV hợp lệ!');
        return;
      }
      console.log('fileList: ', fileList);
      const formData = new FormData();
      formData.append('cv', fileList[0].originFileObj as File); // 👈 Thêm dòng log sau đây để xem chi tiết

      // 👇 THÊM DỮ LIỆU BỔ SUNG
      formData.append('fullName', values.fullName || '');
      formData.append('email', values.email || '');
      formData.append('phone', values.phone || '');
      formData.append('coverLetter', values.coverLetter || '');
      formData.append('jobId', jobId || '');
      formData.append('candidateId', user.id?.toString() || '');

      console.log("📤 FormData appended with CV and metadata");
      // Gửi API upload lên Cloudinary
      const uploadResponse = await fetch('http://localhost:8080/applications/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      console.log("📤 Upload pdf file response: ", result);

      if (!uploadResponse.ok) {
        setLoading(false);
        throw new Error(result.error || 'Upload thất bại');
      }

      messageApi.success("Ứng tuyển công việc thành công!", 1);

      onSubmit(values);

      form.resetFields();
      setFileList([]);
      onCancel();
    } catch (error) {
      // validation error, do nothing
      console.log('Validation failed on handle ok function:', error);
      messageApi.error((error as Error)?.message || 'Vui lòng nhập đầy đủ thông tin!', 1);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();     // reset toàn bộ dữ liệu đã nhập trong form
    setFileList([]);        // xoá file đã chọn
    onCancel();             // gọi hàm từ props để đóng modal
  };


  const uploadProps = {
    beforeUpload: (file: RcFile) => {
      const uploadFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done', // hoặc 'uploading' nếu muốn hiển thị đang tải
        originFileObj: file,
      };
      setFileList([uploadFile]);
      return false; // Ngăn auto upload
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
  };

  return (
    <>
      {contextHolder}

      {/* Overlay loading toàn màn hình */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      )}

      <Modal
        open={open}
        onCancel={handleCancel}
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
          <Button key="cancel" onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Nộp đơn ứng tuyển
          </Button>,
        ]}
      >
        {/* Nội dung Form... */}
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

            <Form.Item
              label="Tải CV"
              required
              validateStatus={fileList.length === 0 ? 'error' : 'success'}
              help={fileList.length === 0 ? 'Vui lòng chọn file CV' : ''}
            >
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
      {/* Đây là code chưa xử lý phần loading nên tạm thời comment */}
      {/* {contextHolder}
      <Spin spinning={loading} >
        <Modal
          open={open}
          onCancel={handleCancel}
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
            <Button key="cancel" onClick={handleCancel}>
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

              <Form.Item
                label="Tải CV"
                required
                validateStatus={fileList.length === 0 ? 'error' : 'success'}
                help={fileList.length === 0 ? 'Vui lòng chọn file CV' : ''}
              >
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
      </Spin> */}
    </>

  );
};

export default ApplyJobModal;
