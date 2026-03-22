import {
  BookOpen, FlaskConical, Music, Palette, Brain,
  Landmark, Cog, Building2, Church, Swords, Compass, HeartPulse,
} from 'lucide-react'
import type { Category } from '@/data/types'

const ICON_MAP: Record<Category, React.FC<{ size?: number; className?: string }>> = {
  literature: BookOpen,
  science: FlaskConical,
  music: Music,
  art: Palette,
  philosophy: Brain,
  history: Landmark,
  technology: Cog,
  architecture: Building2,
  religion: Church,
  warfare: Swords,
  exploration: Compass,
  medicine: HeartPulse,
}

interface CategoryIconProps {
  category: Category
  size?: number
  className?: string
}

export function CategoryIcon({ category, size = 24, className }: CategoryIconProps) {
  const Icon = ICON_MAP[category]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
