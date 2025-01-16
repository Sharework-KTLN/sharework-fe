import React from 'react';

interface CustomButtonProps {
    text: string; // Nội dung hiển thị trên nút
    onClick: () => void; // Hàm callback khi nhấn nút
    backgroundColor?: string; // Màu nền
    hoverColor?: string; // Màu nền khi hover
    textColor?: string; // Màu chữ
    style?: React.CSSProperties; // Bổ sung style nếu cần
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    onClick,
    backgroundColor = 'blue',
    hoverColor = 'darkblue',
    textColor = 'white',
    style = {},
}) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '2px 5px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: backgroundColor,
                color: textColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                // fontSize: 'clamp(12px, 3vw, 18px)',
                ...style,
            }}
            onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = backgroundColor)
            }
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            {text}
        </button>
    );
};

export default CustomButton;