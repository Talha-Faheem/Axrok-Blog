import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";
import { initialSeedData } from "./seed-data";
import { User, IUser } from "@/models/User";
import { Post, IPost } from "@/models/Post";
import { Category, ICategory } from "@/models/Category";
import { Tag, ITag } from "@/models/Tag";
import { Author, IAuthor } from "@/models/Author";
import { Media, IMedia } from "@/models/Media";
import { Page, IPage } from "@/models/Page";
import { NewsletterSubscriber, INewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { SiteSettings, ISiteSettings } from "@/models/SiteSettings";
import { HomepageSettings, IHomepageSettings } from "@/models/HomepageSettings";
import slugify from "slugify";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "axrok-store.json");

// In-memory / file-persisted store fallback
let storeMemoryCache: typeof initialSeedData | null = null;

function getLocalStore(): typeof initialSeedData {
  if (storeMemoryCache) return storeMemoryCache;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      storeMemoryCache = JSON.parse(raw);
      return storeMemoryCache!;
    }
  } catch (err) {
    console.error("[Store] Error reading local store:", err);
  }
  // Initialize with seed data
  storeMemoryCache = initialSeedData;
  saveLocalStore(initialSeedData);
  return initialSeedData;
}

function saveLocalStore(data: typeof initialSeedData) {
  storeMemoryCache = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[Store] Error saving local store:", err);
  }
}

// -------------------------------------------------------------
// POSTS REPOSITORY
// -------------------------------------------------------------
export async function getPosts(params: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  status?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  trending?: boolean;
} = {}) {
  await checkScheduledPosts();
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
  const skip = (page - 1) * limit;

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const query: any = {};
      if (params.status) {
        query.status = params.status;
      } else {
        query.status = "published";
      }
      if (params.category) query.category = params.category;
      if (params.tag) query.tags = params.tag;
      if (params.author) query.author = params.author;
      if (params.featured !== undefined) query.isFeatured = params.featured;
      if (params.trending !== undefined) query.isTrending = params.trending;

      if (params.search) {
        query.$or = [
          { title: { $regex: params.search, $options: "i" } },
          { excerpt: { $regex: params.search, $options: "i" } },
        ];
      }

      const sortQuery: any = { publishedAt: -1, createdAt: -1 };
      if (params.sort === "oldest") sortQuery.publishedAt = 1;
      if (params.sort === "title") sortQuery.title = 1;

      const [items, total] = await Promise.all([
        Post.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
        Post.countDocuments(query),
      ]);

      return {
        posts: items.map(serializeDoc),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on getPosts", e);
    }
  }

  // Fallback to local store
  const store = getLocalStore();
  let list = [...store.posts];

  if (params.status) {
    list = list.filter((p) => p.status === params.status);
  } else {
    list = list.filter((p) => p.status === "published");
  }

  if (params.category) {
    list = list.filter((p) => p.category === params.category);
  }
  if (params.tag) {
    list = list.filter((p) => p.tags && p.tags.includes(params.tag!));
  }
  if (params.author) {
    list = list.filter((p) => p.author === params.author);
  }
  if (params.featured !== undefined) {
    list = list.filter((p) => p.isFeatured === params.featured);
  }
  if (params.trending !== undefined) {
    list = list.filter((p) => p.isTrending === params.trending);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA;
  });

  const total = list.length;
  const paginated = list.slice(skip, skip + limit);

  return {
    posts: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPostBySlug(slug: string, includeUnpublished = false) {
  await checkScheduledPosts();
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const query: any = { slug };
      if (!includeUnpublished) query.status = "published";
      const doc = await Post.findOne(query).lean();
      if (doc) return serializeDoc(doc);
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on getPostBySlug", e);
    }
  }

  const store = getLocalStore();
  const found = store.posts.find((p) => {
    if (p.slug !== slug) return false;
    if (!includeUnpublished && p.status !== "published") return false;
    return true;
  });
  return found || null;
}

export async function getPostById(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const doc = await Post.findById(id).lean();
      if (doc) return serializeDoc(doc);
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on getPostById", e);
    }
  }

  const store = getLocalStore();
  return store.posts.find((p) => p.id === id || (p as any)._id === id) || null;
}

