"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ReceiptTurkishLiraIcon, Share2 } from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePostModal";

export default function TextPostForm() {
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const {mutate:createPostMutation, isPending} = useCreatePost();

  const handlePost = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("form submitted with content:", content);
    if (content.trim())
      ReceiptTurkishLiraIcon
    await createPostMutation({ content, visibility: "PUBLIC" });
    setContent("");
    setCharCount(0);

  };

  const isValid = content.trim().length > 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">What's on your mind?</label>
        <Textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={handleChange}
          className="mt-2 min-h-52 resize-none bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-zinc-500"
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>{charCount} / {maxChars}</span>
          <span className={charCount > maxChars * 0.9 ? "text-amber-500" : ""}>
            {maxChars - charCount} remaining
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Mood</label>
        <div className="grid grid-cols-5 gap-2">
          {["😊", "😂", "😍", "😢", "😤"].map((emoji) => (
            <button
              key={emoji}
              className="rounded-lg bg-white/5 border border-white/10 py-2 text-lg hover:bg-white/10 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handlePost}
          disabled={!isValid}
          className="flex-1 text-white bg-linear-to-r from-indigo-500 to-fuchsia-500 hover:opacity-90"
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
