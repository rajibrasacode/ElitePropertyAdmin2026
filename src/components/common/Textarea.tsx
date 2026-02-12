import React from "react";
import { useTheme } from "@/providers/ThemeProvider";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  className = "",
  required = false,
  ...props
}) => {
  const { currentTheme } = useTheme();

  const textareaStyle = `
        w-full rounded-lg border p-3 text-sm outline-none 
        focus:border-blue-500 resize-none transition-all
        ${className}
    `;

  return (
    <textarea
      name={name}
      className={textareaStyle}
      style={{
        backgroundColor: currentTheme.background,
        borderColor: currentTheme.borderColor,
        color: currentTheme.textColor,
      }}
      {...props}
    />
  );
};
