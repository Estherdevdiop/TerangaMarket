export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#f0e8d8]">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-5 rounded-full w-16" />
          <div className="skeleton h-5 rounded-full w-12" />
        </div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-6 rounded-lg w-28" />
          <div className="skeleton h-8 rounded-xl w-20" />
        </div>
      </div>
    </div>
  )
}
