import type { ReactNode } from "react"

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  bgImage?: string
  stats?: { value: string; label: string }[]
  services?: { icon: string; title: string; desc: string }[]
  equipment?: { name: string; type: string; desc: string }[]
  projects?: { name: string; area: string; type: string }[]
  advantages?: { icon: string; title: string; desc: string }[]
  testimonials?: { text: string; author: string; role: string }[]
  contacts?: { icon: string; value: string }[]
}

export interface SectionProps extends Section {
  isActive: boolean
}
