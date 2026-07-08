import Link from "next/link";

export default function NotFound() {
  return (
    <main className="home" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div>
        <p className="eyebrow">Not found</p>
        <h1 className="home__title" style={{ marginTop: "1rem" }}>This fragrance isn&rsquo;t in the catalogue.</h1>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/" className="footer__back">
            <span className="arrow" style={{ color: "var(--accent)" }}>&larr;</span> Return to the catalogue
          </Link>
        </p>
      </div>
    </main>
  );
}
