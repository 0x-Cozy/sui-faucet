import Skeleton from './Skeleton';

const SkeletonTable = () => {
  return (
    <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
      <Skeleton height="h-5" width="w-1/3" className="mb-3 md:mb-4" />
      <div className="space-y-3 md:space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border last:border-b-0">
            <div className="mb-2 sm:mb-0 flex-1">
              <Skeleton height="h-4" width="w-32" className="mb-1" />
              <Skeleton height="h-3" width="w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton height="h-6" width="w-16" />
              <Skeleton height="h-6" width="w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable; 