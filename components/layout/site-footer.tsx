import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-display text-lg text-foreground">Quack &amp; Co.</p>
        <div className="flex gap-6">
          <Link href="/shop/" className="hover:text-foreground">
            Shop
          </Link>
          <Link href="/customize/" className="hover:text-foreground">
            Customize
          </Link>
          <Link href="/about/" className="hover:text-foreground">
            About
          </Link>
        </div>
        <p>Collectible ducks, quietly made.</p>
      </div>
    </footer>
  );
}
