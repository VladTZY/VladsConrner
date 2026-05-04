"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Post,
  CreatePostData,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  logout,
} from "../../../lib/api";
import PostForm from "../../../components/PostForm";

function formatDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toLowerCase();
}

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const handleFormSubmit = async (data: CreatePostData) => {
    try {
      setFormLoading(true);
      if (editingPost) {
        const updatedPost = await updatePost(editingPost.id, data);
        setPosts(posts.map((p) => (p.id === editingPost.id ? updatedPost : p)));
      } else {
        const newPost = await createPost(data);
        setPosts([newPost, ...posts]);
      }
      setIsFormOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] dark:bg-[#1c1917] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#1c1917] flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-baseline justify-between">
          <Link
            href="/"
            className="group"
          >
            <h1 className="text-xl md:text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors">
              vlad's corner
              <span className="text-stone-400 dark:text-stone-500 font-normal ml-2 text-lg">
                / admin
              </span>
            </h1>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-mono text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex-1 w-full">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-12 border-b border-stone-200 dark:border-stone-800 pb-4">
          <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
            posts
          </h2>
          <button
            onClick={handleCreatePost}
            className="inline-flex items-center gap-1.5 text-sm font-mono text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            new post
          </button>
        </div>

        {error && (
          <p className="text-xs font-mono text-red-500 dark:text-red-400 mb-8">{error}</p>
        )}

        {/* Posts list */}
        {posts.length === 0 ? (
          <p className="text-stone-400 dark:text-stone-500 font-mono text-sm">
            no posts yet — create one to get started.
          </p>
        ) : (
          <div className="grid gap-12 md:gap-14">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group grid md:grid-cols-[120px_1fr] gap-4 md:gap-8 items-baseline"
              >
                {/* Meta sidebar */}
                <div className="flex flex-col gap-1 text-xs font-mono text-stone-400 dark:text-stone-500">
                  <span>{formatDate(post.created_at)}</span>
                  <span className="text-stone-300 dark:text-stone-700">—</span>
                  <span>{post.category}</span>
                </div>

                {/* Content + actions */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-medium text-stone-800 dark:text-stone-200 mb-1 leading-snug">
                      {post.title}
                    </h3>
                    {post.subtitle && (
                      <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-3">
                        {post.subtitle}
                      </p>
                    )}
                    {post.stamp_text && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-sm text-xs font-mono border uppercase tracking-wider shadow-sm rotate-2"
                        style={{
                          backgroundColor: `${post.stamp_color}20`,
                          color: post.stamp_color,
                          borderColor: `${post.stamp_color}40`,
                        }}
                      >
                        {post.stamp_text}
                      </span>
                    )}
                  </div>

                  {/* Actions — visible on hover */}
                  <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-6 pb-12 w-full text-center text-stone-300 dark:text-stone-700 text-xs font-mono">
        <p>vlad's corner &copy; {new Date().getFullYear()}</p>
      </footer>

      {isFormOpen && (
        <PostForm
          post={editingPost}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}
