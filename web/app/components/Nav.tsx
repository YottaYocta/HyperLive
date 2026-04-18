import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center gap-6 border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
      <span className="font-semibold text-sm tracking-tight">ara</span>
      <Link
        href="/user"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Request Help
      </Link>
      <Link
        href="/admin"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Admin
      </Link>
      <Link
        href="/speed"
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Connectivity
      </Link>
    </nav>
  );
}
