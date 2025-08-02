import Skeleton from './Skeleton';

const SkeletonChart = () => {
  return (
    <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
      <Skeleton height="h-5" width="w-1/2" className="mb-3 md:mb-4" />
      <div className="space-y-2">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton height="h-3" width="w-16" />
            <Skeleton height="h-3" width="w-full" />
            <Skeleton height="h-3" width="w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonChart; 