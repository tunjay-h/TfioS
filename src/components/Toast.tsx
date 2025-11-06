import { AnimatePresence, motion } from 'framer-motion';

export type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-center text-sm text-starlight shadow-lg backdrop-blur"
          role="status"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
