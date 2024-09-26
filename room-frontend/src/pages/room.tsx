// pages/rooms.js

import { useEffect, useState } from "react";
import { getRooms } from "../utils/api";

interface Room {
  id: string;
  name: string;
}

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      }
    };

    loadRooms();
  }, []);

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </div>
  );
};

export default RoomsPage;