export async function createPost(data: any) {
  const generatedSlug = data.slug
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  const readingTime = Math.max(1, Math.ceil((data.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length / 200));

  const postData = {
    ...data,
    slug: generatedSlug,
    readingTime,
    publishedAt: data.status === "published" ? data.publishedAt || new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Post.create(postData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on createPost", e);
    }
  }

  const store = getLocalStore();
  const newPost = { ...postData, id: `post-${Date.now()}` };
  store.posts.unshift(newPost);
  saveLocalStore(store);
  return newPost;
}

export async function updatePost(id: string, data: any) {
  if (data.slug) {
    data.slug = slugify(data.slug, { lower: true, strict: true });
  }
  if (data.content) {
    data.readingTime = Math.max(1, Math.ceil(data.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200));
  }
  if (data.status === "published" && !data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }
  data.updatedAt = new Date().toISOString();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await Post.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on updatePost", e);
    }
  }

  const store = getLocalStore();
  const idx = store.posts.findIndex((p) => p.id === id || (p as any)._id === id);
  if (idx !== -1) {
    store.posts[idx] = { ...store.posts[idx], ...data };
    saveLocalStore(store);
    return store.posts[idx];
  }
  return null;
}

export async function deletePost(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Post.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback to local store on deletePost", e);
    }
  }

  const store = getLocalStore();
  const initialLen = store.posts.length;
  store.posts = store.posts.filter((p) => p.id !== id && (p as any)._id !== id);
  saveLocalStore(store);
  return store.posts.length < initialLen;
}

// -------------------------------------------------------------
// CATEGORIES REPOSITORY
// -------------------------------------------------------------
export async function getCategories(onlyActive = false) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const query = onlyActive ? { isActive: true } : {};
      const items = await Category.find(query).sort({ name: 1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getCategories", e);
    }
  }

  const store = getLocalStore();
  let list = store.categories;
  if (onlyActive) list = list.filter((c) => c.isActive);
  return list;
}

export async function getCategoryBySlug(slug: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const item = await Category.findOne({ slug }).lean();
      if (item) return serializeDoc(item);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getCategoryBySlug", e);
    }
  }

  const store = getLocalStore();
  return store.categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(data: any) {
  const slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(data.name, { lower: true, strict: true });
  const catData = { ...data, slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Category.create(catData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on createCategory", e);
    }
  }

  const store = getLocalStore();
  const newCat = { ...catData, id: `cat-${Date.now()}` };
  store.categories.push(newCat);
  saveLocalStore(store);
  return newCat;
}

export async function updateCategory(id: string, data: any) {
  if (data.slug) data.slug = slugify(data.slug, { lower: true, strict: true });
  data.updatedAt = new Date().toISOString();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updateCategory", e);
    }
  }

  const store = getLocalStore();
  const idx = store.categories.findIndex((c) => c.id === id || (c as any)._id === id);
  if (idx !== -1) {
    store.categories[idx] = { ...store.categories[idx], ...data };
    saveLocalStore(store);
    return store.categories[idx];
  }
  return null;
}

export async function deleteCategory(id: string) {
  const cat = (await getCategories()).find((c) => c.id === id || c._id === id);
  if (!cat) return { success: false, message: "Category not found" };

  // Check if articles are assigned to this category
  const { posts } = await getPosts({ category: cat.slug, limit: 1 });
  if (posts.length > 0) {
    return { success: false, message: "Cannot delete category assigned to published or draft articles" };
  }

  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Category.findByIdAndDelete(id);
      return { success: true };
    } catch (e) {
      console.warn("[MongoDB] Fallback on deleteCategory", e);
    }
  }

  const store = getLocalStore();
  store.categories = store.categories.filter((c) => c.id !== id && (c as any)._id !== id);
  saveLocalStore(store);
  return { success: true };
}

// -------------------------------------------------------------
// TAGS REPOSITORY
// -------------------------------------------------------------
export async function getTags() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const items = await Tag.find().sort({ name: 1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getTags", e);
    }
  }

  const store = getLocalStore();
  return store.tags;
}

export async function getTagBySlug(slug: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const item = await Tag.findOne({ slug }).lean();
      if (item) return serializeDoc(item);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getTagBySlug", e);
    }
  }

  const store = getLocalStore();
  return store.tags.find((t) => t.slug === slug) || null;
}

