import { listCategories } from "@/lib/actions";
import { serializeCategory } from "@/lib/serialize";
import { CategoryManager } from "@/components/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = (await listCategories()).map(serializeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tag your entries so you can see where money is going.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
