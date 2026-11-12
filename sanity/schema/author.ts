export const authorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "role",
      title: "Role / Credentials",
      type: "string",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
    },
    {
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: { hotspot: true },
    },
  ],
};

