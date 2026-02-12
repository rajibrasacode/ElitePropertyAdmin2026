import React from "react";
import { useTheme } from "@/providers/ThemeProvider";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: string[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  options,
  ...props
}) => {
  const { currentTheme } = useTheme();

  const inputStyle = `
        w-full h-[42px] rounded-lg border px-3 pl-10 text-sm outline-none transition-all
        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    `;

  return (
    <select
      name={name}
      className={inputStyle}
      style={{
        backgroundColor: currentTheme.background,
        borderColor: currentTheme.borderColor,
        color: currentTheme.textColor,
      }}
      {...props}
    >
      <option value="" disabled>
        Select an option
      </option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};
