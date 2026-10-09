import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginGate from "./components/LoginGate";
import Garden from "./components/Garden";

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("garden_unlocked") === "true";
  });

  const handleUnlock = () => {
    sessionStorage.setItem("garden_unlocked", "true");
    setUnlocked(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div key="gate" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <LoginGate onUnlock={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div
          key="garden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Garden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
