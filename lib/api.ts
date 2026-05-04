const BASE_URL = "/api";

export interface User {
  id: number;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  subtitle?: string;
  context?: string;
  stamp_text?: string;
  stamp_color?: string;
  tags?: string[];
  category: "movie" | "book" | "music" | "tv_show" | "extra";
  image?: string;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  subtitle?: string;
  context?: string;
  stamp_text?: string;
  stamp_color?: string;
  tags?: string[];
  category: string;
  image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: credentials }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Login failed (${res.status})`);
  }
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, { method: "DELETE" });
}

export async function getPosts(category?: string): Promise<Post[]> {
  const url = category
    ? `${BASE_URL}/posts?category=${category}`
    : `${BASE_URL}/posts`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(postData: CreatePostData): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post: postData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to create post");
  }
  return res.json();
}

export async function updatePost(
  id: number,
  postData: Partial<CreatePostData>
): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post: postData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to update post");
  }
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload image");
  }
  const data = await res.json();
  return data.url;
}
