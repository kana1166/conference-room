import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import { getBookings, getRooms } from "../utils/api";

// Room と Booking のインターフェース
interface Room {
  room_id: string;
  room_name: string;
  capacity: number;
  executive: boolean;
  photo_url: string;
}

interface Booking {
  user_id: string;
  room_id: string;
  start_datetime: string;
  end_datetime: string;
  roomName: string;
}

// モーダルのスタイル設定
const customStyles = {
  content: {
    top: "50%",
    left: "70%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "#fff",
  },
};

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchRoomsAndBookings = async () => {
      try {
        const roomsData = await getRooms();
        setRooms(roomsData);
        const bookingsData = await getBookings();
        setBookings(bookingsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsAndBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    rooms.some((room) => room.room_id === booking.room_id && !room.executive)
  );

  const calendarEvents = filteredBookings.map((booking) => ({
    title: `Room ${booking.room_id}`,
    start: booking.start_datetime,
    extendedProps: booking,
  }));

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked");
    setSelectedBooking(clickInfo.event.extendedProps);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalIsOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Booking List and Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={calendarEvents}
        eventClick={handleEventClick}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {selectedBooking && (
          <>
            <h2>予約詳細</h2>
            <p>Room Name: {selectedBooking.room_id}</p>
            <p>
              Start Time:{" "}
              {new Date(selectedBooking.start_datetime).toLocaleTimeString(
                "ja-JP",
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>
            <p>
              End Time:{" "}
              {new Date(selectedBooking.end_datetime).toLocaleTimeString(
                "ja-JP",
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>

            <button onClick={closeModal}>escクリック</button>
          </>
        )}
      </Modal>
      <h2>Bookings</h2>
      <ul>
        {filteredBookings.map((booking, index) => (
          <li key={index}>
            Room: {booking.room_id}, Start:{" "}
            {new Date(booking.start_datetime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            , End:{" "}
            {new Date(booking.end_datetime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
