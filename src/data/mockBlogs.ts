import { Blog } from '../types/blog';

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: `TypeScript brings static typing to JavaScript, making it easier to build and maintain large applications. 
    When combined with React, it provides a powerful development experience with better tooling and error catching.
    
    In this post, we'll explore how to set up a new React project with TypeScript, understand basic type definitions,
    and implement some common patterns in a type-safe way.`,
    author: 'Sarah Johnson',
    category: 'Programming',
    slug: 'getting-started-with-react-typescript',
    publishedAt: '2024-03-15',
    excerpt: 'Learn how to set up and use React with TypeScript for better development experience.'
  },
  {
    id: '2',
    title: 'The Future of Web Development',
    content: `Web development is constantly evolving, with new frameworks, tools, and best practices emerging regularly.
    In this article, we'll look at the current trends and what might be coming next in the world of web development.
    
    From serverless architectures to WebAssembly, we'll explore the technologies that are shaping the future of the web.`,
    author: 'Michael Chen',
    category: 'Technology',
    slug: 'future-of-web-development',
    publishedAt: '2024-03-14',
    excerpt: 'Exploring upcoming trends and technologies in web development.'
  },
  {
    id: '3',
    title: 'Building Accessible Web Applications',
    content: `Accessibility is not just a nice-to-have feature; it's a crucial aspect of modern web development.
    This guide will walk you through the key principles of web accessibility and how to implement them in your applications.
    
    We'll cover semantic HTML, ARIA attributes, keyboard navigation, and testing tools to ensure your web apps are accessible to everyone.`,
    author: 'Emma Davis',
    category: 'Web Development',
    slug: 'building-accessible-web-applications',
    publishedAt: '2024-03-13',
    excerpt: 'A comprehensive guide to implementing accessibility in web applications.'
  },
  {
    id: '4',
    title: 'State Management in React Applications',
    content: `Choosing the right state management solution is crucial for building scalable React applications.
    In this post, we'll compare different state management approaches, from local state to global solutions like Redux and Zustand.
    
    Learn about the pros and cons of each approach and when to use them in your projects.`,
    author: 'David Wilson',
    category: 'Programming',
    slug: 'state-management-react-applications',
    publishedAt: '2024-03-12',
    excerpt: 'Comparing different state management solutions in React applications.'
  },
  {
    id: '5',
    title: 'The Art of Clean Code',
    content: `Writing clean, maintainable code is an art that every developer should master.
    This article explores the principles of clean code and how to apply them in your daily development work.
    
    From meaningful naming to proper function organization, learn how to write code that's easy to understand and maintain.`,
    author: 'Sarah Johnson',
    category: 'Best Practices',
    slug: 'art-of-clean-code',
    publishedAt: '2024-03-11',
    excerpt: 'Learn the principles and practices of writing clean, maintainable code.'
  }
]; 