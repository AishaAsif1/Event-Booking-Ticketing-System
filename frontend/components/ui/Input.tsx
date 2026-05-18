type InputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  min?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function Input({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  min,
  onChange,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
  id={name}
  name={name}
  type={type}
  value={value}
  placeholder={placeholder}
  min={min}
  onChange={onChange}
  className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
    error
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
  }`}
/>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}