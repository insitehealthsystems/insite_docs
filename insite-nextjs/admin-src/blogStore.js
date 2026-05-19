// Blog post store backed by localStorage
// In production, replace with API calls

const KEY = 'ihs_blog_posts'
const CATS_KEY = 'ihs_blog_categories'

const DEFAULT_CATEGORIES = [
  'Asset Tracking', 'Healthcare IT', 'HIPAA & Compliance',
  'Capital Planning', 'Case Studies', 'Company News',
]

function seed() {
  return [
    {
      id: '1',
      title: 'How Real-Time Asset Tracking Reduces Equipment Search Time by 70%',
      slug: 'asset-tracking-reduces-search-time',
      excerpt: 'Hospitals spend thousands of staff-hours each year searching for misplaced equipment. Learn how sub-room BLE tracking changes that.',
      content: `<h2>The Hidden Cost of Lost Equipment</h2><p>Nurses spend an average of 20 minutes per shift searching for missing equipment — that's over 120 hours per year per nurse. Multiply that across an entire hospital and the numbers become staggering.</p><h2>How InSite Changes That</h2><p>Our BLE-powered system updates asset locations every 30 seconds with sub-room accuracy. Staff see a live map on any device — no dedicated hardware required.</p><h2>Real Results</h2><p>Pilot hospitals have reported a 70% reduction in equipment search time within the first 90 days of deployment.</p>`,
      category: 'Asset Tracking',
      tags: ['BLE', 'ROI', 'Efficiency'],
      status: 'published',
      featuredImage: '',
      author: 'InSite Team',
      seoTitle: '',
      seoDescription: '',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: '2',
      title: 'HIPAA-Compliant Mobile Device Management: What Every Hospital Needs to Know',
      slug: 'hipaa-compliant-mdm',
      excerpt: 'With mobile devices everywhere in modern hospitals, MDM compliance is non-negotiable. Here\'s a practical guide.',
      content: `<h2>Why MDM Is Non-Negotiable</h2><p>Every unprotected mobile device in your facility is a potential HIPAA violation waiting to happen. With InSite's built-in MDM layer, devices are encrypted, remotely wipeable, and audit-logged by default.</p>`,
      category: 'HIPAA & Compliance',
      tags: ['HIPAA', 'MDM', 'Security'],
      status: 'published',
      featuredImage: '',
      author: 'InSite Team',
      seoTitle: '',
      seoDescription: '',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: '3',
      title: 'Capital Planning in 2026: Stop Buying Equipment You Already Own',
      slug: 'capital-planning-2026',
      excerpt: 'Many hospitals purchase 15–30% more equipment than needed because utilization data doesn\'t exist. Real-time tracking changes capital planning forever.',
      content: `<h2>The Utilization Gap</h2><p>Without real-time data, biomedical engineers estimate equipment utilization. Those estimates are almost always wrong — and the cost of being wrong is millions in unnecessary capital spend.</p>`,
      category: 'Capital Planning',
      tags: ['Capital', 'Utilization', 'Finance'],
      status: 'draft',
      featuredImage: '',
      author: 'InSite Team',
      seoTitle: '',
      seoDescription: '',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ]
}

export function getPosts() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const initial = seed()
  localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

export function getPost(id) {
  return getPosts().find(p => p.id === id) || null
}

export function savePost(post) {
  const posts = getPosts()
  const now = new Date().toISOString()
  const idx = posts.findIndex(p => p.id === post.id)
  if (idx >= 0) {
    posts[idx] = { ...post, updatedAt: now }
  } else {
    posts.unshift({ ...post, id: Date.now().toString(), createdAt: now, updatedAt: now })
  }
  localStorage.setItem(KEY, JSON.stringify(posts))
  return posts
}

export function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(posts))
  return posts
}

export function getCategories() {
  try {
    const raw = localStorage.getItem(CATS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  localStorage.setItem(CATS_KEY, JSON.stringify(DEFAULT_CATEGORIES))
  return DEFAULT_CATEGORIES
}

export function saveCategories(cats) {
  localStorage.setItem(CATS_KEY, JSON.stringify(cats))
}

export function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
