import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Calendar, User, Tag } from 'lucide-react';
import { getBlogPostBySlug } from '@/services/blog';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('Blog');
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.featuredImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            {post.category && (
              <div className="inline-block bg-accent-gold px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                {post.category}
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-6xl font-light mb-6 max-w-4xl mx-auto">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.date}</span>
              </div>
              {post.author && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-text-secondary">
            {post.content.split('\n').map((paragraph: string, idx: number) => {
              if (paragraph.trim().startsWith('###')) {
                return <h3 key={idx} className="font-serif text-2xl text-primary mt-8 mb-4">{paragraph.replace('###', '').trim()}</h3>;
              }
              if (paragraph.trim()) {
                return <p key={idx} className="mb-4">{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {post.tags.length > 0 && (
            <div className="border-t border-border mt-12 pt-8 flex items-center gap-4">
              <span className="font-medium text-primary">Tags:</span>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-background-alt px-3 py-1 rounded-full text-sm text-text-secondary flex items-center gap-1">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
