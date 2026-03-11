export default function PricingLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="h-8 w-64 mx-auto animate-pulse bg-muted rounded" />
        <div className="h-4 w-96 mx-auto animate-pulse bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
