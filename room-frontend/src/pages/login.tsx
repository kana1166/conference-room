// pages/login.tsx
import { useState, FormEvent } from "react";
import Router from "next/router";

export default function Login() {
  const [employee_number, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://54.87.195.13:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ヘッダーをapplication/jsonに変更
        },
        body: JSON.stringify({
          employee_number,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "ログインに失敗しました。ゲストの方はゲストログインをお試しください"
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      const payload = data.access_token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log("Decoded JWT Payload:", decodedPayload);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", decodedPayload.role);

      if (decodedPayload.role === "役員" || decodedPayload.role === "管理者") {
        Router.push("/officer");
      } else {
        Router.push("/staffPage");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="employeeNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            社員番号:
          </label>
          <input
            type="text"
            id="employeeNumber"
            value={employee_number}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            パスワード:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
