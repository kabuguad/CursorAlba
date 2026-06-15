import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { unwrap } from '../services/mockApi'
import { contentService } from '../services/contentService'

export function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const [progress, setProgress] = useState(0)

  const { data: post, isLoading } = useQuery({
    queryKey: ['public-blog-post', id],
    queryFn: () => contentService.getBlogPost(id!).then(r => unwrap(r)),
    enabled: !!id,
  })

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.min(100, scrolled * 100))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="px-4 py-24 text-center text-muted">Loading article…</div>
    )
  }

  if (!post) {
    return (
      <div className="px-4 py-24 text-center">
        <p>Article not found.</p>
        <Link to="/blog" className="text-primary dark:text-gold">Back to Blog</Link>
      </div>
    )
  }

  const dateStr = post.publishedAt ?? post.createdAt
  const dateLabel = dateStr ? new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <>
      <div
        className="fixed top-20 left-0 z-40 h-1 bg-gold transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary dark:hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        {post.coverImageUrl && (
          <img src={post.coverImageUrl} alt={post.title} className="mb-8 w-full rounded-3xl object-cover aspect-video" />
        )}
        <span className="text-sm font-semibold text-gold">{post.category ?? ''} {dateLabel ? `· ${dateLabel}` : ''}</span>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">{post.title}</h1>
        <p className="mt-2 text-sm text-muted">By {post.author}</p>
        <div className="prose-themed mt-8 max-w-none">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed">{para}</p>
          ))}
        </div>
      </article>
    </>
  )
}
