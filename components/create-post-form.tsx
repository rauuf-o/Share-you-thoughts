"use client";
import { useRouter } from "next/navigation"; // 👈 add this

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/lib/validations/post";
import { z } from "zod";
import { createPost } from "@/lib/actions/feedback-actions";
import { CATEGORIES_TYPES } from "@/app/data/category-data";

type FormValues = z.infer<typeof createPostSchema>;

export default function CreatePostForm() {
  const router = useRouter(); // 👈 add this
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [titleLen, setTitleLen] = useState(0);
  const [descLen, setDescLen] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(createPostSchema) });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    const res = await createPost(formData);
    if ((res as any)?.error) {
      setServerError((res as any).error);
      return;
    }
    router.push("/feedback");
    setSuccess("Post published successfully");
    setSelectedCat("");
    setTitleLen(0);
    setDescLen(0);
  };

  const handleCatSelect = (cat: string) => {
    setSelectedCat(cat);
    setValue("category", cat, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-8 font-sans">
      <div className="w-full max-w-md  border border-[#2e2b27] rounded-2xl p-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#c9a85c] mb-1.5">
            New post
          </p>
          <h1 className="font-serif text-[2rem] leading-tight text-[#f2ede6]">
            Share your
            <br />
            <em className="text-[#c9a85c]">thoughts.</em>
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label
              className={`block text-[11px] tracking-[0.1em] uppercase mb-1.5 transition-colors ${errors.title ? "text-[#c0574f]" : "text-[#6b6660]"}`}
            >
              Title
            </label>
            <input
              {...register("title")}
              maxLength={80}
              placeholder="What's it about?"
              onChange={(e) => setTitleLen(e.target.value.length)}
              className={`w-full bg-[#1d1b18] rounded-[10px] px-4 py-3 text-[#f2ede6] text-sm font-light placeholder-[#3d3a35] outline-none border transition-colors focus:border-[#c9a85c] ${errors.title ? "border-[#c0574f]" : "border-[#2e2b27]"}`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title && (
                <span className="text-xs text-[#c0574f]">
                  {errors.title.message}
                </span>
              )}
              <span
                className={`ml-auto text-[11px] ${titleLen > 68 ? "text-[#c9a85c]" : "text-[#3d3a35]"}`}
              >
                {titleLen} / 80
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#6b6660] mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              maxLength={400}
              placeholder="Tell us more..."
              onChange={(e) => setDescLen(e.target.value.length)}
              className="w-full bg-[#1d1b18] border border-[#2e2b27] rounded-[10px] px-4 py-3 text-[#f2ede6] text-sm font-light placeholder-[#3d3a35] outline-none resize-none transition-colors focus:border-[#c9a85c]"
            />
            <div className="text-right mt-1">
              <span
                className={`text-[11px] ${descLen > 340 ? "text-[#c9a85c]" : "text-[#3d3a35]"}`}
              >
                {descLen} / 400
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div>
            <label
              className={`block text-[11px] tracking-[0.1em] uppercase mb-2 transition-colors ${errors.category ? "text-[#c0574f]" : "text-[#6b6660]"}`}
            >
              Category
            </label>
            <input type="hidden" {...register("category")} />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_TYPES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCatSelect(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition-all ${
                    selectedCat === cat
                      ? "bg-[#c9a85c18] border-[#c9a85c] text-[#c9a85c]"
                      : "bg-transparent border-[#2e2b27] text-[#6b6660] hover:border-[#4a453e] hover:text-[#a09890]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-[#c0574f] mt-1.5">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#2e2b27]" />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-[10px] bg-[#c9a85c] text-[#0e0d0c] text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Publishing…
              </>
            ) : (
              "Publish post"
            )}
          </button>

          {/* Feedback */}
          {serverError && (
            <p className="text-center text-sm text-[#c0574f] bg-[#2d1a1a] border border-[#4d2a2a] rounded-lg px-4 py-2.5">
              {serverError}
            </p>
          )}
          {success && (
            <p className="text-center text-sm text-[#6fbf73] bg-[#1a2d1a] border border-[#2a4d2a] rounded-lg px-4 py-2.5">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
