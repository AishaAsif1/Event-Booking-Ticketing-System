"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { apiFetch } from "../../lib/api";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ATTENDEE" | "ORGANISER";
};

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ATTENDEE",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function validateForm() {
    const newErrors: RegisterErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 12) {
      newErrors.password = "Password must be at least 12 characters.";
    } else if (formData.password.length > 64) {
      newErrors.password = "Password must be at most 64 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackMessage("");

    if (!validateForm()) {
      setFeedbackType("error");
      setFeedbackMessage("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Registration failed. Please try again.");
        return;
      }

      setFeedbackType("success");
      setFeedbackMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setFeedbackType("error");
      setFeedbackMessage("Could not reach the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-gray-600">
              Register as an attendee or organiser.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {feedbackMessage && (
              <AlertMessage type={feedbackType} message={feedbackMessage} />
            )}

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              placeholder="Enter your full name"
              error={errors.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              error={errors.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              placeholder="Enter your password"
              error={errors.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                  errors.role
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="ORGANISER">Organiser</option>
              </select>

              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
