export function Button({ children, onClick, disabled, variant = "default" }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "danger";
}) {
  const baseStyle = "px-4 py-2 rounded-md font-semibold transition duration-200";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
