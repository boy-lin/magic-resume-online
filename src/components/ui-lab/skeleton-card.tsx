import { Skeleton } from "../ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="w-full h-full p-4">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
