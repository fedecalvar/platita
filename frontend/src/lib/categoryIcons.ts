import {
  BookOpen,
  Briefcase,
  Bus,
  Gamepad2,
  Gift,
  HeartPulse,
  Home,
  Laptop,
  type LucideIcon,
  MoreHorizontal,
  Shirt,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

// Mapea el `icon` que devuelve /categories (nombre de un ícono de Lucide,
// ver la tabla de CLAUDE.md) al componente real. Si el seed agrega una
// categoría con un ícono que no está acá, cae en el fallback en vez de
// romper la pantalla.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Bus,
  Home,
  Gamepad2,
  HeartPulse,
  BookOpen,
  Shirt,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Gift,
  TrendingUp,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return CATEGORY_ICONS[iconName] ?? MoreHorizontal;
}
