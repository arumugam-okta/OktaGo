import { Link2 } from "lucide-react";

import { LinkForm } from "@/app/links/link-form";
import { LinkRowActions } from "@/app/links/link-row-actions";
import { Card, CardContent } from "@/components/ui/card";
import { listLinks } from "@/lib/links";

export default async function LinksPage() {
  const links = await listLinks();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Links</h1>
        <p className="text-muted-foreground text-sm">
          Create, edit, and manage your short links here.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent>
          <LinkForm />
        </CardContent>
      </Card>

      {links.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No links yet — create one above.
        </p>
      ) : (
        <div className="flex w-full max-w-2xl flex-col gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 rounded-full border bg-card p-2 pl-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
                <Link2 className="size-4 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href={`/${link.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link block truncate text-sm font-semibold underline-offset-4 hover:underline"
                >
                  /{link.slug}
                </a>
                <p className="truncate text-xs text-muted-foreground">
                  <span aria-hidden>↳ </span>
                  {link.url}
                </p>
              </div>
              <LinkRowActions id={link.id} slug={link.slug} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
