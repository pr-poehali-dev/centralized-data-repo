import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import type { SectionProps } from "@/types"
import ApplicationForm from "./ApplicationForm"

export default function Section({
  id, title, subtitle, content, isActive, showButton, buttonText,
  bgImage, stats, services, equipment, projects, advantages, testimonials, contacts
}: SectionProps) {
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: isActive ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay }
  })

  return (
    <section
      id={id}
      className="relative h-screen w-full snap-start flex flex-col justify-center overflow-hidden"
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        {subtitle && (
          <motion.div className="mb-6" {...fadeUp(0)}>
            {subtitle}
          </motion.div>
        )}

        <motion.h2
          className="text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white"
          {...fadeUp(0)}
        >
          {title}
        </motion.h2>

        {content && (
          <motion.p
            className="text-lg md:text-xl max-w-2xl mt-6 text-neutral-300"
            {...fadeUp(0.15)}
          >
            {content}
          </motion.p>
        )}

        {stats && (
          <motion.div className="flex gap-12 mt-10" {...fadeUp(0.2)}>
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-bold text-[#8BC34A]">{s.value}</div>
                <div className="text-neutral-400 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {services && (
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10" {...fadeUp(0.2)}>
            {services.map((s, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-[#8BC34A]/20 transition-colors"
                {...fadeUp(0.1 + i * 0.08)}
              >
                <Icon name={s.icon as "Zap"} size={28} className="text-[#8BC34A] mb-3" />
                <div className="font-semibold text-white text-sm leading-tight">{s.title}</div>
                <div className="text-neutral-400 text-xs mt-2 leading-relaxed">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {equipment && (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10" {...fadeUp(0.2)}>
            {equipment.map((eq, i) => (
              <motion.div
                key={i}
                className="bg-white/5 border border-[#8BC34A]/30 rounded-xl p-5 hover:border-[#8BC34A] transition-colors"
                {...fadeUp(0.1 + i * 0.08)}
              >
                <div className="text-[#8BC34A] text-xs font-semibold uppercase tracking-wider mb-1">{eq.type}</div>
                <div className="text-white font-bold text-lg">{eq.name}</div>
                <div className="text-neutral-400 text-sm mt-2">{eq.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {projects && (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10" {...fadeUp(0.2)}>
            {projects.map((p, i) => (
              <motion.div
                key={i}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                {...fadeUp(0.1 + i * 0.08)}
              >
                <div className="text-[#8BC34A] text-xs font-semibold uppercase tracking-wider mb-2">{p.type}</div>
                <div className="text-white font-semibold leading-tight">{p.name}</div>
                <div className="text-3xl font-bold text-white mt-3">{p.area}</div>
                <div className="text-neutral-500 text-xs">расчищено</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {advantages && (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10" {...fadeUp(0.2)}>
            {advantages.map((a, i) => (
              <motion.div key={i} className="flex flex-col" {...fadeUp(0.1 + i * 0.08)}>
                <div className="w-12 h-12 rounded-xl bg-[#8BC34A]/20 border border-[#8BC34A]/40 flex items-center justify-center mb-3">
                  <Icon name={a.icon as "Shield"} size={22} className="text-[#8BC34A]" />
                </div>
                <div className="text-white font-semibold mb-1">{a.title}</div>
                <div className="text-neutral-400 text-sm leading-relaxed">{a.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {testimonials && (
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10" {...fadeUp(0.2)}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
                {...fadeUp(0.1 + i * 0.1)}
              >
                <div className="text-neutral-300 text-sm leading-relaxed mb-4">«{t.text}»</div>
                <div className="text-white font-semibold text-sm">{t.author}</div>
                <div className="text-[#8BC34A] text-xs mt-0.5">{t.role}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {contacts && (
          <motion.div className="flex flex-col gap-4 mt-8" {...fadeUp(0.2)}>
            {contacts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-neutral-300">
                <Icon name={c.icon as "Phone"} size={18} className="text-[#8BC34A]" />
                <span className="text-lg">{c.value}</span>
              </div>
            ))}
          </motion.div>
        )}

        {showButton && (
          <motion.div {...fadeUp(0.3)}>
            {contacts ? (
              <ApplicationForm />
            ) : (
              <div className="mt-10">
                <Button
                  size="lg"
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold px-8 py-6 text-base rounded-xl transition-colors"
                >
                  {buttonText}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}