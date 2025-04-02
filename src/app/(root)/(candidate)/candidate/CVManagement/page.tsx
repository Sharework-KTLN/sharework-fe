"use client";

import { useEffect, useState } from "react";
import { Card, Button, Upload, Typography, Row, Col, Empty, Image } from "antd";
import { UploadChangeParam } from "antd/es/upload/interface";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
interface CV {
  id: number;
  name: string;
  image?: string; // ảnh là tùy chọn, có thể không có
  positionApply?: string;
  createdAt?: string;
}

const CVManager = () => {
  const router = useRouter();
  const [uploadedCVs, setUploadedCVs] = useState<{ id: number; name: string }[]>([]);
  const [image, setImage] = useState<string | null>(null); // Khai báo state image
  const [cvData, setCvData] = useState<CV[]>([]); // Khai báo state cvData

  
  useEffect(() => {
    // Lấy dữ liệu CV đã lưu trong sessionStorage
    const savedCvData = JSON.parse(sessionStorage.getItem("cvData") || "[]");
    setCvData(Array.isArray(savedCvData) ? savedCvData : []);

    // Lấy ảnh đã lưu trong sessionStorage và hiển thị
    const savedImage = sessionStorage.getItem("cvImage");
    if (savedImage) {
        setImage(savedImage); // Cập nhật lại ảnh đã lưu
    };
  }, []);

  const createNewCV = () => {
    router.push("/candidate/CVManagement/CV");
  };

  const handleUpload = (info: UploadChangeParam) => {
    const file = info.file;
    const newCV = { id: Date.now(), name: file.name };
    const updatedCVs = [...uploadedCVs, newCV];
    setUploadedCVs(updatedCVs);
    sessionStorage.setItem("uploadedCVs", JSON.stringify(updatedCVs));
  };
  const handleDeleteCV = (index: number) => {
      // Lấy danh sách CV hiện tại từ sessionStorage
    const updatedCvData = JSON.parse(sessionStorage.getItem("cvData") || "[]");
      // Xóa CV tại vị trí chỉ định
    updatedCvData.splice(index, 1);
      // Cập nhật lại sessionStorage với danh sách CV mới
    sessionStorage.setItem("cvData", JSON.stringify(updatedCvData));
      // Cập nhật state cvData để re-render lại giao diện
    setCvData(updatedCvData);
    alert("CV đã được xóa!");
  };

  const handleViewDetails = (cv: CV) => {
    // Chuyển hướng đến trang chi tiết với dữ liệu CV
    router.push(`/candidate/CVManagerment/CV?cvId=${cv.id}`);
  };
  
  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        📄 Quản lý CV
      </Title>

      {/* CV đã tạo */}
      <Card title="CV đã tạo trên hệ thống" style={{ marginBottom: "20px", width: "1100px" }}>
          {cvData.length === 0 ? (
              <Empty description="Bạn chưa tạo CV nào" />
          ) : (
              <Row gutter={[16, 16]}>
                  {cvData.map((cv, index) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={index}>
                          <Card 
                              hoverable
                              style={{ 
                                  background: "#ffffff", 
                                  borderRadius: "8px", 
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                  transition: "transform 0.2s ease-in-out",
                                  width: "100%", // Đảm bảo card chiếm hết chiều rộng
                              }}
                              cover={
                                <Image
                                  src={cv.image}
                                  alt="Avatar"
                                   // Kích thước height bạn muốn
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "8px 8px 0 0",
                                    width:"100%",
                                    height:"150px"
                                  }}
                                />
                              }
                          >
                              <div >
                                  <Title level={4} style={{ marginBottom: "5px" }}>
                                      {cv.name || "Chưa có tiêu đề"}
                                  </Title>
                                  <Text type="secondary" style={{ display: "block" }}>
                                      <strong>Vị trí:</strong> {cv.positionApply || "Chưa có vị trí"}
                                  </Text>
                                  <Text type="secondary" style={{ display: "block", marginBottom: "10px" }}>
                                      <strong>Ngày tạo:</strong> {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : "Không rõ"}
                                  </Text>
                              </div>
                              <div style={{ textAlign: "center", marginTop: "10px"}}>
                                  <Row gutter={8}>
                                      <Col span={12}>
                                          <Button
                                              type="primary"
                                              onClick={()=>handleViewDetails}
                                              style={{ width: "100px", marginRight:"10px" }}
                                          >
                                              Xem chi tiết
                                          </Button>
                                      </Col>
                                      <Col span={12}>
                                          <Button
                                              type="default"
                                              danger={true}
                                              onClick={() => handleDeleteCV(index)}
                                              style={{ width: "100%" }}
                                          >
                                              Xóa
                                          </Button>
                                      </Col>
                                  </Row>
                              </div>
                          </Card>
                      </Col>
                  ))}
              </Row>
          )}
          <div style={{ textAlign: "left", marginTop: "20px" }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={createNewCV}>
                  Tạo mới
              </Button>
          </div>
      </Card>

      {/* CV đã tải lên */}
      <Card title="CV đã tải lên">
        {uploadedCVs.length === 0 ? <Empty description="Bạn chưa tải lên CV nào" /> : uploadedCVs.map((cv) => <p key={cv.id}>{cv.name}</p>)}
        <Upload beforeUpload={() => false} onChange={handleUpload}>
          <Button icon={<UploadOutlined />}>Tải CV lên</Button>
        </Upload>
      </Card>
    </div>
  );
};

export default CVManager;