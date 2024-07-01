import { Skeleton } from "@nextui-org/react";

const ListboxItemsSkeleton = () => {
  return (
    <div>
      <div className="max-w-[300px] w-full flex items-center gap-3 pt-4 px-4">
        <div>
          <Skeleton className="flex rounded-lg w-6 h-6" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
      </div>
      <div className="max-w-[300px] w-full flex items-center gap-3 pt-4 px-4">
        <div>
          <Skeleton className="flex rounded-lg w-6 h-6" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
      </div>
      <div className="max-w-[300px] w-full flex items-center gap-3 pt-4 px-4">
        <div>
          <Skeleton className="flex rounded-lg w-6 h-6" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-5 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ListboxItemsSkeleton;
