import Header from "@/components/Header";
import { getAllPosts, Post } from "@/lib/posts";
import { Suspense } from "react";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
}

async function PostsList({ category, page }: { category?: string; page: number }) {
  let allPosts: Post[] = [];
  try {
    allPosts = getAllPosts(category);
    // Sort posts by date descending
    allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center text-stone-500 dark:text-stone-400 py-10">
        No reviews found {category ? `for ${category}` : ""}.
      </div>
    );
  }

  // Pagination
  const POSTS_PER_PAGE = 10;
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <>
      <div className="grid gap-16 md:gap-20">
        {posts.map((post) => (
        <article key={post.id} className="group grid md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-baseline">
          <div className="flex flex-col gap-1 text-xs font-mono text-stone-400 dark:text-stone-500">
            <span>{formatDate(post.created_at)}</span>
            <span className="text-stone-300 dark:text-stone-700">—</span>
            <span>{post.category}</span>
          </div>
          
          <div>
            <Link href={`/posts/${post.id}`}>
              <h3 className="text-2xl md:text-3xl font-medium text-stone-800 dark:text-stone-200 mb-3 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors cursor-pointer">
                {post.title}
              </h3>
            </Link>
            
            {post.subtitle && (
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-4 max-w-xl text-base md:text-lg">
                {post.subtitle}
              </p>
            )}

            {post.stamp_text && (
              <div className="flex items-center gap-4 mt-2">
                <span 
                  className="inline-block px-3 py-1 rounded-sm text-xs font-mono border uppercase tracking-wider shadow-sm rotate-2"
                  style={{ 
                    backgroundColor: `${post.stamp_color}20`, 
                    color: post.stamp_color,
                    borderColor: `${post.stamp_color}40`
                  }}
                >
                  {post.stamp_text}
                </span>
                <Link 
                  href={`/posts/${post.id}`}
                  className="text-sm text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors underline decoration-stone-200 dark:decoration-stone-700 underline-offset-4 hover:decoration-stone-400 dark:hover:decoration-stone-500 ml-2"
                >
                  read more
                </Link>
              </div>
            )}
          </div>
        </article>
      ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-20 pt-12 border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-8">
          <Link
            href={page > 1 ? `/?${new URLSearchParams({ ...(category && { category }), page: String(page - 1) })}` : "#"}
            className={`text-sm transition-colors ${
              page > 1
                ? "text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                : "text-stone-300 dark:text-stone-700 cursor-not-allowed pointer-events-none"
            }`}
          >
            ← previous
          </Link>
          
          <span className="text-sm font-mono text-stone-500 dark:text-stone-400">
            {page} / {totalPages}
          </span>
          
          <Link
            href={page < totalPages ? `/?${new URLSearchParams({ ...(category && { category }), page: String(page + 1) })}` : "#"}
            className={`text-sm transition-colors ${
              page < totalPages
                ? "text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                : "text-stone-300 dark:text-stone-700 cursor-not-allowed pointer-events-none"
            }`}
          >
            next →
          </Link>
        </div>
      )}
    </>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const { category, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  return (
    <main>
      <Suspense fallback={<div className="mb-20">Loading header...</div>}>
        <Header />
      </Suspense>
      
      <section>
        <div className="flex items-baseline justify-between mb-12 border-b border-stone-200 dark:border-stone-800 pb-4">
          <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
            {category ? `${category}` : "latest"}
          </h2>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">updated weekly-ish</span>
        </div>

        <Suspense key={`${category}-${currentPage}`} fallback={<div className="text-center py-10">Loading reviews...</div>}>
          <PostsList category={category} page={currentPage} />
        </Suspense>
      </section>
      
      <footer className="mt-24 text-center text-stone-300 dark:text-stone-700 text-xs font-mono">
        <p>vlad's corner &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
