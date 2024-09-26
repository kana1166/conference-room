import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

export const setupAuthListener = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const email = user.email;

      const q = query(
        collection(db, "allowedUsers"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        signOut(auth);
        alert("アクセス権限がありません。");
      }
    }
  });
};
