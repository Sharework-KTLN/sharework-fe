export interface Job {
    id: number;
    title: string;
    required_skills?: string;
    industry?: string;
    salary_range: string;
    salary_type?: string;
    deadline?: string;
    work_type?: string;
    work_location?: string;
    work_schedule?: string;
    description?: string;
    vacancies?: number;
    status?: 'open' | 'closed' | 'expired' | 'draft';
    benefits?: string;
    experience_required?: string;
    company_id?: number;
    recruiter_id: number;
    created_at?: string;
}
