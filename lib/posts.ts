import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  id: number;
  title: string;
  subtitle?: string;
  context?: string;
  stamp_text?: string;
  stamp_color?: string;
  tags?: string[];
  category: "movie" | "book" | "music" | "tv_show" | "extra";
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Post extends PostMeta {
  user: { id: number; email: string };
}

const ADMIN_USER = { id: 1, email: "admin" };

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function getNextId(): number {
  ensureDir();
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) return 1;
  const ids = files
    .map((f) => parseInt(f.replace(".mdx", ""), 10))
    .filter((n) => !isNaN(n));
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    ...(data as PostMeta),
    context: content.trim(),
    user: ADMIN_USER,
  };
}

export function getAllPosts(category?: string): Post[] {
  ensureDir();
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) =>
    parsePost(path.join(POSTS_DIR, file))
  );

  return category ? posts.filter((p) => p.category === category) : posts;
}

export function getPostById(id: number): Post | null {
  const filePath = path.join(POSTS_DIR, `${id}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filePath);
}

export function createPost(
  data: Omit<PostMeta, "id" | "created_at" | "updated_at">
): Post {
  ensureDir();
  const id = getNextId();
  const now = new Date().toISOString();

  const frontmatter: PostMeta = {
    id,
    title: data.title,
    subtitle: data.subtitle,
    stamp_text: data.stamp_text,
    stamp_color: data.stamp_color,
    tags: data.tags || [],
    category: data.category,
    image: data.image,
    created_at: now,
    updated_at: now,
  };

  const content = data.context || "";
  const fileContent = matter.stringify(content, frontmatter as unknown as Record<string, unknown>);
  fs.writeFileSync(path.join(POSTS_DIR, `${id}.mdx`), fileContent, "utf-8");

  return { ...frontmatter, context: content, user: ADMIN_USER };
}

export function updatePost(
  id: number,
  data: Partial<PostMeta>
): Post | null {
  const existing = getPostById(id);
  if (!existing) return null;

  const updated: PostMeta = {
    id,
    title: data.title ?? existing.title,
    subtitle: data.subtitle ?? existing.subtitle,
    stamp_text: data.stamp_text ?? existing.stamp_text,
    stamp_color: data.stamp_color ?? existing.stamp_color,
    tags: data.tags ?? existing.tags,
    category: data.category ?? existing.category,
    image: data.image !== undefined ? data.image : existing.image,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };

  const content = data.context !== undefined ? data.context : (existing.context ?? "");
  const fileContent = matter.stringify(content, updated as unknown as Record<string, unknown>);
  fs.writeFileSync(path.join(POSTS_DIR, `${id}.mdx`), fileContent, "utf-8");

  return { ...updated, context: content, user: ADMIN_USER };
}

export function deletePostById(id: number): boolean {
  const filePath = path.join(POSTS_DIR, `${id}.mdx`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
