import { blogPosts } from "@/data/blog";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Mega Tools Blog - Tips, Guides & Smart Calculations",
  description: "Read our latest articles on health, finance, and productivity. Learn how to make the most of our smart tools.",
};

export default function BlogListing() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container">
        <h1 className="text-5xl font-black text-gray-900 mb-12 text-center">Mega Tools Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-48 w-full">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-sm text-primary-600 font-bold mb-4">
                  <span>{post.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 font-medium">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary-600 transition">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-primary-600 font-bold hover:underline">
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
