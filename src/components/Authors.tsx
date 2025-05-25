import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockBlogs } from '../data/mockBlogs';
import { Author } from '../types/blog';

const Authors: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedAuthor = searchParams.get('author');

  // Calculate authors and their post counts
  const authors = useMemo(() => {
    const authorMap = mockBlogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(authorMap)
      .map(([name, postCount]) => ({
        name,
        postCount
      }))
      .sort((a, b) => b.postCount - a.postCount);
  }, []);

  // Filter blogs by selected author
  const authorBlogs = useMemo(() => {
    if (!selectedAuthor) return [];
    return mockBlogs
      .filter(blog => blog.author === selectedAuthor)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [selectedAuthor]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {selectedAuthor ? `Posts by ${selectedAuthor}` : 'Authors'}
      </h1>

      {selectedAuthor ? (
        <>
          <Link 
            to="/authors"
            className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
          >
            ← Back to all authors
          </Link>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {authorBlogs.map(blog => (
              <article 
                key={blog.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
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

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authors.map(author => (
            <Link
              key={author.name}
              to={`/authors?author=${encodeURIComponent(author.name)}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {author.name}
              </h2>
              <p className="text-blue-600">
                {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Authors; 