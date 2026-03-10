import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Aqar<span className="text-blue-600">Vision</span>
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-gray-600">
        Plateforme immobilière multi-agences pour le marché algérien
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/agence/demo"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Voir une démo
        </Link>
      </div>
    </div>
  );
}
