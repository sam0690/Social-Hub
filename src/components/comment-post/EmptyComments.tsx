export function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center h-full">
      <div className="mb-3 text-3xl">💬</div>
      <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">No comments yet</p>
      <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">Be the first to join the conversation.</p>
    </div>
  );
}