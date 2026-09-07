import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { getLinkBySlug } from "@/lib/links";

export async function GET(_req: Request, ctx: RouteContext<"/[code]">) {
  const { code } = await ctx.params;

  const link = await getLinkBySlug(code);
  if (!link) notFound();

  return NextResponse.redirect(link.url);
}
