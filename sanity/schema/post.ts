export const postSchema = {
  name: "post",
  title: "Article",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt / Dek",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Featured Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "readingTime",
      title: "Reading Time (e.g. 6 min read)",
      type: "string",
    },
    {
      name: "featured",
      title: "Featured on Homepage Hero",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "body",
      title: "Portable Text Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        },
      ],
    },
  ],
};

