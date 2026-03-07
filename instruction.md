# Internship Portal — Frontend Integration Specification

## Context for the LLM

You are modifying an **existing React frontend** to connect it to a **fully built Express.js backend**. The frontend currently has complete UI/UX (Tailwind CSS, nice animations, components) but uses **only hardcoded mock data** — no real API calls exist yet. Your job is to wire each page to its corresponding backend APIs without breaking the existing UI design and structure.

**Do not redesign the UI. Preserve all existing JSX structure, class names, and component hierarchy. Only add state management, API calls, and replace hardcoded mock data with real data.**

---

## Project Structure

```
/
├── server/           ← Express.js backend (already running on :5001)
└── client/           ← React + Vite frontend (your target)
    └── src/
        ├── App.jsx         ← Router setup — DO NOT change route paths
        ├── main.jsx
        ├── App.css
        └── Pages/
            ├── Login.jsx
            ├── Student/
            │   ├── StudentProfile.jsx   → /profile-student
            │   ├── MyInternship.jsx     → /internship-student
            │   ├── Bonafide.jsx         → /bonafide-student
            │   └── StudentNavbar.jsx    (do not modify)
            ├── Faculty/
            │   ├── FacultyHome.jsx      → /home-faculty
            │   ├── StudentTracker.jsx   → /tracker-faculty
            │   ├── FacultyProfile.jsx   → /profile-faculty
            │   ├── FacultyInsights.jsx  (lower priority)
            │   ├── AcademicHub.jsx      (skip — no backend)
            │   ├── Research.jsx         (skip — no backend)
            │   └── FacultyNavbar.jsx    (do not modify)
            └── Admin/
                └── (skip — no backend implemented for admin)
```

---

## Tech Stack

- React 19, Vite
- React Router DOM v7
- Tailwind CSS v4 (already configured)
- Lucide React (icons)
- **No axios** — use native `fetch` API

---

## Step 1: Create Shared Utilities First

Create these two new files before touching any pages. All pages will import from them.

### `client/src/lib/api.js`

```javascript
const BASE_URL = 'http://localhost:5001';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}
```

### `client/src/lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';
// Run first: npm install @supabase/supabase-js  (inside client/ directory)
const SUPABASE_URL = 'https://zhjthfqhwdxxvwzulkgj.supabase.co';
const SUPABASE_ANON_KEY = 'ASK_PROJECT_OWNER_FOR_ANON_KEY'; 
// ⚠️ Use the ANON key (not the service role key).
// Find it in: Supabase Dashboard → Project Settings → API → "anon public" key
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## Step 2: Authentication & Session

### Rules
- After login: Save `access_token` and `user` object in `localStorage`.
- On logout: Clear both keys, redirect to `/login`.
- `user` object shape: `{ id, email, role }` where role is `"STUDENT"` or `"INCHARGE"`.
- Every protected API call must include `Authorization: Bearer <access_token>` header — the `apiFetch` helper above handles this automatically.

### Add Auth Guard to `App.jsx`

Add a `ProtectedRoute` component and wrap all non-login routes. Here is the pattern to add to `App.jsx`:

```jsx
// Add this component inside App.jsx BEFORE AppContent:
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Then wrap every route EXCEPT /login like this:
<Route path='/internship-student' element={<ProtectedRoute><MyInternship /></ProtectedRoute>} />
// ... repeat for all other protected routes
```

---

## Step 3: Page-by-Page Integration

### 3.1 `Login.jsx` (currently: hardcoded role redirect, no real API)

**Current state**: Has beautiful UI with role selector (student/faculty/admin) and login form, but `handleLogin` just navigates without calling the API.

**Integration requirements**:
1. Add `email` and `password` state for the two inputs — connect them with `value` and `onChange`.
2. Replace `handleLogin` to call `POST /api/auth/login`:
   ```javascript
   const handleLogin = async (e) => {
     e.preventDefault();
     setError('');
     setLoading(true);
     try {
       const res = await fetch('http://localhost:5001/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password })
       });
       const data = await res.json();
       if (!data.success) throw new Error(data.error);
       localStorage.setItem('access_token', data.data.session.access_token);
       localStorage.setItem('user', JSON.stringify(data.data.user));
       // Redirect based on role
       if (data.data.user.role === 'STUDENT') navigate('/internship-student');
       else if (data.data.user.role === 'INCHARGE') navigate('/home-faculty');
       else navigate('/home-admin');
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };
   ```
