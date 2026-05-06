import Link from "next/link";
import * as Icons from "lucide-react";
import { Tool } from "@/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  // @ts-ignore
  const Icon = Icons[tool.icon] || Icons.Calculator;

  return (
    <Link 
      href={`/tools/${tool.category}/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary-200"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
        {tool.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {tool.shortDescription}
      </p>
    </Link>
  );
}
