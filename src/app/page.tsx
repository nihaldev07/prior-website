import HomePage from "@/components/pages/Home";
import { config } from "@/lib/config";

async function fetchCategoriesAndProducts() {
  try {
    // Fetch new products, you can also fetch categories if needed
    const productResponse = await fetch(config.product.getNewProducts(), {
      method: "GET", // Specify method
      cache: "force-cache", // Use cache if available
    });

    // Check if the response is OK (status 200)
    if (!productResponse.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await productResponse.json();
    return { products: products || [] }; // Default to an empty array if no products found
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] }; // Return an empty array on error
  }
}

export default async function Home() {
  const { products } = await fetchCategoriesAndProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HomePage products={products} />
    </main>
  );
}
