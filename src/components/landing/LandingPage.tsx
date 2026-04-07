import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Section from './Section'
import Layout from './Layout'
import { sections } from './sections'
import Icon from '@/components/ui/icon'

const sectionLabels: Record<string, string> = {
  hero: 'Главная',
  about: 'О компании',
  services: 'Услуги',
  equipment: 'Техника',
  projects: 'Объекты',
  advantages: 'Преимущества',
  testimonials: 'Отзывы',
  contacts: 'Контакты',
}

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        const newActiveSection = Math.floor(scrollPosition / windowHeight + 0.3)
        setActiveSection(Math.min(newActiveSection, sections.length - 1))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleNavClick = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Layout>
      {/* Логотип и хедер */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <Icon name="TreePine" size={28} className="text-[#8BC34A]" />
          <span className="text-white font-bold text-xl tracking-tight">ЛесПроф</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-neutral-300 text-sm">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(i)}
              className={`hover:text-[#8BC34A] transition-colors ${i === activeSection ? 'text-[#8BC34A]' : ''}`}
            >
              {sectionLabels[s.id]}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleNavClick(sections.length - 1)}
          className="bg-[#8BC34A] hover:bg-[#7CB342] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Оставить заявку
        </button>
      </div>

      {/* Прогресс-бар */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#8BC34A] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Навигация по точкам */}
      <nav className="fixed top-0 right-4 h-screen flex flex-col justify-center z-30 gap-1">
        {sections.map((section, index) => (
          <button
            key={section.id}
            title={sectionLabels[section.id]}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeSection
                ? 'bg-[#8BC34A] scale-150'
                : 'bg-neutral-600 hover:bg-neutral-400'
            }`}
            onClick={() => handleNavClick(index)}
          />
        ))}
      </nav>

      {/* Секции */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {sections.map((section, index) => (
          <Section
            key={section.id}
            {...section}
            isActive={index === activeSection}
          />
        ))}
      </div>
    </Layout>
  )
}