export async function createTag(data: any) {
  const slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(data.name, { lower: true, strict: true });
  const tagData = { ...data, slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Tag.create(tagData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on createTag", e);
    }
  }

  const store = getLocalStore();
  const newTag = { ...tagData, id: `tag-${Date.now()}` };
  store.tags.push(newTag);
  saveLocalStore(store);
  return newTag;
}

export async function updateTag(id: string, data: any) {
  if (data.slug) data.slug = slugify(data.slug, { lower: true, strict: true });
  data.updatedAt = new Date().toISOString();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await Tag.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updateTag", e);
    }
  }

  const store = getLocalStore();
  const idx = store.tags.findIndex((t) => t.id === id || (t as any)._id === id);
  if (idx !== -1) {
    store.tags[idx] = { ...store.tags[idx], ...data };
    saveLocalStore(store);
    return store.tags[idx];
  }
  return null;
}

export async function deleteTag(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Tag.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on deleteTag", e);
    }
  }

  const store = getLocalStore();
  store.tags = store.tags.filter((t) => t.id !== id && (t as any)._id !== id);
  saveLocalStore(store);
  return true;
}

// -------------------------------------------------------------
// AUTHORS REPOSITORY
// -------------------------------------------------------------
export async function getAuthors() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const items = await Author.find().sort({ name: 1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getAuthors", e);
    }
  }

  const store = getLocalStore();
  return store.authors;
}

export async function getAuthorBySlug(slug: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const item = await Author.findOne({ slug }).lean();
      if (item) return serializeDoc(item);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getAuthorBySlug", e);
    }
  }

  const store = getLocalStore();
  return store.authors.find((a) => a.slug === slug) || null;
}

export async function createAuthor(data: any) {
  const slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(data.name, { lower: true, strict: true });
  const authorData = { ...data, slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Author.create(authorData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on createAuthor", e);
    }
  }

  const store = getLocalStore();
  const newAuthor = { ...authorData, id: `auth-${Date.now()}` };
  store.authors.push(newAuthor);
  saveLocalStore(store);
  return newAuthor;
}

export async function updateAuthor(id: string, data: any) {
  if (data.slug) data.slug = slugify(data.slug, { lower: true, strict: true });
  data.updatedAt = new Date().toISOString();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await Author.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updateAuthor", e);
    }
  }

  const store = getLocalStore();
  const idx = store.authors.findIndex((a) => a.id === id || (a as any)._id === id);
  if (idx !== -1) {
    store.authors[idx] = { ...store.authors[idx], ...data };
    saveLocalStore(store);
    return store.authors[idx];
  }
  return null;
}

export async function deleteAuthor(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Author.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on deleteAuthor", e);
    }
  }

  const store = getLocalStore();
  store.authors = store.authors.filter((a) => a.id !== id && (a as any)._id !== id);
  saveLocalStore(store);
  return true;
}

// -------------------------------------------------------------
// MEDIA REPOSITORY
// -------------------------------------------------------------
export async function getMedia() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const items = await Media.find().sort({ uploadedAt: -1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getMedia", e);
    }
  }

  const store = getLocalStore();
  return store.media;
}

export async function createMedia(data: any) {
  const mediaData = { ...data, uploadedAt: new Date().toISOString() };
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Media.create(mediaData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on createMedia", e);
    }
  }

  const store = getLocalStore();
  const newMedia = { ...mediaData, id: `med-${Date.now()}` };
  store.media.unshift(newMedia);
  saveLocalStore(store);
  return newMedia;
}

export async function deleteMedia(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Media.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on deleteMedia", e);
    }
  }

  const store = getLocalStore();
  store.media = store.media.filter((m) => m.id !== id && (m as any)._id !== id);
  saveLocalStore(store);
  return true;
}

// -------------------------------------------------------------
// HOMEPAGE SETTINGS REPOSITORY
// -------------------------------------------------------------
export async function getHomepageSettings() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      let doc = await HomepageSettings.findOne().lean();
      if (!doc) {
        doc = await HomepageSettings.create(initialSeedData.homepageSettings);
      }
      return serializeDoc(doc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getHomepageSettings", e);
    }
  }

  const store = getLocalStore();
  return store.homepageSettings;
}

