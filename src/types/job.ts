export interface Job {
    id: number;
    title: string;                          // Vị trí cần tuyển
    required_skills?: string;              // Yêu cầu kỹ năng(có thể null)
    specialize?: string;                   // Lĩnh vực cần tuyển
    salary_range: string;                  // Mức lương
    educational_level?: string;            // Trình độ học vấn
    work_level?: string;                   // Cấp bậc làm việc
    deadline?: string;                     // Hạn bài đăng (date dạng string ISO)
    work_type?: string;                    // Hình thức làm việc
    work_location?: string;                // Địa chỉ làm việc
    work_schedule?: string;                // Thời gian làm việc
    description?: string;                  // Mô tả công việc
    vacancies?: number;                    // Số lượng tuyển dụng
    status?: 'open' | 'closed' | 'expired' | 'draft'; // Trạng thái công việc
    approval_status?: 'Approved' | 'Pending' | 'Rejected'; // Trạng thái phê duyệt
    benefits?: string;                     // Phúc lợi công việc
    experience_required?: string;          // Kinh nghiệm yêu cầu
    candidate_required?: string;           // Yêu cầu ứng viên
    company_id?: number;                   // Công ty đăng tuyển
    recruiter_id: number;                  // Nhà tuyển dụng đăng bài
    createdAt?: string;                   // Ngày tạo bài (nếu backend có)
  }
  
