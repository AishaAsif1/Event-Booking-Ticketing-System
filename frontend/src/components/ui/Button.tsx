type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  const baseClasses =
    "rounded-lg px-6 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const widthClass = fullWidth ? "w-full" : "";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${widthClass} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}