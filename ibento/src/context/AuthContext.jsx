import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            setRole(userData.role || "student");
            setClubId(userData.clubId || null);
          } else {
            // If user exists in Auth but not in Firestore
            setRole("student");
            setClubId(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole(null);
          setClubId(null);
        }

      } else {
        setUser(null);
        setRole(null);
        setClubId(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    role,
    clubId,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
