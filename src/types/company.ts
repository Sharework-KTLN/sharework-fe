export interface Company {
    id: number;
    name: string;                   // Tên công ty
    address?: string;              // Địa chỉ chi tiết
    phone: string;                 // Số điện thoại
    email: string;                 // Email công ty
    logo?: string;                 // Logo công ty
    image_company?: string;        // Hình ảnh đại diện công ty
    description?: string;          // Mô tả công ty
    specialize?: string;           // Chuyên môn công ty
    job_count?: number;            // Số lượng công việc
    location?: string;             // Địa chỉ không chi tiết
    recruiter_id?: number;         // Nhà tuyển dụng đại diện
    link?: string;                 // Website hoặc liên kết khác
    created_at?: string;           // Ngày tạo bản ghi (nếu có)
  }