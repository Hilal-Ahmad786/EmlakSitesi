import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Calendar, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/services/blog';

export default async function BlogPage() {
  const t = await getTranslations('Blog');
  const { data: posts } = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary-dark text-white py-20 mb-12 mt-[120px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {posts.length === 0 ? (
          <p className="text-center text-text-secondary py-12">No blog posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${post.featuredImage})` }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary uppercase tracking-wider">
                      {post.category}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-3">
                    <Calendar size={14} />
                    <span>{t('published', { date: post.date })}</span>
                  </div>

                  <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent-gold transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    {t('readMore')}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
