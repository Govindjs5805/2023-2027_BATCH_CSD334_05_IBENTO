import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/Admin/AdminLayout";

function AdminDashboard() {
  const { role, clubId } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let eventsRef = collection(db, "events");

        let q;

        if (role === "clubLead") {
          // 🔥 Only this club's events
          q = query(eventsRef, where("clubId", "==", clubId));
        } else if (role === "superAdmin") {
          // 🔥 All events
          q = eventsRef;
        } else {
          return;
        }

        const snapshot = await getDocs(q);

        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventList);

      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [role, clubId]);

  // ❌ Block students
  if (role !== "clubLead" && role !== "superAdmin") {
    return (
      <AdminLayout>
        <h2 className="text-red-600 text-xl">
          Access Denied
        </h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">
          {role === "superAdmin" ? "All Events" : "My Club Events"}
        </h1>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div
                key={event.id}
                className="p-4 border rounded shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold">
                  {event.title}
                </h2>

                <p className="text-gray-600">
                  {event.date} | {event.venue}
                </p>

                <p className="text-sm text-gray-500">
                  Club: {event.clubId}
                </p>

                <p className="mt-2 text-gray-700">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
