import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  newTab?: boolean;
};

export function ButtonLink({
  children,
  className,
  href,
  newTab = false,
}: ButtonLinkProps) {
  if (href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        className={className}
        href={href}
        rel={newTab ? "noopener noreferrer" : undefined}
        target={newTab ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href} prefetch={false}>
      {children}
    </Link>
  );
}
