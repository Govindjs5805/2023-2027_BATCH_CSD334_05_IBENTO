import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [clubName, setClubName] = useState("");
  const [clubLogo, setClubLogo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          // 1. Fetch User Data
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const uData = userDoc.data();
            setUserData(uData);
            setRole(uData.role);
            const cId = uData.clubId;
            setClubId(cId);

            // 2. Fetch Club Specific Data if the user is a clubLead
            if (cId) {
              const clubDoc = await getDoc(doc(db, "clubs", cId));
              if (clubDoc.exists()) {
                const cData = clubDoc.data();
                setClubName(cData.name || "Club Admin");
                setClubLogo(cData.logoURL || "");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user/club data:", error);
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

  return (
    <AuthContext.Provider value={{ user, role, userData, clubId, clubName, clubLogo, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);