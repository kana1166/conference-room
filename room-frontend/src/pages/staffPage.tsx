import React, { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";
import { getRooms } from "@/utils/api"; // APIを呼び出す関数をインポート
import { useRouter } from "next/router";

interface Room {
  room_id: number;
  room_name: string;
  capacity: number;
  executive: boolean;
  photo_url: string;
}

const StaffPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleReserve = (roomId: number) => {
    router.push(`/reservation?roomId=${roomId}`);
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        {rooms
          .filter((room) => !room.executive)
          .map((room) => (
            <div className="w-1/4 p-2" key={room.room_id}>
              <RoomCard room={room} onReserve={handleReserve} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StaffPage;
