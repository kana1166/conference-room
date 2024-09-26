/** @format */

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";
import { useRouter } from "next/router";

interface GuestUser {
  guest_user_id: string;
  name: string;
  booking_id: string;
}

const GuestPage: React.FC = () => {
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGuestUsers = async () => {
      try {
        const data = await fetchAPI("/guest_users/");
        setGuestUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuestUsers();
  }, []);

  if (loading) return <p>Loading...</p>; // ローディング中のメッセージ
  if (error) return <p>Error: {error}</p>; // エラーメッセージ

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">ゲストユーザー一覧</h1>
      <div className="p-6">
        {guestUsers.length > 0 ? (
          guestUsers.map((user) => (
            <div
              key={user.guest_user_id}
              className="border-b border-gray-200 py-4"
            >
              <p className="text-lg font-semibold">{user.name}</p>
              <p>予約ID: {user.booking_id}</p>
            </div>
          ))
        ) : (
          <p>No guest users found.</p> // データがない場合のメッセージ
        )}
      </div>
      <div className="text-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoHome}
        >
          Homeに戻る
        </button>
      </div>
    </>
  );
};

export default GuestPage;
