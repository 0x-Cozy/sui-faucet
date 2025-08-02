import Skeleton from './Skeleton';

const SkeletonStatus = () => {
  return (
    <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
      <Skeleton height="h-5" width="w-1/3" className="mb-3 md:mb-4" />
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
          <div className="mb-2 sm:mb-0">
            <Skeleton height="h-4" width="w-24" className="mb-1" />
            <Skeleton height="h-3" width="w-32" />
          </div>
          <Skeleton height="h-6" width="w-16" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 border-b border-sui-border">
          <div className="mb-2 sm:mb-0">
            <Skeleton height="h-4" width="w-28" className="mb-1" />
            <Skeleton height="h-3" width="w-36" />
          </div>
          <Skeleton height="h-6" width="w-16" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3">
          <div className="mb-2 sm:mb-0">
            <Skeleton height="h-4" width="w-20" className="mb-1" />
            <Skeleton height="h-3" width="w-40" />
          </div>
          <Skeleton height="h-6" width="w-20" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonStatus; 