import Home from "@/components/home";
import { getTexts } from "@/lib/store";
export const dynamic = "force-dynamic";
export function generateMetadata() {
  const { value: t } = getTexts();
  return { title: t.seo_title, description: t.seo_description };
}
export default function Page() {
  return <Home t={getTexts().value} />;
}
