import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
