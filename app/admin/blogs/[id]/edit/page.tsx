import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db/repository";
import { ArticleEditor } from "@/components/admin/article-editor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <ArticleEditor initialData={post} isEditing={true} />;
}
