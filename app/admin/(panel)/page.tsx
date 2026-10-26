import { requireAdmin } from "@/lib/auth";
import { getTexts } from "@/lib/store";
import { TextsForm } from "@/components/admin-forms";
export default async function AdminPage() {
  await requireAdmin();
  const texts = getTexts();
  return (
    <>
      <div className="admin-head">
        <h1>Textos do site</h1>
        <p>Edite qualquer texto, contato e SEO. As alterações vão ao ar ao salvar.</p>
      </div>
      <TextsForm texts={texts.value} revision={texts.revision} />
    </>
  );
}