3. Add an error message `<p>` element below the form to show `error` state (red text).
4. Disable the submit button and show a loading indicator when `loading` is true.
5. The role selector (student/faculty/admin tiles) can remain as visual UI only — the actual role comes from the API response, not the selector.

**API**: `POST /api/auth/login` → `{ email, password }` → `{ success, data: { session: { access_token }, user: { id, email, role } } }`

---

### 3.2 `StudentProfile.jsx` (currently: hardcoded student object, display-only)

**Current state**: Shows a profile card with hardcoded `student` object. Has a password change modal (keep as-is). Profile details are display-only with no edit form.

**Integration requirements**:
1. On mount: call `GET /api/students/profile` to load real data. If 404, profile does not exist yet — proceed with empty state.
2. Replace the hardcoded `student` object with state loaded from API.
3. Make the profile fields editable — show an edit form (can be a modal similar to the existing password modal, or replace InfoItem with inputs on an "Edit" button click).
4. On save: call `POST /api/students/profile` with all fields.
5. Map API fields: `full_name → name`, `dept → class`, `year → year`, `reg_no → rollNo`, and get `email` from `localStorage.getItem('user')`.

**Edit Form Fields** (open in a modal or inline):
| API field | Label shown | Input type |
|---|---|---|
| reg_no | Student ID / Reg No | text |
| full_name | Full Name | text |
| dept | Department | text |
| year | Academic Year | number (1–5) |
| gender | Gender | select: Male/Female/Other |
| phone | Phone | text |
| linkedin_url | LinkedIn Profile URL | url |

**APIs**:
- `GET /api/students/profile` → `{ success, data: { user_id, reg_no, full_name, dept, year, gender, phone, linkedin_url } }`
- `POST /api/students/profile` (body: same fields) → `{ success, data: {...} }`

---

### 3.3 `MyInternship.jsx` (currently: manages local `internships` array state, no backend)

**Current state**: Has a list view, a form view, and an internship detail slide-over. Form currently uses `company`, `role`, `duration` fields only. `UploadZone` is decorative.

**Integration requirements**:
1. On mount: call `GET /api/internships/my` and populate the `internships` state.
2. Update form fields to match the backend schema. Replace `company/role/duration` form with:
   - `company_name` (required), `role_title` (required), `expected_start_date` (date, required), `expected_end_date` (date, required), `mode` (select: ONSITE/REMOTE/HYBRID, required), `location` (text), `stipend` (text), `company_linkedin` (url), `offer_letter_url` (handled via file upload — see below).
3. On "Confirm & Add" submit: call `POST /api/internships` with form data. On success, append the returned object to `internships` state.
4. In the internship detail slide-over (`selectedIntern`), display real fields: `company_name`, `role_title`, `expected_start_date`, `expected_end_date`, `mode`, `location`, `stipend`.
5. Add a **"Request Document"** button in the slide-over that navigates to `/bonafide-student`.

