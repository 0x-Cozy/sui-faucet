import Skeleton from './Skeleton';

const SkeletonForm = () => {
  return (
    <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
      <Skeleton height="h-5" width="w-1/2" className="mb-3 md:mb-4" />
      <div className="space-y-3 md:space-y-4">
        <div>
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-10" width="w-full" />
        </div>
        <div>
          <Skeleton height="h-4" width="w-32" className="mb-2" />
          <Skeleton height="h-10" width="w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton height="h-10" width="w-24" />
          <Skeleton height="h-10" width="w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonForm; 