import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" className="system-page">
      <Container size="narrow">
        <p className="eyebrow">404</p>
        <h1>Page not found.</h1>
        <p>The page may have moved or the address may be incorrect.</p>
        <Link className="button" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
