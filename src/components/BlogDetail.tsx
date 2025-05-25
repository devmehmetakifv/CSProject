import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockBlogs } from '../data/mockBlogs';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const blog = mockBlogs.find(b => b.slug === slug);

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← Back to all posts
      </Link>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <Link 
              to={`/?category=${encodeURIComponent(blog.category)}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {blog.category}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center mb-8">
            <div className="text-gray-600">
              By{' '}
              <Link 
                to={`/authors?author=${encodeURIComponent(blog.author)}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {blog.author}
              </Link>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-8 flex justify-between items-center">
        <Link
          to={`/?category=${encodeURIComponent(blog.category)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← More posts in {blog.category}
        </Link>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800"
        >
          View all posts →
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail; 