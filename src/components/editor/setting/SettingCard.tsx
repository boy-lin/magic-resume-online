import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SettingCard({
  icon,
  title,
  children,
}: {
  icon?: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "shadow-sm bg-white shadow-gray-100/50 dark:bg-neutral-900 dark:shadow-neutral-900/50"
      )}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <span className={cn("dark:text-neutral-200", "text-gray-700")}>
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
