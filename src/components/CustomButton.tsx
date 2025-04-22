import React from 'react';

interface CustomButtonProps {
    text: string; // Nội dung hiển thị trên nút
    onClick: () => void; // Hàm callback khi nhấn nút
    backgroundColor?: string; // Màu nền
    hoverColor?: string; // Màu nền khi hover
    textColor?: string; // Màu chữ
    style?: React.CSSProperties; // Bổ sung style nếu cần
    children?: React.ReactNode; // <-- thêm dòng này để nhận children
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    onClick,
    backgroundColor = 'blue',
    hoverColor = 'darkblue',
    textColor = 'white',
    style = {},
    children, // <-- nhận children
}) => {
    const baseStyle: React.CSSProperties = {
        backgroundColor,
        color: textColor,
        border: '1px solid transparent',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: '1.5rem',
        fontFamily: `sans-serif`,
        textAlign: 'center',
        userSelect: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
    };

    // Kết hợp style mặc định + style truyền vào
    const combinedStyle: React.CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <button
            onClick={onClick}
            style={combinedStyle}
            onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = backgroundColor)
            }
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            {children}
            <span>{text}</span>
        </button>
    );
};

export default CustomButton;