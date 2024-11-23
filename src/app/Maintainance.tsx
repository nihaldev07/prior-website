import Image from "next/image";
import LogoImg from "@/images/logo.png";

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <Image src={LogoImg} alt="Logo" width={150} height={150} />
      <h1 className="text-3xl font-bold mt-6 text-gray-800">
        We’ll Be Back Soon!
      </h1>
      <p className="mt-4 text-gray-600">
        Our site is currently undergoing maintenance. We’re coming back with
        **new products** and **exciting features** to serve you better.
      </p>
      <p className="mt-4 text-gray-600">
        Thank you for your patience and support!
      </p>
      <footer className="mt-8 text-gray-500 text-sm">— Prior Team</footer>
    </div>
  );
}
