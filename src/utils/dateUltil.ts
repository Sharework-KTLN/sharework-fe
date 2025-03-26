import dayjs,{Dayjs} from 'dayjs';

/**
 * Format ngày tháng theo định dạng dd-MM-YYYY
 * @param date Ngày cần format (có thể là string hoặc object của dayjs)
 * @returns Chuỗi ngày tháng theo định dạng dd-MM-YYYY
 */
export const formatDate = (date: string | number | Date | Dayjs | null | undefined): string | null => {
    return date ? dayjs(date).format('DD-MM-YYYY') : null;
};

/**
 * Chuyển đổi chuỗi ngày thành object của dayjs (dùng để hiển thị lại trong DatePicker)
 * @param dateString Chuỗi ngày tháng (ví dụ: "25-03-2025")
 * @returns Object dayjs
 */
export const parseDate = (dateString: string) => {
    return dateString ? dayjs(dateString, 'DD-MM-YYYY') : null;
};
