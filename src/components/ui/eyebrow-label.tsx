import type { ReactNode } from "react";

import styles from "./eyebrow-label.module.css";

type EyebrowLabelProps = {
  children: ReactNode;
  className?: string;
};

export function EyebrowLabel({ children, className }: EyebrowLabelProps) {
  return (
    <p className={[styles.label, className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}
