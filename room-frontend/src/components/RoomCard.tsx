// RoomCard.tsx
export interface Room {
  room_id: number;
  room_name: string;
  capacity: number;
  executive: boolean;
  photo_url: string;
  // 他の必要なフィールド...
}

interface RoomCardProps {
  room: Room;
  onReserve: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onReserve }) => {
  return (
    <div className="mb-4 p-4 border rounded">
      <h2 className="text-lg font-bold text-center">
        会議室: {room.room_name}
      </h2>
      {room.photo_url && (
        <img
          src={room.photo_url}
          alt={`Photo of ${room.room_name}`}
          className="my-2 block mx-auto"
        />
      )}
      <p className="text-center">最大人数: {room.capacity}名</p>
      <div className="text-center">
        <button
          onClick={() => onReserve(room.room_id)}
          className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border border-blue-700"
        >
          予約する
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
