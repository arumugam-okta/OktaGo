"use server";

import { revalidatePath } from "next/cache";

import { createShortLink, deleteLink } from "@/lib/links";

export async function createLinkAction(
  formData: FormData
): Promise<{ error: string | null }> {
  const url = String(formData.get("url") ?? "");
  const customSlug = String(formData.get("customSlug") ?? "").trim() || undefined;

  const { error } = await createShortLink({ url, customSlug });
  if (error) return { error };

  revalidatePath("/links");
  revalidatePath("/");
  return { error: null };
}

export async function deleteLinkAction(id: string): Promise<void> {
  await deleteLink(id);
  revalidatePath("/links");
  revalidatePath("/");
}
