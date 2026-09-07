import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listLinks } from "@/lib/links";

export default async function DashboardPage() {
  const links = await listLinks();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your short links and click activity will live here.
        </p>
      </div>

      <Card className="w-fit min-w-48">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{links.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
