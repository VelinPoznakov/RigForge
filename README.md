# RigForge

A community catalog of real PC builds. Share the rig you built with a photo, its parts and its price, browse what other people run for gaming, coding, rendering or a quiet living-room box, and like or comment on the builds you would copy.

| | |
|---|---|
| **Live app** | **https://rigforge-62iq.onrender.com** |
| **API documentation (Swagger)** | https://rigforge-62iq.onrender.com/swagger |
| **Health check** | https://rigforge-62iq.onrender.com/health |

> **The first visit can take up to a minute.** The app runs on free hosting: the server sleeps after 15 minutes without visitors and the database pauses after about an hour. The first request wakes both up; after that the app is fast. If the first page shows a timeout, refresh once.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project structure](#project-structure)
5. [Deployment (live version)](#deployment-live-version)
6. [Running the project locally](#running-the-project-locally)
7. [Configuration reference](#configuration-reference)
8. [API overview](#api-overview)
9. [Design](#design)
10. [Known limitations](#known-limitations)
11. [Functional Guide](#functional-guide)

---

## Features

- **Build catalog** with search (CPU, GPU or title), purpose filter (Gaming, Development, Workstation, Budget, HTPC), sorting (newest, oldest, most liked, price) and pagination
- **Build details** with photo, full specs, price, description, likes and comments
- **Accounts**: register, log in, log out; the session survives a page refresh
- **Builds CRUD**: logged-in users post builds with a photo, and only the author can edit or delete them
- **Interaction**: like / unlike builds, write, edit and delete your own comments
- **User pages**: every user's builds, plus "My builds" with account info for the logged-in user
- **Roles**: `User` for everyone who registers, `Admin` (seeded) can delete any build or comment
- **Route guards**: guests can browse but not create; logged-in users cannot open Login / Register
- **Loading, error and empty states** on every page that talks to the API
- **Responsive** dark UI that works on phones, tablets and desktops

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 8, Vite 8, Tailwind CSS 4, native `fetch` |
| Backend | ASP.NET Core 10 Web API (C#), Entity Framework Core 10, ASP.NET Core Identity |
| Authentication | JWT bearer tokens, roles (`User`, `Admin`), account lockout after 5 failed logins |
| Database | Microsoft SQL Server – Azure SQL Database (serverless) in production, SQL Server 2022 in Docker locally |
| API docs | OpenAPI + Swagger UI |
| Hosting | Render (Docker web service) for the app, Azure for the database |

## Architecture

```
                      https://rigforge-62iq.onrender.com
 ┌───────────┐      ┌──────────────────────────────────────────────┐      ┌──────────────────┐
 │  Browser  │ ───▶ │  Render – one Docker container               │ ───▶ │  Azure SQL       │
 │  (React)  │ ◀─── │                                              │ ◀─── │  Database        │
 └───────────┘      │  ASP.NET Core API                            │      │  (users, builds, │
                    │   ├─ /api/...     REST endpoints (JSON)      │      │   comments,      │
                    │   ├─ /swagger     API documentation          │      │   likes)         │
                    │   ├─ /<guid>.jpg  uploaded build photos      │      └──────────────────┘
                    │   └─ everything else → React app (index.html)│
                    └──────────────────────────────────────────────┘
```

- **One URL for frontend and backend.** The root `Dockerfile` builds the React app (`npm run build`) and the API, and puts both into one container. The API serves the React files and answers `/api/...`; any other URL returns the React app, so React Router handles it. Because both share the same address, the frontend calls `/api/...` directly and no CORS setup is needed in production.
- **Stateless authentication.** On login or register the API returns a JWT. The frontend keeps it in `localStorage`, sends it as `Authorization: Bearer <token>` and restores the user after a refresh with `GET /api/auth/me`.
- **Layered backend.** Controllers handle HTTP and permissions (owner / admin checks), services hold the business logic, and EF Core maps the entities to SQL Server. Validation rules live in one place (`GCommon/Models/*Validation.cs`) and are used by both the DTOs and the entity configuration.
- **Thin pages on the frontend.** Pages read the URL and call API functions; reusable UI lives in components; the logged-in user is shared through `AuthContext`.

## Project structure

```
RigForge/
├── Dockerfile                    builds frontend + backend into one image (used by Render)
├── .dockerignore
├── backend/RigForgeSolution/RigForge/
│   ├── Controllers/              Auth, Builds, Comments, Likes, Users
│   ├── Services/                 business logic, token generation, image storage, role/admin seeding
│   ├── Data/                     AppDbContext + entity configurations
│   ├── Models/                   entities: User, Build, Comment, BuildLike, Purpose
│   ├── Dtos/                     request / response shapes
│   ├── GCommon/                  validation constants, options, error messages, helpers
│   ├── Migrations/               EF Core migrations
│   └── Program.cs                service setup and middleware pipeline
└── frontend/
    ├── index.html
    ├── vite.config.js            React + Tailwind CSS Vite plugins
    └── src/
        ├── main.jsx              app entry, BrowserRouter
        ├── App.jsx               route table
        ├── index.css             Tailwind import + design tokens (colours, fonts)
        ├── api/                  fetch helpers per resource (builds, comments, likes, users, auth)
        ├── contexts/             AuthContext – current user, token, login / logout
        ├── components/           pages, layout (Header, Navbar, Footer), guards, build cards, forms
        └── utils/                route paths, formatting, validation helpers
```

## Deployment (live version)

### Frontend + API – Render
- **Service:** Render web service of type *Docker*, connected to this GitHub repository, branch `main`.
- **Build:** Render builds the root `Dockerfile` (root directory: repository root, Dockerfile path `./Dockerfile`). Every push to `main` triggers a new deploy.
- **Runtime:** the container listens on port `10000`; Render terminates HTTPS in front of it.
- **Configuration** is set as environment variables in the Render dashboard (no secrets in the repository):

  | Variable | Purpose |
  |---|---|
  | `ConnectionStrings__Database` | Azure SQL connection string |
  | `Jwt__Issuer`, `Jwt__Audience`, `Jwt__Key`, `Jwt__AccessTokenMinutes` | token settings (`Jwt__Key` is at least 32 characters) |
  | `Admin__Email`, `Admin__Username`, `Admin__Password` | admin account created on startup |
  | `OpenApi__Enabled` | `true` to keep Swagger available in production |
  | `Database__MigrateOnStartup` | `true` to apply EF Core migrations when the container starts |

- **Sleep:** on the free plan the service sleeps after 15 minutes without traffic and needs up to a minute to wake up.

### Database – Azure SQL Database
- **Server / database:** `rigforge.database.windows.net` / `rigforge` (serverless, free offer).
- **Pausing:** it pauses itself after about an hour without queries; the first request after that waits while it resumes (the connection string uses a 60-second timeout for this reason).
- **Firewall:** only allowed IP addresses can connect – Render's outbound addresses and the developer's own IP.
- **Persistence:** all data (users, builds, comments, likes) is stored here and does not reset between visits or deployments.

## Running the project locally

### Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| [Node.js](https://nodejs.org/) | 22 or newer (developed on 24) | frontend |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0 | backend |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any recent | local SQL Server (and option C) |
| `dotnet-ef` tool (optional) | 10.x | applying migrations manually: `dotnet tool install --global dotnet-ef` |

```bash
git clone https://github.com/VelinPoznakov/RigForge.git
cd RigForge
```

### Option A – Frontend only, using the deployed API

The quickest way to work on the UI.

```bash
cd frontend
npm install
```

Create `frontend/.env.development.local`:

```
VITE_API_URL=https://rigforge-62iq.onrender.com
```

```bash
npm run dev
```

Open http://localhost:5173. The deployed API must allow this origin: on Render, `CorsOrigins__0` has to be `http://localhost:5173`. Without it the browser blocks the requests (CORS error in the console) – use option B instead.

### Option B – Full stack on your machine

**1. Start SQL Server in Docker**

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>" -p 1433:1433 --name rigforge-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

**2. Configure the backend** with [user secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) (kept outside the repository):

```bash
cd backend/RigForgeSolution/RigForge
dotnet user-secrets set "ConnectionStrings:Database" "Server=localhost,1433;Database=RigForge;User Id=sa;Password=<YourStrong!Passw0rd>;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:Issuer" "RigForge"
dotnet user-secrets set "Jwt:Audience" "RigForge"
dotnet user-secrets set "Jwt:Key" "<random string of at least 32 characters>"
dotnet user-secrets set "Jwt:AccessTokenMinutes" "60"
dotnet user-secrets set "Admin:Email" "admin@rigforge.local"
dotnet user-secrets set "Admin:Username" "admin"
dotnet user-secrets set "Admin:Password" "<at least 6 characters with a digit>"
dotnet user-secrets set "CorsOrigins:0" "http://localhost:5173"
dotnet user-secrets set "Database:MigrateOnStartup" "true"
```

`Database:MigrateOnStartup` creates the database and tables on the first start. To do it manually instead, set it to `false` and run `dotnet ef database update` from the same folder.

**3. Run the API**

```bash
dotnet run --launch-profile http
```

- API: http://localhost:5108
- Swagger: http://localhost:5108/swagger
- The `User` and `Admin` roles and the admin account are created automatically on startup.

**4. Run the frontend** in a second terminal, from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env.development.local`:

```
VITE_API_URL=http://localhost:5108
```

```bash
npm run dev
```

Open http://localhost:5173.

### Option C – Production-like, one Docker container

Builds exactly what runs on Render: the React app served by the API.

Create a `.env.test` file in the repository root (git-ignored). `host.docker.internal` lets the container reach the SQL Server from option B:

```
ConnectionStrings__Database=Server=host.docker.internal,1433;Database=RigForgeTest;User Id=sa;Password=<YourStrong!Passw0rd>;TrustServerCertificate=True
Database__MigrateOnStartup=true
Jwt__Issuer=RigForge
Jwt__Audience=RigForge
Jwt__Key=<random string of at least 32 characters>
Jwt__AccessTokenMinutes=60
Admin__Email=admin@rigforge.local
Admin__Username=admin
Admin__Password=<at least 6 characters with a digit>
OpenApi__Enabled=true
```

```bash
docker build -t rigforge .
```

```bash
docker run --name rigforge -p 8080:10000 --env-file .env.test -v rigforge-images:/app/wwwroot rigforge
```

Open http://localhost:8080 – the app, `/api/...` and `/swagger` all on one address.

### Frontend scripts

| Command | What it does |
|---|---|
| `npm run dev` | development server with hot reload on http://localhost:5173 |
| `npm run build` | production build into `frontend/dist` |
| `npm run preview` | serves the production build locally |
| `npm run lint` | runs oxlint |

## Configuration reference

### Backend (`appsettings.json` keys – set them as user secrets locally or environment variables in production)

| Key | Environment variable | Description |
|---|---|---|
| `ConnectionStrings:Database` | `ConnectionStrings__Database` | SQL Server connection string |
| `Database:MigrateOnStartup` | `Database__MigrateOnStartup` | apply pending migrations on startup (`true` / `false`) |
| `Jwt:Issuer` / `Jwt:Audience` | `Jwt__Issuer` / `Jwt__Audience` | token issuer and audience |
| `Jwt:Key` | `Jwt__Key` | signing key, at least 32 bytes |
| `Jwt:AccessTokenMinutes` | `Jwt__AccessTokenMinutes` | token lifetime in minutes |
| `Admin:Email` / `Admin:Username` / `Admin:Password` | `Admin__Email` / … | admin account seeded on startup |
| `CorsOrigins` (array) | `CorsOrigins__0`, `CorsOrigins__1`, … | frontend origins allowed to call the API from another address |
| `OpenApi:Enabled` | `OpenApi__Enabled` | expose Swagger outside Development |

### Frontend (`frontend/.env.*` files – only `VITE_` variables reach the browser)

| Variable | Development | Production |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5108` | empty – the app calls `/api/...` on its own address |

## API overview

All endpoints are documented in Swagger. 🔒 = requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | create an account, returns `{ token }` |
| POST | `/api/auth/login` | log in, returns `{ token }` |
| GET 🔒 | `/api/auth/me` | current user (`id`, `email`, `username`, `createdAt`, `roles`) |
| GET | `/api/builds` | paged catalog – `page`, `pageSize`, `search`, `purpose`, `sort`, `minPrice`, `maxPrice` |
| GET | `/api/builds/{id}` | build details |
| POST 🔒 | `/api/builds` | create a build (`multipart/form-data` with photo) |
| PUT 🔒 | `/api/builds/{id}` | edit own build (photo optional) |
| DELETE 🔒 | `/api/builds/{id}` | delete own build (admins: any build) |
| GET | `/api/builds/{buildId}/comments` | paged comments, newest first |
| POST 🔒 | `/api/builds/{buildId}/comments` | add a comment |
| PUT 🔒 | `/api/comments/{id}` | edit own comment |
| DELETE 🔒 | `/api/comments/{id}` | delete own comment (admins: any comment) |
| POST 🔒 | `/api/builds/{buildId}/like` | like a build |
| DELETE 🔒 | `/api/builds/{buildId}/like` | remove the like |
| GET | `/api/users/{id}/builds` | paged builds of one user |

List responses have the shape `{ items, page, pageSize, totalCount, totalPages }`. Errors are returned as `{ "message": "..." }`, or for validation as `{ "errors": { "Field": ["..."] } }`.

## Design

- **One dark theme with a single orange accent** for actions and the active page, defined once as design tokens in `src/index.css` (backgrounds, borders, four text shades, accent, danger, one colour per build purpose).
- **Consistent components**: the same buttons, inputs, chips, cards and spacing on every page; Inter for text, JetBrains Mono for prices, specs and badges.
- **Clear calls to action**: "Post a build" is the only filled orange button in the header; destructive actions (Delete) are red.
- **Feedback on interaction**: hover and focus states on links, buttons, inputs and cards, a visible keyboard focus outline, loading and error messages for every request.
- **Responsive layout**: 1 / 2 / 3 card columns, a collapsible menu on phones, filter chips that scroll sideways on small screens.

## Known limitations

- **Free hosting cold starts.** The first request after a quiet period takes up to a minute (see the note at the top).
- **Uploaded photos are not permanent on the free plan.** Render's free instances have no persistent disk, so uploaded images are lost when the service restarts or redeploys, while the builds themselves stay in the database. The UI then shows the build's purpose-coloured placeholder instead of the photo. A persistent disk or an external image store (e.g. Cloudinary) would fix this.
- **No public "user profile" endpoint**, so a user page shows the username taken from that user's builds.

---

# Functional Guide

## 1. Project Overview

**Application Name:** RigForge

**Application Category / Topic:** Community catalog / social sharing platform for PC builds

**Main Purpose:** RigForge lets PC enthusiasts publish the computers they have built – with a photo, the main components, the total price and a short story – and discover builds from other people. Visitors can search and filter the catalog by purpose, parts and price to find ideas for their next PC, while registered users can share their own rigs and give feedback through likes and comments.

## 2. User Access & Permissions

### Guest (Not Authenticated)
- **Available pages / routes:** Catalog `/`, Build details `/builds/:id`, User builds `/users/:id`, About `/about`, Login `/login`, Register `/register`, Not found `*`.
- **Public data shown:** all builds (photo, purpose, title, CPU / GPU / RAM / storage / PSU, price, owner, number of likes and comments), the full details and description of each build, all comments, and the list of builds of any user.
- Guests cannot like, comment or post. The like button and the comment box lead to the login page; "Post a build" and "My builds" are not shown.

### Authenticated User
- **Main sections / pages:** Catalog `/`, My builds `/profile`, Post a build `/builds/new`, About `/about`.
- **Details pages:** Build details `/builds/:id` (with like button and comment form), User builds `/users/:id`.
- **Create / Edit / Delete actions:**
  - Create builds; edit and delete **only their own** builds (`/builds/edit/:id`).
  - Like / unlike any build.
  - Write comments; edit and delete **only their own** comments.
  - **Admin** users can additionally delete any build or comment, but cannot edit other people's content.
- Ownership is checked twice: the UI shows Edit / Delete only to the author, and the API returns `403 Forbidden` if anyone else tries.

## 3. Authentication & Session Handling

### Authentication Flow
- **When the app loads:** `AuthProvider` reads the JWT from `localStorage`. If there is one, it calls `GET /api/auth/me`. While this check runs, route guards show a loading state instead of redirecting.
- **How authentication status is checked:** a successful `/api/auth/me` response stores the user (`id`, `username`, `email`, `roles`) in `AuthContext`; a `401` (expired or invalid token) clears the token, and the user continues as a guest. Every API request sends the token in the `Authorization` header, and a `401` from any endpoint logs the user out.
- **On successful login or registration:** the API returns a token; the app saves it in `localStorage`, loads the user with `/api/auth/me`, and navigates to the page the user originally wanted to open (saved by the route guard) or to the catalog. Registration logs the user in immediately.
- **On logout:** the token is removed from `localStorage`, the user in the context is cleared, and the app navigates to the catalog. No server call is needed because JWT authentication is stateless.

### Session Persistence
- **How is the user session stored?** The JWT is stored in `localStorage`; the decoded user data lives in React state inside `AuthContext`.
- **How is automatic login handled after a page refresh?** On startup the token from `localStorage` is validated with `GET /api/auth/me`, which restores the user into the context. If the token has expired (its lifetime is configured on the server), the user is logged out automatically.

## 4. Routing Structure

### Route Guards Logic
- **Private routes** (`/builds/new`, `/builds/edit/:id`, `/profile`) are nested under a `RouteGuard` layout route. Without a logged-in user it redirects to `/login` and remembers the requested page, so the user returns there after logging in.
- **Guest-only routes** (`/login`, `/register`) are nested under a `GuestRoute` layout route that redirects logged-in users to the catalog.
- All other routes are public.
- Editing a build has an extra check on the page itself: if the build does not belong to the current user, the edit form is not shown.

### Main Routes

| Route | Page | Access |
|---|---|---|
| `/` | Build catalog (home) | public |
| `/builds/:id` | Build details | public |
| `/users/:id` | Builds of one user | public |
| `/about` | About the project | public |
| `/login` | Login | guests only |
| `/register` | Register | guests only |
| `/builds/new` | Post a build | logged in |
| `/builds/edit/:id` | Edit a build | logged in (author) |
| `/profile` | My builds + account info | logged in |
| `*` | Not found | public |

That is 10 top-level pages: 4 public content pages, 2 guest-only pages, 3 private pages and the 404 page. The dynamic, data-driven pages are the catalog, build details, user builds, my builds, and the create / edit forms.

### Nested & Parameterized Routes
- **Nested routing:** yes. The private pages are child routes of the `RouteGuard` layout route, and the login / register pages are child routes of the `GuestRoute` layout route; both render their children through `<Outlet />`. The header and footer wrap every page.
- **Routes with URL parameters:** `/builds/:id`, `/builds/edit/:id` and `/users/:id`. The catalog also keeps its filters in the query string (for example `/?purpose=Gaming&sort=MostLiked&page=2`), so filtered views can be refreshed, bookmarked and shared.

## 5. List → Details Flow

### Catalog / List Page
- **What data is displayed?** A grid of build cards from `GET /api/builds`: photo, purpose badge, title, CPU / GPU / RAM, owner, time since posting, number of likes and the price in euro, plus the total number of matching builds.
- **How does the user interact with the list?**
  - **Search** by CPU, GPU or title;
  - **Filter** by purpose with chips (All, Gaming, Development, Workstation, Budget, HTPC);
  - **Sort** by newest, oldest, most liked, price low → high or high → low;
  - **Paginate** with previous / next and page numbers (12 builds per page).

  All of these are stored in the URL with `useSearchParams` and sent to the API as query parameters.

### Details Page
- **How is navigation triggered?** Each card's title is a `<Link>` to `/builds/:id` that covers the whole card. After creating or editing a build the app navigates with `useNavigate`.
- **What data is received via route parameters?** The build `id`, read with `useParams`. The page uses it to load `GET /api/builds/{id}` (specs, description, owner, likes, whether the current user liked it) and `GET /api/builds/{id}/comments`.

## 6. Data Source & Backend

### Backend Type
- **Real custom backend:** an ASP.NET Core 10 REST API with Entity Framework Core and ASP.NET Core Identity, connected to a hosted **Azure SQL Database**. Authentication uses JWT tokens with roles.
- **Deployment:** the API and the React build run together in one Docker container on **Render**: https://rigforge-62iq.onrender.com. Swagger documentation is at `/swagger`.
- **Note for reviewers:** the free Render instance sleeps after 15 minutes without traffic and the database pauses when idle. The first request can take up to a minute while they wake up; after that the app responds normally.
- All data is persisted in the database and does not reset between visits.

## 7. Data Operations (CRUD)

The main collection is **Builds**. Comments also support full CRUD, and likes support create / delete.

### Create (POST)
- **How does the user create new data?** A logged-in user opens "Post a build" (`/builds/new`), fills in the controlled form (title, purpose, CPU, GPU, RAM, storage, PSU, price, description) and chooses a photo, which is previewed before upload. On submit the form is validated in the browser and sent as `multipart/form-data` to `POST /api/builds`. On success the user is taken to "My builds", where the new build appears first.
- **Comments:** written in the comment box on the details page and sent with `POST /api/builds/{id}/comments`.

### Read (GET)
- **Where is data fetched and displayed?**
  - the catalog: `GET /api/builds` with filters and paging;
  - build details: `GET /api/builds/{id}` and its comments;
  - a user's builds: `GET /api/users/{id}/builds`;
  - "My builds": `GET /api/auth/me`, then `GET /api/users/{me.id}/builds`.

  Every request runs in `useEffect` with loading and error states.

### Update (PUT/PATCH)
- **How does the author edit an existing record?** The Edit button is visible only to the author: on the details page and on their cards in "My builds". It opens `/builds/edit/:id` with the form pre-filled from `GET /api/builds/{id}`. The photo is optional – leaving it empty keeps the current one. The form is sent with `PUT /api/builds/{id}`.
- **How is the UI updated after the change?** The app navigates to the build's details page, which loads the updated build from the API and shows an "edited" date. Editing a comment happens inline on the details page; after `PUT /api/comments/{id}` the comment list is reloaded and the comment is marked "(edited)".

### Delete
- **How does the author delete an existing record?** The Delete button (author, or any admin) asks for confirmation and then calls `DELETE /api/builds/{id}`. Comments are deleted the same way with `DELETE /api/comments/{id}`. Deleting a build also removes its comments, likes and photo.
- **How is the UI updated after the change?** After deleting from the details page, the app navigates back to the catalog; after deleting from "My builds", the list is reloaded without the build. A deleted comment disappears from the list, and the comment count decreases.

## 8. Forms & Validation

### Forms Used
- **Login:** email, password
- **Register:** email, username, password, confirm password
- **Post a build / Edit build:** title, purpose, CPU, GPU, RAM, storage, PSU, price, description, photo
- **Comment:** new comment and inline edit
- **Catalog search and filters:** search text, purpose, sort, page

All inputs are controlled components (`value` + `onChange`) and forms are submitted through `onSubmit` with `event.preventDefault()`.

### Validation Rules

The same rules are checked in the browser before sending and again by the API. Server-side messages are shown under the matching field.

- **Title:** required, 5–60 characters.
- **Price (€):** required, a number between 1 and 100 000.
- **Description:** required, at least 20 and at most 800 characters.
- **Photo:**
  - required when creating, optional when editing;
  - JPG, PNG or WEBP only;
  - at most 5 MB.
- **CPU, GPU, RAM, Storage, PSU:** required, 2–60 characters each.
- **Purpose:** must be one of Gaming, Development, Workstation, Budget, HTPC.
- **Username** (multiple rules):
  - required;
  - 3–20 characters;
  - only letters, digits, `.`, `_` and `-`;
  - must not be taken already (checked by the server).
- **Email:**
  - required;
  - valid email format;
  - at most 120 characters;
  - must not be registered already (checked by the server).
- **Password** (multiple rules):
  - at least 6 characters;
  - at least one digit;
  - "Confirm password" must match.
- **Comment:** 3–300 characters.

## 9. React-Specific Techniques

### Hooks & Component Lifecycle
- **Which hooks are used, and where?**
  - `useState`: form values, field errors, loading / error flags, loaded data, the mobile menu, the like state;
  - `useEffect`: loading data from the API, restoring the session on startup;
  - `useContext`: reading the logged-in user from `AuthContext`;
  - React Router hooks: `useParams` (ids in the URL), `useNavigate` (redirects after create / edit / delete / login), `useSearchParams` (catalog filters) and `useLocation` (remembering the requested page in the route guard).
- **Mount / update / unmount example:** the Build details page loads its data in a `useEffect` that depends on the `id` from the URL:
  - **mount** – the first visit fetches the build and its comments;
  - **update** – navigating to another build (a new `id`) runs the effect again for the new build;
  - **unmount** – the cleanup function aborts the pending request with `AbortController` when the user leaves the page or switches builds, so a slow old response can never overwrite the new one.

### Context API
- **What state/data is shared through Context?** `AuthContext` shares the current user, the token, whether the session check is still loading, an `isAdmin` flag, and the `login(token)` and `logout()` functions.
- **Which components consume it?**
  - the header and navbar (guest vs logged-in links, avatar, logout);
  - `RouteGuard` and `GuestRoute`;
  - the Login and Register pages;
  - the build details page (owner / admin actions, like button, comment form);
  - "My builds";
  - the API helper, which adds the token to requests.

### Component Styling
- **How are components styled?** With **Tailwind CSS** utility classes, plus the external stylesheet `src/index.css`, which imports Tailwind and defines the design tokens (colour palette, fonts, base styles for the page and focus outlines) with Tailwind's `@theme`. Tailwind is integrated through its Vite plugin (`vite.config.js`).

## 10. Typical User Flow

1. A visitor opens the catalog, chooses the **Gaming** filter and sorts by **Most liked**.
2. They open a build to see its full specs, description and comments.
3. They register an account and are logged in immediately.
4. They like the build and leave a comment asking about the fans.
5. They click **Post a build**, fill in their own rig, upload a photo and publish it.
6. In **My builds** they notice a typo, edit the build and save – the details page shows the corrected text.
7. Later they delete an old build they no longer own, and finally log out.

## 11. Error & Edge Case Handling

- **Authentication errors:**
  - wrong credentials show "Invalid email or password.";
  - 5 failed attempts lock the account for 5 minutes ("Too many failed attempts…");
  - a taken email or username during registration is shown on the form;
  - an expired or invalid token logs the user out and sends them to the login page;
  - private pages redirect guests to login instead of failing.
- **Network or data errors:**
  - every request has a loading state and shows a readable error message instead of crashing (the API helper turns network failures and server errors into one error object);
  - validation errors from the API appear under the matching form fields;
  - submit buttons are disabled while sending, to prevent double submissions;
  - liking updates the UI immediately and rolls back if the request fails;
  - a permission error (`403`) shows "You can only change your own builds."
- **Empty or missing data states:**
  - **Empty results:** an empty catalog result shows "No builds match your filters" with a reset button, and a user without builds shows an empty state with a link to post one.
  - **Missing records:** a build or user that does not exist shows a "not found" message, and unknown URLs show the 404 page.
  - **Missing photos:** a photo that cannot be loaded falls back to a colour placeholder based on the build's purpose.
