export default function EspaceLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}
