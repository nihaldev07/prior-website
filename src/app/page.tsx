import axios from "axios";
import { config } from "@/lib/config";
import HomePage from "@/components/pages/Home";

export default async function Home() {
  try {
    const [categoryResponse, productResponse] = await Promise.all([
      axios.get(config.product.getCategories()),
      axios.get(config.product.getNewProducts()),
    ]);

    const categories = categoryResponse?.data?.success
      ? categoryResponse.data.data
      : [];
    const products = productResponse?.data ?? [];

    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <HomePage categories={categories} products={products} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <p>Error loading data</p>
      </main>
    );
  }
}
