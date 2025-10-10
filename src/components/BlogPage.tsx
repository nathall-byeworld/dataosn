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
  const [posts, setPosts] = useState<BlogPost[]>([
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
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({});

  const createPost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const updatePost = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, title: newTitle, content: newContent, updatedAt: new Date() }
        : post
    ));
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const startEditing = (post: BlogPost) => {
    setEditingId(post.id);
    setNewTitle(post.title);
    setNewContent(post.content);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const togglePreview = (postId: string) => {
    setPreviewMode(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

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

      {/* Create New Post Button */}
      <div className="mb-8">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Create/Edit Post Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isCreating ? 'Create New Post' : 'Edit Post'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter post title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="Write your post content here... 

Use **bold text**, [links](https://example.com), inline math like $x^2$, and block math:

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

Don't forget emojis! 🎉"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={isCreating ? createPost : () => updatePost(editingId!)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isCreating ? 'Create' : 'Update'}</span>
              </button>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500">
                    Created: {post.createdAt.toLocaleDateString()} 
                    {post.updatedAt > post.createdAt && (
                      <span> • Updated: {post.updatedAt.toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => togglePreview(post.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title={previewMode[post.id] ? 'Show raw content' : 'Show preview'}
                  >
                    {previewMode[post.id] ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => startEditing(post)}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    title="Edit post"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                {previewMode[post.id] ? (
                  <div className="text-gray-800">
                    {renderContent(post.content)}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {post.content}
                  </pre>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <PenTool className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">Create your first blog post to get started!</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;