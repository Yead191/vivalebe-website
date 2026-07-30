import { myFetch } from "@/helpers/myFetch";

interface RulePageProps {
  type: "PRIVACY" | "TERMS" | "ABOUT";
  title: string;
}

export async function RulePageView({ type, title }: RulePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await myFetch<any>(`/rule?type=${type}`, {
    method: "GET",
    next: { tags: ["rule", type] },
  });

  const ruleData = res.data;

  // Extract content assuming it might be in different fields based on standard API structures
  // Some APIs return an array of rules if type is passed as query param, some return a single object.
  const content = Array.isArray(ruleData)
    ? ruleData[0]?.content || ruleData[0]?.description || ""
    : ruleData?.content || ruleData?.description || "";

  const pageTitle = Array.isArray(ruleData)
    ? ruleData[0]?.title || title
    : ruleData?.title || title;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-brand">
        {pageTitle}
      </h1>

      {content ? (
        <div
          className="prose prose-brand max-w-none text-foreground/80"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-muted-foreground">
          No content available at the moment.
        </p>
      )}
    </div>
  );
}
