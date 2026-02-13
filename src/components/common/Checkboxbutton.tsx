import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface CheckboxButtonProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxButton: React.FC<CheckboxButtonProps> = ({
  name,
  label,
  checked,
  onChange,
}) => {
  const { currentTheme } = useTheme();

  return (
    <label
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all w-full select-none
            ${checked ? "shadow-md transform scale-[1.02]" : "hover:bg-black/5"}`}
      style={{
        borderColor: checked ? "transparent" : currentTheme.borderColor,
        backgroundColor: checked ? currentTheme.primary : "transparent",
        color: checked ? "#fff" : currentTheme.textColor,
      }}
    >
      <div className={`text-xl ${checked ? "text-white" : "opacity-40"}`}>
        {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
      </div>
      <span className={`text-sm font-bold ${checked ? "text-white" : ""}`}>
        {label}
      </span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};
