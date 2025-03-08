"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau it nhat 6 ky tu"),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log("Thong tin dang nhap:", data);
    setTimeout(() => {
      router.push("/main");
    }, 1000);
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-black/80 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Dang nhap
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm">Mat khau</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 py-2 rounded text-white font-semibold transition-all"
          >
            {isSubmitting ? "Dang dang nhap..." : "Dang nhap"}
          </button>
        </form>
      </div>
    </div>
  );
}