export async function updateHomepageSettings(data: any) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await HomepageSettings.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
      return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updateHomepageSettings", e);
    }
  }

  const store = getLocalStore();
  store.homepageSettings = { ...store.homepageSettings, ...data };
  saveLocalStore(store);
  return store.homepageSettings;
}

// -------------------------------------------------------------
// SITE SETTINGS REPOSITORY
// -------------------------------------------------------------
export async function getSiteSettings() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      let doc = await SiteSettings.findOne().lean();
      if (!doc) {
        doc = await SiteSettings.create(initialSeedData.siteSettings);
      }
      return serializeDoc(doc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getSiteSettings", e);
    }
  }

  const store = getLocalStore();
  return store.siteSettings;
}

export async function updateSiteSettings(data: any) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await SiteSettings.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
      return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updateSiteSettings", e);
    }
  }

  const store = getLocalStore();
  store.siteSettings = { ...store.siteSettings, ...data };
  saveLocalStore(store);
  return store.siteSettings;
}

// -------------------------------------------------------------
// PAGES REPOSITORY
// -------------------------------------------------------------
export async function getPages() {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const items = await Page.find().sort({ title: 1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getPages", e);
    }
  }

  const store = getLocalStore();
  return store.pages;
}

export async function getPageBySlug(slug: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const item = await Page.findOne({ slug }).lean();
      if (item) return serializeDoc(item);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getPageBySlug", e);
    }
  }

  const store = getLocalStore();
  return store.pages.find((p) => p.slug === slug) || null;
}

export async function createPage(data: any) {
  const slug = data.slug ? slugify(data.slug, { lower: true, strict: true }) : slugify(data.title, { lower: true, strict: true });
  const pageData = { ...data, slug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const created = await Page.create(pageData);
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on createPage", e);
    }
  }

  const store = getLocalStore();
  const newPage = { ...pageData, id: `page-${Date.now()}` };
  store.pages.push(newPage);
  saveLocalStore(store);
  return newPage;
}

export async function updatePage(id: string, data: any) {
  if (data.slug) data.slug = slugify(data.slug, { lower: true, strict: true });
  data.updatedAt = new Date().toISOString();

  const conn = await connectToDatabase();
  if (conn) {
    try {
      const updated = await Page.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return serializeDoc(updated);
    } catch (e) {
      console.warn("[MongoDB] Fallback on updatePage", e);
    }
  }

  const store = getLocalStore();
  const idx = store.pages.findIndex((p) => p.id === id || (p as any)._id === id);
  if (idx !== -1) {
    store.pages[idx] = { ...store.pages[idx], ...data };
    saveLocalStore(store);
    return store.pages[idx];
  }
  return null;
}

export async function deletePage(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await Page.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on deletePage", e);
    }
  }

  const store = getLocalStore();
  store.pages = store.pages.filter((p) => p.id !== id && (p as any)._id !== id);
  saveLocalStore(store);
  return true;
}

// -------------------------------------------------------------
// NEWSLETTER SUBSCRIBERS REPOSITORY
// -------------------------------------------------------------
export async function getNewsletterSubscribers(params: { search?: string; status?: string } = {}) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const query: any = {};
      if (params.status) query.status = params.status;
      if (params.search) query.email = { $regex: params.search, $options: "i" };
      const items = await NewsletterSubscriber.find(query).sort({ subscribedAt: -1 }).lean();
      return items.map(serializeDoc);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getNewsletterSubscribers", e);
    }
  }

  const store = getLocalStore();
  let list = store.newsletterSubscribers;
  if (params.status) list = list.filter((s) => s.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter((s) => s.email.toLowerCase().includes(q));
  }
  return list;
}

export async function addNewsletterSubscriber(email: string) {
  const cleanEmail = email.toLowerCase().trim();
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
      if (existing) {
        if (existing.status === "unsubscribed") {
          existing.status = "active";
          existing.subscribedAt = new Date();
          await existing.save();
        }
        return serializeDoc(existing);
      }
      const created = await NewsletterSubscriber.create({ email: cleanEmail, status: "active" });
      return serializeDoc(created);
    } catch (e) {
      console.warn("[MongoDB] Fallback on addNewsletterSubscriber", e);
    }
  }

  const store = getLocalStore();
  const existing = store.newsletterSubscribers.find((s) => s.email === cleanEmail);
  if (existing) {
    existing.status = "active";
    existing.subscribedAt = new Date().toISOString();
    saveLocalStore(store);
    return existing;
  }
  const newSub = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    status: "active" as const,
    subscribedAt: new Date().toISOString(),
  };
  store.newsletterSubscribers.unshift(newSub);
  saveLocalStore(store);
  return newSub;
}

