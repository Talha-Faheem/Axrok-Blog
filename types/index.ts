export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  twitter?: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  color?: string;
  iconName?: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
  tags?: string[];
  cveId?: string;
}

export interface PracticalGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  stepsCount: number;
  readingTime: string;
  iconName: string;
  updatedAt: string;
}

export interface SecurityAdvisory {
  id: string;
  cveId: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvssScore: number;
  affectedSystems: string;
  publishedDate: string;
  summary: string;
  verifiedMitigation: string;
  sourceUrl: string;
  exploitStatus: "Confirmed Active Exploitation" | "Proof of Concept Public" | "Reported / Patch Available";
}

export interface TopicItem {
  name: string;
  slug: string;
  description: string;
  count: number;
  icon: string;
}

