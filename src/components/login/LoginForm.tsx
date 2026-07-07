"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { AxiosError } from "axios";
import PasswordInput from "@/components/login/PasswordInput";
import SocialButton from "@/components/login/SocialButton";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [remember, setRemember] = useState(true);

  const loginMutation = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          toast.success("Welcome back to Social Hub.");
          router.push("/feed");
        },
        onError: (error) => {
          console.error("Login failed:", error);

          const axiosError = error as AxiosError<{
            message?: string;
            error?: string;
          }>;

          const apiMessage =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            "Login failed. Please try again.";

          setErrorMessage(apiMessage);
          toast.error(apiMessage);
        },
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-linear-to-br from-white to-white dark:from-white/3 dark:to-white/5 rounded-2xl p-6 border border-white/6 backdrop-blur-md shadow-lg"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-300">Welcome back</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">Sign in to continue to Social Hub</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-300"><Mail size={16} /></span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl bg-black/5 dark:bg-white/3 border border-black/20 dark:border-white/6 px-10 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-zinc-500"
            />
          </div>
        </label>

        <label className="block text-sm">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-300"><Lock size={16} /></span>
              <PasswordInput value={password} onChange={setPassword} placeholder="Password" />
            
          </div>
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded-sm bg-white/5 border-white/6"
            />
            <span className="text-zinc-700 dark:text-zinc-300">Remember me</span>
          </label>

          <Link href="/forgot" className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline">
            Forgot password?
          </Link>
        </div>
        {errorMessage && (
            <p className="text-xs text-center mt-1 text-red-300" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-xl py-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.01] transform transition text-white font-semibold shadow-md disabled:opacity-60"
        >
          {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-black/6 dark:bg-white/6" />
          <div className="text-xs text-zinc-600 dark:text-zinc-500">OR</div>
          <div className="flex-1 h-px bg-black/6 dark:bg-white/6" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <SocialButton>
            <svg width="16" height="16" viewBox="0 0 48 48" className="opacity-95"><path fill="currentColor" d="M44.5 20H24v8.9h11.9C34.9 33.9 30 38 24 38c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.8 0 7.3 1.4 9.9 3.7l6.7-6.7C37.1 3.9 30.8 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23 23-10.3 23-23c0-1.6-.2-3.1-.5-4.5z"/></svg>
            Continue with Google
          </SocialButton>

          <SocialButton>
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-95"><path fill="currentColor" d="M12 .5C5.7.5.9 5.3.9 11.6c0 4.7 3 8.8 7.2 10.2.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.3-1.5-1.3-1.5-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.9 1.8.9 1.8.2 1.8 2 1.3 2.5 1 .1-.8.4-1.3.7-1.6-2.3-.3-4.7-1.2-4.7-5.3 0-1.2.4-2.2 1-3-.1-.3-.5-1.5.1-3.1 0 0 .8-.2 2.8 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c2-.1 2.8-1 2.8-1 .6 1.6.2 2.8.1 3.1.6.8 1 1.8 1 3 0 4.1-2.4 5-4.7 5.3.4.3.8 1 .8 2v3c0 .3.2.6.7.5 4.2-1.4 7.2-5.5 7.2-10.2C23.1 5.3 18.3.5 12 .5z"/></svg>
            Continue with GitHub
          </SocialButton>
        </div>
      </form>
    </motion.div>
  );
}
