import { AnimatePresence, motion } from 'framer-motion';

export type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-center text-sm text-starlight shadow-lg backdrop-blur"
            role="status"
          >
            {message}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
