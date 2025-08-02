import Skeleton from './Skeleton';

const SkeletonCard = () => {
  return (
    <div className="bg-sui-dark border-2 border-sui-border rounded-sm p-4 md:p-6">
      <Skeleton height="h-4" width="w-3/4" className="mb-2" />
      <Skeleton height="h-8 md:h-10" width="w-1/2" className="mb-2" />
      <Skeleton height="h-3" width="w-full" />
    </div>
  );
};

export default SkeletonCard; 