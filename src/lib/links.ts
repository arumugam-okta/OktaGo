import { iddb } from "@/lib/iddb";

export type Link = {
  id: string;
  slug: string;
  url: string;
  created_at: string;
};

const RESERVED_SLUGS = new Set([
  "links",
  "analytics",
  "settings",
  "api",
  "favicon.ico",
]);

const SLUG_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomSlug(length = 6): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  }
  return slug;
}

export async function listLinks(): Promise<Link[]> {
  const { data } = await iddb
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Link[];
}

export async function getLinkBySlug(slug: string): Promise<Link | null> {
  const { data } = await iddb.from("links").select("*").eq("slug", slug).single();
  return (data as Link) ?? null;
}

export async function createShortLink(input: {
  url: string;
  customSlug?: string;
}): Promise<{ link: Link | null; error: string | null }> {
  const url = input.url.trim();
  try {
    new URL(url);
  } catch {
    return { link: null, error: "Enter a valid URL, including https://" };
  }

  let slug = input.customSlug?.trim();

  if (slug) {
    if (RESERVED_SLUGS.has(slug)) {
      return { link: null, error: `"${slug}" is reserved, pick another` };
    }
    if (await getLinkBySlug(slug)) {
      return { link: null, error: `"${slug}" is already taken` };
    }
  } else {
    do {
      slug = randomSlug();
    } while (await getLinkBySlug(slug));
  }

  const { data } = await iddb
    .from("links")
    .insert({
      id: crypto.randomUUID(),
      slug,
      url,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { link: data as Link, error: null };
}

export async function deleteLink(id: string): Promise<void> {
  await iddb.from("links").delete().eq("id", id);
}
