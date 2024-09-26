/** @format */

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";
import { useRouter } from "next/router";

interface GuestUser {
  guest_user_id: string;
  name: string;
  booking_id: string;
}
interface Booking {
  booking_id: string;
  start_datetime: string;
  end_datetime: string;
  room_id: number;
  user_id: number;
}

const GuestPage: React.FC = () => {
  const [guestUsers, setGuestUsers] = useState<(GuestUser & Booking)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGuestUsers = async () => {
      try {
        // ゲストユーザー情報を取得
        const guestData = await fetchAPI("/guest_users/");
        // すべての予約情報を取得
        const bookingsData = await fetchAPI("/bookings/");

        // 各ゲストユーザーに対応する予約情報をフィルタリング
        const combinedData = guestData.map((user: GuestUser) => {
          const booking = bookingsData.find(
            (b: Booking) => b.booking_id === user.booking_id
          );
          return { ...user, ...booking }; // ゲストユーザー情報と予約情報をマージ
        });

        setGuestUsers(combinedData);
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
              <p className="text-lg font-semibold">{user.name}様</p>
              <p>予約ID: {user.booking_id}</p>
              {user.start_datetime && user.end_datetime ? (
                <>
                  <p>
                    開始日時:{" "}
                    {new Date(user.start_datetime).toLocaleString("ja-JP", {
                      month: "long", // 月 (何月)
                      day: "numeric", // 日 (何日)
                      hour: "numeric", // 時 (何時)
                      minute: "numeric", // 分 (何分)
                    })}
                  </p>
                  <p>
                    終了日時:{" "}
                    {new Date(user.end_datetime).toLocaleString("ja-JP", {
                      month: "long", // 月 (何月)
                      day: "numeric", // 日 (何日)
                      hour: "numeric", // 時 (何時)
                      minute: "numeric", // 分 (何分)
                    })}
                  </p>
                </>
              ) : (
                <p>予約情報が見つかりませんでした。</p>
              )}
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
