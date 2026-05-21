"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AlertMessage from "../../components/ui/AlertMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function validateForm() {
    const newErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
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
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedbackMessage(data.message || "Login failed. Please try again.");
        return;
      }

      login(data.token, data.user);
      router.push("/events");
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
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
            <p className="mt-2 text-gray-600">
              Access your account to book and manage events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {feedbackMessage && (
              <AlertMessage type={feedbackType} message={feedbackMessage} />
            )}

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

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