**Offer Letter file upload** (replace the decorative `UploadZone` for "Signed Offer Letter"):
```javascript
// In the form, add this for the offer letter:
const handleOfferLetterUpload = async (file) => {
  const userId = JSON.parse(localStorage.getItem('user')).id;
  const path = `offer-letters/${userId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return data.publicUrl; // Store this in formData.offer_letter_url
};
```

**APIs**:
- `GET /api/internships/my` → `{ success, data: [{ id, company_name, role_title, expected_start_date, expected_end_date, mode, location, stipend, offer_letter_url, created_at }] }`
- `POST /api/internships` → body: `{ company_name, role_title, expected_start_date, expected_end_date, mode, location, stipend, company_linkedin, offer_letter_url }`

---

### 3.4 `Bonafide.jsx` (currently: hardcoded mock requests array, custom form fields)

**Current state**: Has a request list showing 2 hardcoded items, and a New Request modal with title/fromDate/toDate/description fields. These fields do NOT match the backend. Has a nice `StatusStep` stepper component.

**Integration requirements**:

#### On Mount
1. Call `GET /api/requests/my` → populate `requests` state (replaces the hardcoded array).
2. Call `GET /api/internships/my` → populate `myInternships` state (for the internship selector).
3. Call `GET /api/requests/types/all` → populate `requestTypes` state (for the type selector).

#### Request List
Replace hardcoded fields with real API fields:
- `req.title` → `req.request_types.name` (e.g., "Bonafide Certificate")
- `req.from / req.to` → not in this endpoint; show `req.internships.company_name` and `req.internships.role_title` instead
- `req.status` → `req.status` (PENDING / ON_HOLD / APPROVED / REJECTED)
- Status badge mapping: `PENDING` = amber/yellow, `ON_HOLD` = orange, `APPROVED` = emerald, `REJECTED` = red
- `StatusStep` stepper: map to `Submitted → Review → Finalized`. Show "Review" as active when PENDING/ON_HOLD, "Finalized" as completed when APPROVED/REJECTED.
- If `req.status === 'ON_HOLD'`: show `req.incharge_comment` prominently under the card as a yellow alert box, and show a **"Resubmit"** button.

#### New Request Modal Form
Replace existing form fields entirely with:
1. **Select Internship** — dropdown from `myInternships`: show `company_name — role_title`. Stores `internship_id`.
2. **Select Request Type** — dropdown from `requestTypes`: show `name`. Stores `request_type_id`.
3. **Dynamic fields** — when a request type is selected, render its `form_schema_json.fields` dynamically:
   ```jsx
   {selectedType?.form_schema_json?.fields?.map(field => (
     <div key={field.name}>
       <label>{field.label}{field.required && ' *'}</label>
       <input
         type={field.type}
         required={field.required}
         value={payloadJson[field.name] || ''}
         onChange={e => setPayloadJson(prev => ({...prev, [field.name]: e.target.value}))}
       />
     </div>
   ))}
   ```
4. **Student Note** — optional textarea.
5. On submit: call `POST /api/requests` with `{ internship_id, request_type_id, payload_json: payloadJson, student_note }`. On success, prepend to `requests` state.

#### Resubmit Flow
When user clicks "Resubmit" on an ON_HOLD request:
1. Open a modal pre-filled with the data from `GET /api/requests/:id` (fetch on click to get latest `payload_json`).
2. Show the `incharge_comment` at the top of the modal so the student knows what to fix.
3. On submit: call `PUT /api/requests/:id/resubmit` with `{ payload_json, student_note }`.
4. On success: update that request in state with the returned data (status back to PENDING).

**APIs**:
- `GET /api/requests/my` → `{ success, data: [{ id, status, student_note, incharge_comment, created_at, request_types: { id, name, code }, internships: { id, company_name, role_title } }] }`
- `GET /api/requests/types/all` → `{ success, data: [{ id, code, name, form_schema_json: { fields: [{ name, type, label, required }] } }] }`
- `POST /api/requests` → body: `{ internship_id, request_type_id, payload_json, student_note }`
- `GET /api/requests/:id` → full detail with `request_submissions` array (get latest `payload_json`)
- `PUT /api/requests/:id/resubmit` → body: `{ payload_json, student_note }`

---

### 3.5 `FacultyHome.jsx` (currently: static hardcoded stat cards and activity list)

**Current state**: Shows 3 stat cards (Pending Approvals=12, Expiring Internships=05, Active Students=142) and a hardcoded "Recent Activity" feed. All data is static.

**Integration requirements**:
1. On mount: call `GET /api/incharge/dashboard?status=ALL`.
2. Replace the 3 stat card numbers:
   - "Pending Approvals" → `metrics.pending`
   - "Expiring Internships" → count of requests with `expected_end_date` within 7 days (or just use `metrics.on_hold` as a proxy if the internship date calculation is complex)
   - "Active Students" → `metrics.total` (or `data.length`)
3. Replace the "Recent Activity" feed with real recent requests from `data` (show last 4). Each item: student name, request type, company, created_at.
4. Each activity item's "Review" button should navigate to `/tracker-faculty` passing the request `id` (use React Router's `useNavigate` with state: `navigate('/tracker-faculty', { state: { requestId: req.id } })`).
5. Add a status filter — replace the "Quick Actions" sidebar with tab buttons (ALL / PENDING / ON_HOLD / APPROVED) that re-fetch from `GET /api/incharge/dashboard?status=<STATUS>`.

**Check if incharge profile exists on mount** — call `GET /api/auth/me`. If the incharge has never set up their profile, show a dismissible banner: "Complete your profile to start reviewing requests" with a link to `/profile-faculty`.

**API**: `GET /api/incharge/dashboard?status=PENDING` → `{ success, metrics: { total, pending, approved, on_hold }, data: [{ id, status, created_at, request_types: { name, code }, internships: { company_name, role_title }, student_profiles: { full_name, reg_no, dept, year } }] }`

---

### 3.6 `StudentTracker.jsx` (currently: hardcoded table of students, slide-over with mock data)

**Current state**: Shows a table with hardcoded student rows (Amit Kumar × 5). Has a slide-over "Internship Dossier" panel that shows mock skills, ratings, and documents. Has "Approve Portfolio" and ping buttons.

**Integration requirements**:
1. On mount: call `GET /api/incharge/dashboard?status=ALL` to get all requests for the table.
2. Replace table rows with real data. Map:
   - Student & ID → `student_profiles.full_name` + `student_profiles.reg_no`
   - Company & Role → `internships.company_name` + `internships.role_title`
   - "Primary Skills" column → replace with **Status** badge (PENDING/ON_HOLD/APPROVED/REJECTED) using colored `<span>` tags
3. The "Eye" button: fetch `GET /api/requests/:id` and set as `selectedStudent` (rename conceptually to `selectedRequest`). The slide-over shows the full request detail.
4. In the slide-over, replace mock content with real data:
   - Header: student `full_name`, `reg_no`, `dept`, year
   - Body: request type name, internship company + role, latest `payload_json` shown as key-value pairs
   - Replace "Core Tech Stack" section with "Request Details" (payload fields)
   - Replace "Weekly Reports / Manager Rating" cards with "Status History" (from `request_status_history`)
   - Replace "Timeline & Docs" with "Submission History" (from `request_submissions`)
5. Replace "Approve Portfolio" button with three action buttons: **Approve** (green), **On Hold** (orange), **Reject** (red).
6. Clicking any action button: show a small inline textarea for `incharge_comment`, then on confirm call `PUT /api/incharge/requests/:id/status` with `{ status: 'APPROVED'|'ON_HOLD'|'REJECTED', incharge_comment }`.
7. On success: close slide-over, show a success message, refresh the table.
8. Remove the ping/Send button or keep it decorative.

**APIs**:
- `GET /api/incharge/dashboard?status=ALL` (for table)
- `GET /api/requests/:id` (for slide-over detail)
- `PUT /api/incharge/requests/:id/status` (body: `{ status, incharge_comment }`)

---

### 3.7 `FacultyProfile.jsx` (currently: hardcoded Dr. Alan Turing data, display-only)

**Current state**: Shows a profile card with hardcoded name/role/email. Has "Expertise Tags" and "Mentorship Archive" sections (not backed by API).

**Integration requirements**:
1. On mount: call `GET /api/auth/me` to get `email` and `role`.
2. Also try to load incharge profile data — make a request to see if profile exists (you can infer from whether the incharge has taken any action, or simply try to get their profile from the dashboard). Since there's no `GET /api/incharge/profile` endpoint, show what's available from `auth/me` and allow editing.
3. Add an "Edit Profile" button that opens a modal (similar to existing "Expertise Tags" card area) with fields:
   - `full_name` (text, required)
   - `designation` (text)
   - `phone` (text)
4. On save: call `POST /api/incharge/profile` with `{ full_name, designation, phone }`.
5. Replace hardcoded "Dr. Alan Turing" with state-loaded data. Show email from `auth/me`.
6. "Expertise Tags" and "Mentorship Archive" sections can remain as static/decorative UI — no backend for them.

**APIs**:
- `GET /api/auth/me` → `{ success, data: { id, email, role, is_active } }`
- `POST /api/incharge/profile` → body: `{ full_name, designation, phone }` → `{ success, data: { user_id, full_name, designation, phone } }`

---

## Complete Backend API Reference

Base URL: `http://localhost:5001`
All responses: `{ success: boolean, data: any }` or `{ success: false, error: string }`
Protected routes need: `Authorization: Bearer <access_token>` header

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | - | Register user |
| POST | `/api/auth/login` | No | - | Login, get token |
| GET | `/api/auth/me` | Yes | Any | Get current user |
| GET | `/api/students/profile` | Yes | STUDENT | Get own profile |
| POST | `/api/students/profile` | Yes | STUDENT | Upsert profile |
| POST | `/api/internships` | Yes | STUDENT | Add internship |
| GET | `/api/internships/my` | Yes | STUDENT | List own internships |
| GET | `/api/internships/:id` | Yes | STUDENT+INCHARGE | Get one internship |
| GET | `/api/requests/types/all` | Yes | Any | Get document types |
| GET | `/api/requests/my` | Yes | STUDENT | **List own requests** |
| POST | `/api/requests` | Yes | STUDENT | Submit new request |
| GET | `/api/requests/:id` | Yes | STUDENT+INCHARGE | Get request + history |
| PUT | `/api/requests/:id/resubmit` | Yes | STUDENT | Resubmit ON_HOLD request |
| POST | `/api/incharge/profile` | Yes | INCHARGE | Upsert incharge profile |
| GET | `/api/incharge/dashboard` | Yes | INCHARGE | Dashboard + metrics |
| PUT | `/api/incharge/requests/:id/status` | Yes | INCHARGE | Approve/Reject/Hold |

