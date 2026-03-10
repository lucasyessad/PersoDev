'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Erreur</h1>
      <p className="mt-2 text-gray-600">Une erreur est survenue</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Réessayer
      </button>
    </div>
  );
}
