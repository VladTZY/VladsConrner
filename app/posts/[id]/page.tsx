import Header from "@/components/Header";
import { getPostById } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toLowerCase();
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = getPostById(Number(id));

  if (!post) notFound();

  return (
    <main>
      <Header />

      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          back to reviews
        </Link>

        <header className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-stone-400 dark:text-stone-500 mb-4">
            <span>{formatDate(post.created_at)}</span>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <span className="uppercase tracking-wider">{post.category}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-stone-500 dark:text-stone-400 font-mono bg-stone-100 dark:bg-stone-800/50 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 mb-4 leading-tight">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-xl md:text-2xl text-stone-500 dark:text-stone-400 font-light mb-6">
              {post.subtitle}
            </p>
          )}

          {post.stamp_text && (
            <div className="mt-6">
              <span
                className="inline-block px-4 py-1.5 rounded-sm text-sm font-mono border uppercase tracking-wider shadow-sm -rotate-1 transform transition-transform hover:rotate-0"
                style={{
                  backgroundColor: `${post.stamp_color}20`,
                  color: post.stamp_color,
                  borderColor: `${post.stamp_color}40`,
                }}
              >
                {post.stamp_text}
              </span>
            </div>
          )}
        </header>

        {/* Post image — only visible on the post page, not on the listing */}
        {post.image && (
          <div className="mb-10 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full object-cover max-h-[420px]"
              priority
            />
          </div>
        )}

        {/* MDX rendered content */}
        <article className="prose prose-stone dark:prose-invert max-w-none prose-lg prose-headings:font-medium prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500">
          {post.context ? (
            <MDXRemote source={post.context} />
          ) : (
            <p className="italic text-stone-400">No content available.</p>
          )}
        </article>
      </div>

      <footer className="mt-24 text-center text-stone-300 dark:text-stone-700 text-xs font-mono pb-8 border-t border-stone-100 dark:border-stone-900 pt-8">
        <p>vlad's corner &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
