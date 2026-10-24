export default function SkeletonCard() {
  return (
    <div className="bg-white border border-orange-100 rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 w-24 bg-orange-100 rounded-md" />
        <div className="h-4 w-20 bg-gray-100 rounded-md" />
      </div>
      <div className="h-5 w-3/4 bg-gray-100 rounded-lg" />
      <div className="h-3.5 w-1/2 bg-gray-100 rounded" />
      <div className="h-3.5 w-1/3 bg-gray-100 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-orange-50 rounded-md" />
        <div className="h-6 w-24 bg-orange-50 rounded-md" />
      </div>
    </div>
  );
}
