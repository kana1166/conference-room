import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import { getBookings } from "../utils/api";

// モーダルのスタイル設定（必要に応じて調整してください）
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

interface Booking {
  user_id: string;
  room_id: string;
  start_datetime: string;
  end_datetime: string;
  roomName: string;
}

const ExBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    getBookings()
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const calendarEvents = bookings.map((booking) => ({
    title: `Room ${booking.room_id}`,
    start: booking.start_datetime,
    extendedProps: booking,
  }));

  const handleEventClick = (clickInfo: any) => {
    setSelectedBooking(clickInfo.event.extendedProps);
    setModalIsOpen(false);
    setTimeout(() => {
      setModalIsOpen(true);
    }, 0);
    console.log("Event clicked: ", clickInfo.event.startStr);
  };

  const closeModal = () => {
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
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
            <p>
              End Time:{" "}
              {new Date(selectedBooking.end_datetime).toLocaleTimeString(
                "ja-JP",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
            <button onClick={closeModal}>escクリック</button>
          </>
        )}
      </Modal>
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking, index) => (
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

export default ExBookingList;
