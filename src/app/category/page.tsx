import { redirect } from "next/navigation";

export default function CategoryPage() {
  // Redirect from "/category" to "/collection"
  redirect("/collections");

  return null; // This will never be rendered since we are redirecting
}
