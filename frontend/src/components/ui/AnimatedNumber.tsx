import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { formatCurrency } from "@/lib/format";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
}

// Cuenta desde el valor anterior hasta el nuevo en vez de "poppear" directo
// el número final — es la única animación que pidió el spec para los montos
// del dashboard, el resto de los números quedan estáticos a propósito.
export function AnimatedNumber({ value, format = formatCurrency }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    previous.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{format(display)}</span>;
}
