import React from 'react';

interface CustomButtonProps {
    text: string;
    onClick: () => void;
    backgroundColor?: string;
    hoverColor?: string;
    textColor?: string;
    style?: React.CSSProperties;
    disabled?: boolean; // ✅ Thêm prop này
    children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    onClick,
    backgroundColor = 'blue',
    hoverColor = 'darkblue',
    textColor = 'white',
    style = {},
    disabled = false, // ✅ Default false
    children,
}) => {
    const baseStyle: React.CSSProperties = {
        backgroundColor: disabled ? '#ccc' : backgroundColor,
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
    };

    const combinedStyle: React.CSSProperties = {
        ...baseStyle,
        ...style,
    };

    return (
        <button
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            style={combinedStyle}
            onMouseOver={(e) => {
                if (!disabled) e.currentTarget.style.backgroundColor = hoverColor;
            }}
            onMouseOut={(e) => {
                if (!disabled) e.currentTarget.style.backgroundColor = backgroundColor;
            }}
            onMouseDown={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {children}
            <span>{text}</span>
        </button>
    );
};

export default CustomButton;