export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  language: "vi" | "en" | "zh" | "video";
  youtube_url?: string;
  published: boolean;
  view_count: number;
  category_names: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}

export const categories: Category[] = [];

export const posts: Post[] = [];

export const topPosts: Post[] = [];

export function getLanguageLabel(lang: Post["language"]) {
  switch (lang) {
    case "vi": return { flag: "🇻🇳", label: "Tiếng Việt" };
    case "en": return { flag: "🇬🇧", label: "English" };
    case "zh": return { flag: "🇨🇳", label: "Tiếng Trung" };
    case "video": return { flag: "📹", label: "Video" };
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
