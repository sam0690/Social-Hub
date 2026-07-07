import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Skeleton className="hidden h-160 rounded-3xl lg:block" />
          <div className="space-y-4">
            <Skeleton className="h-16 rounded-3xl lg:hidden" />
            <Skeleton className="h-160 rounded-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
