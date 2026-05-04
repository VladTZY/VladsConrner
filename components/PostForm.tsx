"use client";

import { useState, useEffect, useRef } from "react";
import { CreatePostData, Post, uploadImage } from "../lib/api";
import { Loader2, X, ImagePlus, Trash2 } from "lucide-react";
import Markdown from "react-markdown";
import Image from "next/image";

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function formatPreviewDate() {
  return new Date()
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toLowerCase();
}

export default function PostForm({ post, onSubmit, onCancel, isLoading }: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    title: "",
    subtitle: "",
    context: "",
    stamp_text: "",
    stamp_color: "#FF5733",
    tags: [],
    category: "book",
    image: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        subtitle: post.subtitle || "",
        context: post.context || "",
        stamp_text: post.stamp_text || "",
        stamp_color: post.stamp_color || "#FF5733",
        tags: post.tags || [],
        category: post.category,
        image: post.image || "",
      });
    }
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const previewDate = formatPreviewDate();

  const inputClass =
    "w-full rounded-sm border border-stone-200 dark:border-stone-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors";

  const labelClass = "block text-xs font-mono text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#faf9f6] dark:bg-[#1c1917] border border-stone-200 dark:border-stone-800 rounded-sm shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
          <h2 className="text-base font-medium text-stone-900 dark:text-stone-100">
            {post ? "edit post" : "new post"}
          </h2>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body: form + preview */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* ── Form pane ── */}
          <form
            id="post-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-5 border-r border-stone-200 dark:border-stone-800"
          >
            {/* Title */}
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Everything Everywhere All at Once"
                className={inputClass}
              />
            </div>

            {/* Subtitle + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="short description"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="movie">Movie</option>
                  <option value="book">Book</option>
                  <option value="music">Music</option>
                  <option value="tv_show">TV Show</option>
                  <option value="extra">Extra</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className={labelClass}>
                Content{" "}
                <span className="normal-case text-stone-400 dark:text-stone-500">
                  (markdown supported)
                </span>
              </label>
              <textarea
                name="context"
                value={formData.context}
                onChange={handleChange}
                rows={8}
                placeholder="Write your review here... **bold**, *italic*, ## headings, etc."
                className={`${inputClass} font-mono leading-relaxed resize-none`}
              />
            </div>

            {/* Cover image */}
            <div>
              <label className={labelClass}>
                Cover Image{" "}
                <span className="normal-case text-stone-400 dark:text-stone-500">
                  (shown on post page only)
                </span>
              </label>

              {formData.image ? (
                <div className="relative rounded-sm overflow-hidden border border-stone-200 dark:border-stone-700">
                  <Image
                    src={formData.image}
                    alt="Cover preview"
                    width={600}
                    height={200}
                    className="w-full object-cover max-h-40"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-stone-100 rounded-sm hover:bg-stone-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 w-full py-6 border border-dashed border-stone-300 dark:border-stone-700 rounded-sm cursor-pointer hover:border-stone-500 dark:hover:border-stone-500 transition-colors text-sm text-stone-400 dark:text-stone-500"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        uploading...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-4 h-4" />
                        click to upload an image
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Stamp text + color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stamp Text</label>
                <input
                  type="text"
                  name="stamp_text"
                  value={formData.stamp_text}
                  onChange={handleChange}
                  placeholder="e.g. masterpiece"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stamp Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="stamp_color"
                    value={formData.stamp_color}
                    onChange={handleChange}
                    className="h-9 w-9 rounded-sm cursor-pointer border border-stone-200 dark:border-stone-700 bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    name="stamp_color"
                    value={formData.stamp_color}
                    onChange={handleChange}
                    className={`${inputClass} flex-1`}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}>Tags (press enter to add)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={`${inputClass} mb-2`}
                placeholder="add a tag..."
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-sm bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-xs font-mono text-stone-600 dark:text-stone-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-100 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>

          {/* ── Preview pane ── */}
          <div className="w-[380px] flex-shrink-0 overflow-y-auto p-6 hidden md:block">
            <p className="text-xs font-mono text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-5">
              preview
            </p>

            {/* Post page header preview */}
            <div className="border border-stone-200 dark:border-stone-800 rounded-sm p-5 mb-5">
              <p className="text-xs font-mono text-stone-400 dark:text-stone-500 mb-3">
                post page
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400 dark:text-stone-500 mb-3">
                <span>{post ? post.created_at.slice(0, 10) : previewDate}</span>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <span className="uppercase tracking-wider">
                  {formData.category || "category"}
                </span>
                {formData.tags && formData.tags.length > 0 && (
                  <>
                    <span className="text-stone-300 dark:text-stone-700">/</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-stone-100 dark:bg-stone-800/50 px-1.5 py-0.5 rounded text-stone-500 dark:text-stone-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              {formData.title ? (
                <h1 className="text-xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-2">
                  {formData.title}
                </h1>
              ) : (
                <div className="h-6 bg-stone-100 dark:bg-stone-800 rounded animate-pulse w-3/4 mb-2" />
              )}

              {/* Subtitle */}
              {formData.subtitle ? (
                <p className="text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-3">
                  {formData.subtitle}
                </p>
              ) : (
                <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded animate-pulse w-full mb-3 opacity-40" />
              )}

              {/* Stamp */}
              {formData.stamp_text && (
                <div className="mt-3">
                  <span
                    className="inline-block px-3 py-1 rounded-sm text-xs font-mono border uppercase tracking-wider shadow-sm -rotate-1"
                    style={{
                      backgroundColor: `${formData.stamp_color}20`,
                      color: formData.stamp_color,
                      borderColor: `${formData.stamp_color}40`,
                    }}
                  >
                    {formData.stamp_text}
                  </span>
                </div>
              )}

              {/* Image */}
              {formData.image && (
                <div className="rounded overflow-hidden mt-4 border border-stone-200 dark:border-stone-800">
                  <Image
                    src={formData.image}
                    alt={formData.title || "Cover"}
                    width={400}
                    height={200}
                    className="w-full object-cover max-h-28"
                  />
                </div>
              )}

              {/* Content */}
              {formData.context && (
                <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <p className="text-xs font-mono text-stone-400 dark:text-stone-500 mb-2">content</p>
                  <div className="prose prose-sm prose-stone dark:prose-invert max-w-none line-clamp-[12]">
                    <Markdown>{formData.context}</Markdown>
                  </div>
                </div>
              )}
            </div>

            {/* Listing item preview */}
            <div className="border border-stone-200 dark:border-stone-800 rounded-sm p-5">
              <p className="text-xs font-mono text-stone-400 dark:text-stone-500 mb-3">
                listing view
              </p>

              <div className="grid grid-cols-[72px_1fr] gap-3 items-baseline">
                <div className="flex flex-col gap-0.5 text-xs font-mono text-stone-400 dark:text-stone-500">
                  <span>{post ? post.created_at.slice(0, 10) : previewDate}</span>
                  <span className="text-stone-300 dark:text-stone-700">—</span>
                  <span>{formData.category}</span>
                </div>

                <div>
                  {formData.title ? (
                    <h3 className="text-base font-medium text-stone-800 dark:text-stone-200 mb-1 leading-snug">
                      {formData.title}
                    </h3>
                  ) : (
                    <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded animate-pulse w-2/3 mb-1" />
                  )}

                  {formData.subtitle && (
                    <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mb-2">
                      {formData.subtitle}
                    </p>
                  )}

                  {formData.stamp_text && (
                    <span
                      className="inline-block px-2 py-0.5 rounded-sm text-xs font-mono border uppercase tracking-wider shadow-sm rotate-2"
                      style={{
                        backgroundColor: `${formData.stamp_color}20`,
                        color: formData.stamp_color,
                        borderColor: `${formData.stamp_color}40`,
                      }}
                    >
                      {formData.stamp_text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-sm hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            cancel
          </button>
          <button
            type="submit"
            form="post-form"
            disabled={isLoading || imageUploading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-sm hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {post ? "save changes" : "publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
