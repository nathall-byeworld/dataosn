import React, { useState } from 'react';
import { PenTool, Eye, CreditCard as Edit3, Save, Plus, Trash2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPage: React.FC = () => {
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Welcome to My Blog! 🎉',
      content: `# Welcome to My Blog!

This is a sample blog post to show you what's possible! 

## Features ✨

- **LaTeX Math**: You can write beautiful equations like $E = mc^2$ inline or as blocks:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

- **Links**: Check out [Google](https://google.com) or [GitHub](https://github.com)
- **Emojis**: 🚀 🎯 💡 🔥 ⭐ 🎨 📚 💻

## More Math Examples

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

A beautiful integral:
$$\\oint_C f(z) dz = 2\\pi i \\sum \\text{Res}(f, a_k)$$

## Code and Text

You can write about algorithms, competitive programming, or anything else!

Happy blogging! 😊`,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const renderContent = (content: string) => {
    // Split content by lines and process each line
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      // Block math ($$...$$)
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
        const math = line.trim().slice(2, -2);
        elements.push(
          <div key={i} className="my-4 text-center">
            <BlockMath math={math} />
          </div>
        );
      }
      // Multi-line block math
      else if (line.trim() === '$$') {
        i++;
        let mathContent = '';
        while (i < lines.length && lines[i].trim() !== '$$') {
          mathContent += lines[i] + '\n';
          i++;
        }
        if (mathContent.trim()) {
          elements.push(
            <div key={i} className="my-4 text-center">
              <BlockMath math={mathContent.trim()} />
            </div>
          );
        }
      }
      // Headers
      else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-3xl font-bold mt-6 mb-4">{processInlineContent(line.slice(2))}</h1>);
      }
      else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold mt-5 mb-3">{processInlineContent(line.slice(3))}</h2>);
      }
      else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-bold mt-4 mb-2">{processInlineContent(line.slice(4))}</h3>);
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(<br key={i} />);
      }
      // Regular paragraphs
      else {
        elements.push(<p key={i} className="mb-2 leading-relaxed">{processInlineContent(line)}</p>);
      }
      i++;
    }

    return elements;
  };

  const processInlineContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Inline math $...$
      const mathMatch = remaining.match(/\$([^$]+)\$/);
      if (mathMatch) {
        const beforeMath = remaining.substring(0, mathMatch.index);
        if (beforeMath) {
          elements.push(...processTextContent(beforeMath, key));
          key += beforeMath.length;
        }
        elements.push(<InlineMath key={key++} math={mathMatch[1]} />);
        remaining = remaining.substring((mathMatch.index || 0) + mathMatch[0].length);
      } else {
        elements.push(...processTextContent(remaining, key));
        break;
      }
    }

    return elements;
  };

  const processTextContent = (text: string, startKey: number): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let key = startKey;

    while (remaining.length > 0) {
      // Links [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const beforeLink = remaining.substring(0, linkMatch.index);
        if (beforeLink) {
          elements.push(...processBoldText(beforeLink, key));
          key += beforeLink.length;
        }
        elements.push(
          <a 
            key={key++} 
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.substring((linkMatch.index || 0) + linkMatch[0].length);
      } else {
        elements.push(...processBoldText(remaining, key));
        break;
      }
    }

    return elements;
  };

  const processBoldText = (text: string, startKey: number): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let key = startKey;

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      if (boldMatch) {
        const beforeBold = remaining.substring(0, boldMatch.index);
        if (beforeBold) {
          elements.push(<span key={key++}>{beforeBold}</span>);
        }
        elements.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.substring((boldMatch.index || 0) + boldMatch[0].length);
      } else {
        elements.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <PenTool className="h-10 w-10 mr-3 text-purple-600" />
          My Blog
        </h1>
        <p className="text-xl text-gray-600">
          Write posts with LaTeX equations, links, and emojis! ✨
        </p>
      </div>

      {/* Blog Posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  Created: {post.createdAt.toLocaleDateString()} 
                  {post.updatedAt > post.createdAt && (
                    <span> • Updated: {post.updatedAt.toLocaleDateString()}</span>
                  )}
                </p>
              </div>
              
              <div className="prose max-w-none">
                <div className="text-gray-800">
                  {renderContent(post.content)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;