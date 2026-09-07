import { LinkForm } from "@/app/links/link-form";
import { LinkRowActions } from "@/app/links/link-row-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listLinks } from "@/lib/links";

export default async function LinksPage() {
  const links = await listLinks();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Links</h1>
        <p className="text-muted-foreground text-sm">
          Create, edit, and manage your short links here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a short link</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your links</CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No links yet — create one above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short link</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">/{link.slug}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {link.url}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(link.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <LinkRowActions id={link.id} slug={link.slug} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
