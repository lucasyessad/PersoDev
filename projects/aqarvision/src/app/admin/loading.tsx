export default function AdminLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted rounded" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}
