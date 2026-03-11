export default function RechercheLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="h-12 animate-pulse bg-muted rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}
