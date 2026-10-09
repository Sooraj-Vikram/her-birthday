import { motion } from "framer-motion";

export default function Ending() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      className="mt-16 text-center bg-dusk/5 rounded-2xl py-10 px-6"
    >
      <p className="font-hand text-3xl text-dusk mb-3">seven memories. one us.</p>
      <p className="text-ink/60 max-w-xs mx-auto leading-relaxed">
        Here's to all the ones we haven't made yet.
      </p>
    </motion.div>
  );
}
