export interface Job {
    id: number;
    title: string;                        // Vị trí cần tuyển
    required_skills?: string;            // Yêu cầu kỹ năng (có thể null)
    specialize?: string;                 // Lĩnh vực cần tuyển
    salary_range: string;                // Mức lương
    salary_type?: string;                // (có thể null nếu không dùng)
    educational_level?: string;          // Trình độ học vấn
    work_level?: string;                 // Cấp bậc làm việc
    deadline?: string;                   // Hạn bài đăng (ISO date string)
    work_type?: string;                  // Hình thức làm việc
    work_location?: string;              // Địa chỉ làm việc
    work_schedule?: string;              // Thời gian làm việc
    description?: string;                // Mô tả công việc
    vacancies?: number;                  // Số lượng tuyển
    status?: 'open' | 'closed' | 'expired' | 'draft'; // Trạng thái công việc
    benefits?: string;                   // Phúc lợi
    experience_required?: string;        // Kinh nghiệm yêu cầu
    candidate_required?: string;         // Yêu cầu ứng viên
    company_id?: number;                 // ID công ty
    recruiter_id: number;                // ID nhà tuyển dụng
    created_at?: string;                 // Ngày tạo (tuỳ API trả về)
  }
  