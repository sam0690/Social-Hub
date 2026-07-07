"use client";

type Props = {
  src?: string;
  name?: string;
  size?: number;
  online?: boolean;
};

export default function Avatar({ name, size = 40, online = false }: Props) {
  return (
    <div className="relative inline-block">
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-linear-to-br from-indigo-500 via-blue-500 to-fuchsia-500 text-2xl font-bold text-white flex items-center justify-center overflow-hidden"
      >
        {(name || "U").slice(0, 2)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 ring-1 dark:ring-black" />
      )}
    </div>
  );
}
