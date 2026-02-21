import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [clubName, setClubName] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubLogo, setClubLogo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setClubId(null);
        setClubName(null);
        setFullName(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role);
        setClubId(userData.clubId || null);
        setFullName(userData.fullName || "");

        // 🔥 Fetch club name from clubs collection
        if (userData.clubId) {
  console.log("User clubId:", userData.clubId);

  const clubRef = doc(db, "clubs", userData.clubId);
  console.log("Fetching club document:", clubRef.path);

  const clubDoc = await getDoc(clubRef);

  if (clubDoc.exists()) {
    console.log("Club Data:", clubDoc.data());
    const clubData = clubDoc.data();
    setClubName(clubData.name);
    setClubLogo(clubData.logoURL || null);
  } else {
    console.log("❌ Club document NOT FOUND");
  }


  if (clubDoc.exists()) {
    const clubData = clubDoc.data();
    setClubName(clubData.name);
    setClubLogo(clubData.logoURL || null);
  } else {
    console.log("Club document not found!");
  }
}
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        clubId,
        clubName,
        clubLogo,
        fullName
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}