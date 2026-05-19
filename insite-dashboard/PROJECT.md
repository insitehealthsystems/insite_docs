# InSite Health Systems — Project Documentation

## What is InSite Health Systems?

InSite Health Systems is a San Diego-based healthcare technology company specialising in asset tracking, mobile device security, capital planning, and site monitoring for medical facilities. This repository contains the full marketing and content website, including a multi-language CMS for blog posts.

- **Phone:** (858) 366-3838
- **Address:** 2287 Dunlop St. San Diego, CA 92111
- **Email:** info@insitehealthsystems.com

---

## Tech Stack

### Frontend (`anxiet-react`)
| Layer | Technology |
|---|---|
| Framework | Vite + React 19 |
| Styling | Tailwind CSS v3 (custom colours: `insite-blue` #083791, `insite-cyan` #18c8ff, `insite-orange` #FF8E32, `insite-light-blue` #4fc1f0) |
| Routing | React Router v6 |
| Rich Text Editor | Tiptap v2 (StarterKit, Placeholder, CharacterCount) |
| Internationalisation | react-i18next |
| Icons | lucide-react |
| HTTP | native `fetch` via `authFetch` wrapper in `AuthContext` |

### Backend (`insite-web-backend`)
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express |
| Database | MongoDB (Azure Cosmos DB) via Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer (Office365 SMTP) — branded HTML templates for all transactional emails |
| Image Upload | Cloudinary via multer + multer-storage-cloudinary |
| Security | helmet, express-rate-limit, CORS |

---

## Feature List

### Public Site
- Home page with hero, services overview, stats, testimonials
- About page
- Services pages: Asset Tracking, Mobile Security, Capital Planning, Site Monitoring
- Team page
- Blog listing (`/blog`) — server-side pagination + search
- Blog single post (`/blog/:slug`) — view counts, public comment form (pending moderation)
- Blog by category (`/blog/category/:name`)
- Blog by tag (`/blog/tag/:tag`)
- Contact page — form submits to API, sends branded confirmation to user + admin notification (Reply-To set to sender)
- Newsletter signup — sends branded welcome email to subscriber + admin new-subscriber alert
- Appointment booking form — sends branded confirmation to user + full-detail admin notification (Reply-To set to booker)

### CMS (Admin area — `/blog/manage`)
- Login at `/admin/dashboard/login` (hidden from public nav)
- Dashboard with post stats (total / published / drafts / archived)
- Post list with status filter, full-text search, pagination
- Bulk actions: publish, move to draft, delete (role-gated — see matrix below)
- Create / edit posts: Tiptap rich text, multi-language tabs, permalink editor, tags, categories, SEO panel
- Featured image upload to Cloudinary (drag-and-drop or URL)
- Author assignment from real user list
- Change own password
- User Management page (`/blog/manage/users`) — admin only

---

## Role Permission Matrix

| Action | Writer (author) | Editor | Admin |
|---|---|---|---|
| Create new post | ✅ | ✅ | ✅ |
| Edit own post | ✅ | ✅ | ✅ |
| Edit any post | ❌ | ✅ | ✅ |
| Delete own draft | ❌ | ✅ | ✅ |
| Delete any post | ❌ | ❌ | ✅ |
| Publish / unpublish (single or bulk) | ❌ | ✅ | ✅ |
| Manage comments | ❌ | ✅ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Change own password | ✅ | ✅ | ✅ |
| View user list | ❌ | ✅ | ✅ |

> DB roles are `admin | editor | author`. "Writer" is the UI label for `author`.

---

## API Endpoint Reference

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | public | Login, returns JWT + user |
| GET | `/me` | any | Get current user |
| POST | `/logout` | any | Acknowledge logout (stateless) |
| POST | `/change-password` | any | Change own password |
| GET | `/users` | editor+ | List all users |
| POST | `/users` | admin | Create a new user |

### Blog — `/api/blog`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts` | public | List posts (query: `status`, `category`, `tag`, `lang`, `page`, `limit`) |
| GET | `/posts/:slug` | public | Get single post by slug, increment view count |
| GET | `/posts/id/:id` | any | Get post by ID (for editor) |
| POST | `/posts` | author+ | Create post |
| PUT | `/posts/:id` | author+ | Update post (ownership + role checks) |
| DELETE | `/posts/:id` | editor+ | Delete post |
| POST | `/posts/:slug/comments` | public | Submit comment (pending moderation) |
| GET | `/posts/:slug/comments` | public | Get approved comments |

### Upload — `/api/upload`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/image` | author+ | Upload image to Cloudinary, returns `{ url, publicId }` |

### Other — public, rate-limited
| Method | Path | Description |
|---|---|---|
| POST | `/api/appointments` | Book appointment |
| POST | `/api/contact` | Contact form |
| POST | `/api/newsletter/subscribe` | Newsletter signup |

---

## Local Development Setup

### Prerequisites
- Node.js >= 18
- A MongoDB connection string (Azure Cosmos DB or Atlas)
- Cloudinary account (free tier)

### Backend
```bash
cd insite-web-backend
cp .env.example .env   # fill in values (see below)
npm install
npm run dev            # starts on port 4000

# Seed admin user (run once)
node src/seed.js
# Default admin: admin@insitehealth.com / ChangeMe123!
```

### Frontend
```bash
cd anxiet-react
cp .env.example .env   # set VITE_API_BASE_URL
npm install
npm run dev            # starts on port 5173
```

---

## Environment Variables

### Backend `.env`
```
PORT=4000
MONGODB_URI=<Azure Cosmos DB / MongoDB Atlas connection string>
JWT_SECRET=<long random hex string>
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=info@insitehealthsystems.com
EMAIL_PASS=<SMTP password>
EMAIL_FROM=InSite Health System <info@insitehealthsystems.com>
ADMIN_EMAIL=<notification recipient>
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:4000
```

---

## Deployment Notes

- Set `CORS_ORIGIN` on the backend to the production frontend URL (e.g. `https://insitehealthsystems.com`).
- Set `VITE_API_BASE_URL` on the frontend to the production API URL during build.
- The backend has a 5 MB file upload limit per image (enforced in `routes/upload.js`).
- Images are stored in the `insite-blog` folder on Cloudinary and automatically resized to max 1200 px wide.
- Rate limiting applies to public endpoints: 50 requests per 15 minutes per IP.
- JWT tokens expire after 24 hours. There is no refresh token mechanism — users must log in again after expiry.
- MongoDB connection requires `tls: true` for Azure Cosmos DB (configured in `src/config/db.js`).
- All transactional emails use a shared branded HTML layout (`src/utils/email.js`) — header gradient, info tables, CTA buttons, and footer with address/phone. Admin notification emails have `Reply-To` set to the sender so staff can reply directly from their inbox.
- Add new admin notification recipients by editing `src/config/adminEmails.js` — no other code changes needed.
