import Header from "@/components/Header";
import RoomCard from "@/components/RoomCard";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getRooms } from "../utils/api";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface Room {
  room_id: number;
  room_name: string;
  capacity: number;
  executive: boolean;
  photo_url: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
} else {
  console.log("Firebase was already initialized");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const ExecutivePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const emailQuery = query(
          collection(db, "allowedUsers"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(emailQuery);
        if (!querySnapshot.empty) {
          try {
            const roomsData = await getRooms();
            setRooms(roomsData);
          } catch (error) {
            console.error("Error fetching rooms:", error);
          }
        } else {
          alert("アクセス権限がありません。");
          signOut(auth);
          router.push("/");
        }
      }
    });
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Googleログインに失敗しました:", error);
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded shadow-md">
          <button
            onClick={handleGoogleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  const handleReserve = (roomId: number) => {
    router.push(`/reservOfficer?roomId=${roomId}`);
    console.log("Reserving room with ID:", roomId);
  };

  return (
    <>
      <Header />
      <div>
        <div className="container mx-auto px-4">
          <h1 className="text-center m-4">重役専用ページ</h1>
          <p className="text-center">
            本日の資料はこちらからダウンロードできます。
          </p>
          <div className="text-center">
            <button className="bg-gray-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded">
              資料ダウンロード
            </button>
          </div>
          <div className="flex justify-center items-center min-h-screen flex-wrap">
            {rooms
              .filter((room) => room.executive)
              .map((room) => (
                <div className="w-1/3 p-0.5" key={room.room_id}>
                  {" "}
                  {/* パディングの調整 */}
                  <RoomCard room={room} onReserve={handleReserve} />{" "}
                  {/* マージンボトムの追加 */}
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      </div>
    </>
  );
};

export default ExecutivePage;
