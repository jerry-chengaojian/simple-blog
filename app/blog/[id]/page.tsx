"use client";

import { useState, useEffect } from "react";
import type { Schema } from "@/amplify/data/resource";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getAmplifyClient, getAuthenticatedClient } from "@/lib/amplify-client";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Schema["Blog"]["type"] | null>(null);
  const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>(
    []
  );
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchBlog();
    fetchComments();
  }, [params.id]);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const fetchBlog = async () => {
    try {
      // Use getAmplifyClient for query operations (allows unauthenticated access)
      const client = getAmplifyClient();
      const { data: blogData, errors } = await client.models.Blog.get({
        id: params.id,
      });

      if (errors) {
        console.error("Failed to fetch blog:", errors);
        setError("Failed to fetch blog");
        return;
      }

      setBlog(blogData);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Error fetching blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // Use getAmplifyClient for query operations (allows unauthenticated access)
      const client = getAmplifyClient();
      const { data: commentData, errors } = await client.models.Comment.list({
        filter: {
          blogId: {
            eq: params.id,
          },
        },
      });

      if (errors) {
        console.error("Failed to fetch comments:", errors);
        return;
      }

      // Sort by creation time
      const sortedComments = [...commentData].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });

      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      // Use getAuthenticatedClient for delete operations (requires authentication)
      const client = getAuthenticatedClient();
      await client.models.Blog.delete({ id: params.id });
      router.push("/");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in first");
      router.push("/auth");
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setCommentLoading(true);

    try {
      // Use getAuthenticatedClient for create operations (requires authentication)
      const client = getAuthenticatedClient();
      const author =
        user.signInDetails?.loginId || user.username || "Anonymous";

      await client.models.Comment.create({
        content: newComment.trim(),
        author,
        authorId: user.userId,
        blogId: params.id,
      });

      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      // Use getAuthenticatedClient for delete operations (requires authentication)
      const client = getAuthenticatedClient();
      await client.models.Comment.delete({ id: commentId });
      await fetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canDeleteBlog = user && blog && blog.authorId === user.userId;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-gray-600 text-lg">
            Loading...
          </div>
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl mb-4">{error || "Blog not found"}</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Blog content card */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {blog.title}
          </h1>
          <div className="text-sm text-gray-500 mb-6">
            Author: {blog.author} · {formatDate(blog.createdAt)}
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
            {blog.content}
          </div>
          {canDeleteBlog && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleDeleteBlog}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Blog
              </button>
            </div>
          )}
        </div>

        {/* Comments section card */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Comments ({comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="mb-4">
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-600 transition-colors resize-y min-h-[100px] font-sans"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your thoughts..."
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={commentLoading}
              >
                {commentLoading ? "Sending..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
              <p className="text-gray-600 mb-3">Log in to post comments</p>
              <button
                onClick={() => router.push("/auth")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Go to Login
              </button>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No comments yet, be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 border-l-4 border-blue-600 rounded-lg p-4"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {comment.author}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    {formatDate(comment.createdAt)}
                  </div>
                  <div className="text-gray-700">{comment.content}</div>
                  {user && comment.authorId === user.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="mt-3 px-4 py-1 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
