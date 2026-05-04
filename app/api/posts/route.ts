import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const posts = getAllPosts(category);
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const postData = body.post ?? body;
  const post = createPost(postData);
  return NextResponse.json(post, { status: 201 });
}
