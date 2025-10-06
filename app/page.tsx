"use client";

import { useState, useEffect } from "react";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { getAmplifyClient } from "@/lib/amplify-client";

export default function Home() {
  const [blogs, setBlogs] = useState<Array<Schema["Blog"]["type"]>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Use getAmplifyClient for query operations (allows unauthenticated access)
      const client = getAmplifyClient();
      const { data: items, errors } = await client.models.Blog.list();

      if (errors) {
        console.error("Failed to fetch blogs:", errors);
        return;
      }

      // Sort by creation time (newest first)
      const sortedBlogs = [...items].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">
            Welcome to Blog Platform 🎉
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Discover great content, share your thoughts
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 text-lg">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl mb-4">No blog posts yet</p>
            <p className="text-base">Be the first to share content!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200"
              >
                <Link href={`/blog/${blog.id}`}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h2>
                  <div className="text-sm text-gray-500 mb-4">
                    Author: {blog.author} · {formatDate(blog.createdAt)}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {blog.content && blog.content.length > 200
                      ? blog.content.substring(0, 200) + "..."
                      : blog.content}
                  </p>
                  <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Read more →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
