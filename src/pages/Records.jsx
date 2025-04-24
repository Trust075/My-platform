import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";

export default function Records() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (!currentUser?.uid) return;
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransactions(docSnap.data().transactions || []);
        }
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [currentUser]);

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md w-full mx-auto p-4 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Records</h2>
      {transactions.length === 0 ? (
        <p className="text-center">No records found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx, i) => (
            <li key={i} className="bg-gray-100 p-3 rounded-lg shadow">
              {tx}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}