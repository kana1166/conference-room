import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getRoomCapacity, createBooking } from "@/utils/api";

const ReservOfficerPage: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomCapacity, setRoomCapacity] = useState<number | null>(null);
  const [reservationDetails, setReservationDetails] = useState({
    startDateTime: "",
    endDateTime: "",
    mainUserEmployeeNumber: "",
    memberEmployeeNumbers: "",
    guestNames: "",
  });

  useEffect(() => {
    const fetchRoomDetails = async (id: number) => {
      try {
        const capacity = await getRoomCapacity(id);
        setRoomCapacity(capacity);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };

    if (router.query.roomId) {
      const id = Number(router.query.roomId);
      setRoomId(id);
      fetchRoomDetails(id);
    }
  }, [router.query]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setReservationDetails({ ...reservationDetails, [id]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 社員番号から user_id を取得するロジック（適切なAPIエンドポイントを使用）
      const userIdResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/employee_number/${reservationDetails.mainUserEmployeeNumber}`
      );
      if (!userIdResponse.ok) {
        throw new Error("Failed to retrieve user information.");
      }
      const userIdData = await userIdResponse.json();

      // 予約データの構築（user_id を含める）
      const bookingData = {
        user_id: userIdData.user_id,
        room_id: roomId,
        start_datetime: reservationDetails.startDateTime,
        end_datetime: reservationDetails.endDateTime,
        main_user_employee_number: reservationDetails.mainUserEmployeeNumber,
        member_employee_numbers: reservationDetails.memberEmployeeNumbers
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        guest_names: reservationDetails.guestNames
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      // 予約データの送信
      const result = await createBooking(bookingData);
      console.log("予約成功:", result);
      alert("予約完了");
      router.push("/exBookingList");
    } catch (error) {
      console.error("予約エラー:", error);
      alert(
        "エラー: 役員専用のルームのため、主要利用者の社員番号を役員のIDにしてください。"
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        予約フォーム
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 py-6"
      >
        <div className="mb-4">
          <label
            htmlFor="roomId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            部屋番号
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId || ""}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="roomCapacity"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            部屋のキャパシティ
          </label>
          <span className="text-gray-700">
            {roomCapacity !== null ? roomCapacity : "Loading..."}
          </span>
        </div>
        <div className="mb-4">
          <label
            htmlFor="startDateTime"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            開始日時
          </label>
          <input
            type="datetime-local"
            id="startDateTime"
            value={reservationDetails.startDateTime}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endDateTime"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            終了日時
          </label>
          <input
            type="datetime-local"
            id="endDateTime"
            value={reservationDetails.endDateTime}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mainUserEmployeeNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            主要利用者の社員番号
          </label>
          <input
            type="text"
            id="mainUserEmployeeNumber"
            value={reservationDetails.mainUserEmployeeNumber}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="memberEmployeeNumbers"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            参加する社員の社員番号 (カンマ区切り)
          </label>
          <textarea
            id="memberEmployeeNumbers"
            value={reservationDetails.memberEmployeeNumbers}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="guestNames"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            ゲストの名前 (カンマ区切り)
          </label>
          <textarea
            id="guestNames"
            value={reservationDetails.guestNames}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          予約する
        </button>
      </form>
    </div>
  );
};

export default ReservOfficerPage;
