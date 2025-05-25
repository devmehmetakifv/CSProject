import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockBlogs } from '../data/mockBlogs';
import { Blog } from '../types/blog';

const BlogList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    return mockBlogs
      .filter(blog => !selectedCategory || blog.category === selectedCategory)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {selectedCategory && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Posts in {selectedCategory}
          </h1>
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            ← View all posts
          </Link>
        </div>
      )}

      {!selectedCategory && (
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h1>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No posts found{selectedCategory ? ` in category "${selectedCategory}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map(blog => (
            <article 
              key={blog.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span className="text-blue-600">{blog.category}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  <Link 
                    to={`/blogs/${blog.slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    By {blog.author}
                  </span>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList; 