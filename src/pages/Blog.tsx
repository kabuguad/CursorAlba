import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { blogPosts } from '../data/blog'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'

export function Blog() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return blogPosts.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="text-5xl font-bold md:text-7xl">Blog</h1>
        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="field border-2 py-3 pl-12 pr-4 focus:border-gold"
          />
        </div>
      </ScrollReveal>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {filtered.map((post, i) => (
          <ScrollReveal key={post.id} delay={i * 0.05}>
            <Link to={`/blog/${post.id}`}>
              <GlassCard className="mb-6 break-inside-avoid overflow-hidden p-0">
                <img src={post.image} alt={post.title} className="w-full object-cover" />
                <div className="p-5">
                  <span className="text-xs font-semibold text-gold">{post.category}</span>
                  <h2 className="mt-1 text-lg font-bold">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                </div>
              </GlassCard>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
