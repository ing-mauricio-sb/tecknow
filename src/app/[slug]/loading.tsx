import { Skeleton } from "@/components/ui";

export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="max-w-[720px] space-y-4">
          <Skeleton className="aspect-[16/9] rounded-xl" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-6 h-32 rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="hidden space-y-4 lg:block">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
