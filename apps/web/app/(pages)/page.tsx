"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Trang chủ</h1>
      <button
        onClick={() => router.push("/login")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Đăng nhập
      </button>
    </div>
  );
}
