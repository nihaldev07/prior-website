// src/app/page.tsx

import HomePage from "@/components/pages/Home";
import { config } from "@/lib/config";

async function fetchCategoriesAndProducts() {
  const [categoryResponse, productResponse] = await Promise.all([
    fetch(config.product.getCategories()).then((res) => res.json()),
    fetch(config.product.getNewProducts()).then((res) => res.json()),
  ]);

  const categories = categoryResponse?.success ? categoryResponse.data : [];
  const products = productResponse ?? [];

  return { categories, products };
}

export default async function Home() {
  const { categories, products } = await fetchCategoriesAndProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HomePage categories={categories} products={products} />
    </main>
  );
}
