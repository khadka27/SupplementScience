export type Author = {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  socialLinks?: any;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Source = {
  title: string;
  url: string;
  description?: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  status: string;
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  readTimeMinutes: number;
  viewCount: number;
  isFeatured: boolean;
  sources?: Source[];
  faqs?: FAQ[];
  author?: Author;
  category?: Category;
  tags?: Tag[];
};
