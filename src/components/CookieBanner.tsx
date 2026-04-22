import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_accepted")
    if (!accepted) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie_accepted", "true")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        >
          <div className="max-w-2xl mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-neutral-300 text-sm leading-relaxed flex-1">
              Мы используем файлы cookie для корректной работы сайта и аналитики. Продолжая использовать сайт, вы соглашаетесь с нашей{" "}
              <Link to="/privacy-policy" className="text-[#8BC34A] hover:underline">
                политикой конфиденциальности
              </Link>
              .
            </p>
            <button
              onClick={accept}
              className="shrink-0 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              Принять
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
