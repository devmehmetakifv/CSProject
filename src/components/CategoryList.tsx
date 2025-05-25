import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockBlogs } from '../data/mockBlogs';
import { Category } from '../types/blog';

const CategoryList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  // Calculate categories and their post counts
  const categories = useMemo(() => {
    const categoryMap = mockBlogs.reduce((acc, blog) => {
      acc[blog.category] = (acc[blog.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/?category=${encodeURIComponent(category.name)}`}
            className={`
              block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition
              ${currentCategory === category.name ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
            `}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {category.name}
            </h2>
            <p className="text-blue-600">
              {category.count} {category.count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 