import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./CodeBlock";
import { CodeUse } from "@/lib/CodeSnippet";

interface CodeTab {
  key: string;
  code: string;
  label: string;
  language: string;
}

interface PageTabsProps {
  tabs: CodeTab[];
  defaultTab?: string;
}

const PageTabs = ({ tabs, defaultTab }: PageTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.label} className="">
      <TabsList>
        {tabs.map((t) => {
          return (
            <TabsTrigger value={t.label} key={t.key}>
              {t.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((t) => {
        return (
          <TabsContent key={t.key} value={t.label}>
            <CodeBlock code={t.code} language={t.language} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default PageTabs;
