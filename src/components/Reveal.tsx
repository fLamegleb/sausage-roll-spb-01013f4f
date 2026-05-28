import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

export const Reveal = ({ children, className, delay = 0, as: Tag = "div" }: Props) => {
  const { ref, progress } = useReveal();
  // opacity 0 -> 1, scale 0.9 -> 1, translateY 28px -> 0
  const opacity = progress;
  const scale = 0.9 + progress * 0.1;
  const translate = (1 - progress) * 28;
  return (
    <Tag
      ref={ref as never}
      style={{
        opacity,
        transform: `translateY(${translate}px) scale(${scale})`,
        transition: `opacity 600ms ease ${delay}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
};
