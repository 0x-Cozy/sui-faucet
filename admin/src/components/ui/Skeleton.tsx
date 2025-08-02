interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) => {
  return (
    <div 
      className={`${width} ${height} bg-sui-dark border border-sui-border rounded-sm animate-pulse ${className}`}
    />
  );
};

export default Skeleton; 