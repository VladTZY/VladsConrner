"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const navItems: { name: string; value: string | null }[] = [
    { name: "all", value: null },
    { name: "movies", value: "movie" },
    { name: "tv", value: "tv_show" },
    { name: "books", value: "book" },
    { name: "music", value: "music" },
    { name: "extra", value: "extra" },
  ];

  const handleCategoryClick = (category: string | null) => {
    if (category === null) {
      router.push("/");
    } else if (currentCategory === category) {
      router.push("/");
    } else {
      router.push(`/?category=${category}`);
    }
  };

  return (
    <header className="mb-20 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
      <Link href="/" className="group">
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors">
          vscorner
          <span className="text-stone-400 dark:text-stone-500 font-normal ml-2 text-lg">/ reviews</span>
        </h1>
      </Link>
      
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0">
          {navItems.map((item) => (
            <button
              key={item.name} 
              onClick={() => handleCategoryClick(item.value)}
              className={`text-sm md:text-base whitespace-nowrap transition-colors duration-200 ${
                currentCategory === item.value
                  ? "text-stone-900 dark:text-stone-100 font-medium"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