export async function unsubscribeNewsletter(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await NewsletterSubscriber.findByIdAndUpdate(id, {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      });
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on unsubscribeNewsletter", e);
    }
  }

  const store = getLocalStore();
  const sub = store.newsletterSubscribers.find((s: any) => s.id === id || (s as any)._id === id) as any;
  if (sub) {
    sub.status = "unsubscribed";
    sub.unsubscribedAt = new Date().toISOString();
    saveLocalStore(store);
    return true;
  }
  return false;
}

export async function deleteNewsletterSubscriber(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      await NewsletterSubscriber.findByIdAndDelete(id);
      return true;
    } catch (e) {
      console.warn("[MongoDB] Fallback on deleteNewsletterSubscriber", e);
    }
  }

  const store = getLocalStore();
  store.newsletterSubscribers = store.newsletterSubscribers.filter((s) => s.id !== id && (s as any)._id !== id);
  saveLocalStore(store);
  return true;
}

// -------------------------------------------------------------
// USERS REPOSITORY (AUTH)
// -------------------------------------------------------------
export async function getUserByEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim();
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const user = await User.findOne({ email: cleanEmail }).lean();
      if (user) return serializeDoc(user);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getUserByEmail", e);
    }
  }

  const store = getLocalStore();
  return store.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export async function getUserById(id: string) {
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const user = await User.findById(id).lean();
      if (user) return serializeDoc(user);
    } catch (e) {
      console.warn("[MongoDB] Fallback on getUserById", e);
    }
  }

  const store = getLocalStore();
  return store.users.find((u) => u.id === id || (u as any)._id === id) || null;
}

// -------------------------------------------------------------
// DASHBOARD STATS
// -------------------------------------------------------------
export async function getDashboardStats() {
  await checkScheduledPosts();
  const postsResult = await getPosts({ limit: 1000, status: "" });
  const allPosts = postsResult.posts;
  const categories = await getCategories();
  const tags = await getTags();
  const authors = await getAuthors();
  const subscribers = await getNewsletterSubscribers();

  return {
    totalArticles: allPosts.length,
    publishedArticles: allPosts.filter((p) => p.status === "published").length,
    draftArticles: allPosts.filter((p) => p.status === "draft").length,
    scheduledArticles: allPosts.filter((p) => p.status === "scheduled").length,
    categoriesCount: categories.length,
    tagsCount: tags.length,
    authorsCount: authors.length,
    subscribersCount: subscribers.filter((s) => s.status === "active").length,
    recentArticles: allPosts.slice(0, 5),
  };
}

// -------------------------------------------------------------
// SCHEDULED PUBLISHING CRON HELPER
// -------------------------------------------------------------
export async function checkScheduledPosts() {
  const now = new Date();
  const conn = await connectToDatabase();
  if (conn) {
    try {
      const scheduled = await Post.find({
        status: "scheduled",
        scheduledAt: { $lte: now },
      });
      for (const p of scheduled) {
        p.status = "published";
        p.publishedAt = p.scheduledAt || now;
        await p.save();
      }
      return scheduled.length;
    } catch (e) {
      // Ignore
    }
  }

  const store = getLocalStore();
  let changed = 0;
  for (const p of store.posts as any[]) {
    if (p.status === "scheduled" && p.scheduledAt && new Date(p.scheduledAt) <= now) {
      p.status = "published";
      p.publishedAt = p.scheduledAt;
      changed++;
    }
  }
  if (changed > 0) {
    saveLocalStore(store);
  }
  return changed;
}

// Helper to serialize MongoDB docs to plain JS objects with consistent string IDs
function serializeDoc(doc: any) {
  if (!doc) return doc;
  const obj = { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  if (obj.__v !== undefined) delete obj.__v;
  return obj;
}
