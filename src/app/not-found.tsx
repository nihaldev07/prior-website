import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
      <h2 className='text-xl font-semibold text-gray-900 mb-2'>
        Page not found
      </h2>
      <p className='text-gray-500 mb-6'>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href='/'
        className='px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 transition-opacity'>
        Back to home
      </Link>
    </div>
  );
}