---

## Request Status State Machine

```
PENDING  →  ON_HOLD    (incharge puts on hold)
PENDING  →  APPROVED   (incharge approves)
PENDING  →  REJECTED   (incharge rejects)
ON_HOLD  →  PENDING    (student resubmits — automatic)
PENDING  →  APPROVED   (incharge approves resubmission)
```

- Only allow Incharge action buttons that make sense for current status (e.g., don't show "On Hold" for an already ON_HOLD request).
- `PUT /api/incharge/requests/:id/status` returns 400 if same status is set again.

---

## Error Handling Rules

| HTTP Status | Frontend Action |
|---|---|
| 200 / 201 | Show data / success |
| 400 | Show `error` from response inline |
| 401 | Clear localStorage → redirect to `/login` |
| 403 | Show "Access denied" |
| 404 | Show empty state (e.g., "No profile yet") |
| 409 | Show "Email already in use" |
| 500 | Show "Something went wrong, please try again" |

Add a global fetch error interceptor pattern — in every `try/catch`, if error message includes "401" or `res.status === 401`, call logout logic.

---

## Key Implementation Notes

1. **Route `/my` vs `/:id`** — `GET /api/requests/my` must be registered BEFORE `GET /api/requests/:id` in the backend router (already done). Just ensure you call the right endpoint.
2. **Dynamic forms** — The `form_schema_json.fields` array from `GET /api/requests/types/all` is the single source of truth for what inputs to render. Field `type` values are `"text"` or `"number"` — map directly to HTML `<input type={field.type}>`.
3. **Supabase Storage** — Before file uploads work, the project owner must create a public bucket named `documents` in the Supabase Dashboard → Storage.
4. **First-time Incharge** — An incharge must call `POST /api/incharge/profile` at least once before they can approve/reject requests (FK constraint). Show a banner/prompt on `/home-faculty` if profile is not yet completed.
5. **Token expiry** — Supabase JWTs expire after 1 hour. If a 401 is received mid-session, clear local storage and redirect to login. For production, implement token refresh using `supabase.auth.refreshSession()`.
