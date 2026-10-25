# RigForge

RigForge is a small community catalog of real PC builds. People share the computer they built, with a photo, its main parts and its price, and everyone can browse, search and filter the builds to get ideas for their own rig. Logged-in users post their builds, edit or delete them, and like the builds of others.

---

## 1. Open the app on the internet

| | |
|---|---|
| **Live app** | **https://rigforge-62iq.onrender.com** |
| **API documentation (Swagger)** | https://rigforge-62iq.onrender.com/swagger |
| **Health check** | https://rigforge-62iq.onrender.com/health |

All you need is a web browser. Nothing has to be installed.

> **The first visit can take up to a minute.** The app runs on free hosting: the server sleeps after 15 minutes without visitors and the database pauses when it is idle. The first request wakes both up; after that the app is fast. If the first page shows an error, wait a few seconds and refresh.

---

## 2. Admin account and Swagger

### Admin account

Log in on the live app with:

| Field | Value |
|---|---|
| Email | `admin@admin.com` |
| Username | `admin` |
| Password | `Admin-123` |

Log in with the **email** and the password. The admin can do everything a normal user can, and can also delete any build.

### Swagger (API documentation)

1. Open https://rigforge-62iq.onrender.com/swagger. Every endpoint is listed and can be tried from the page.
2. Public endpoints (for example `GET /api/builds`) work straight away: click **Try it out**, then **Execute**.
3. For protected endpoints, log in first:
   - open `POST /api/auth/login`, click **Try it out** and send:
     ```json
     { "email": "admin@admin.com", "password": "Admin-123" }
     ```
   - copy the `token` value from the response;
   - click **Authorize** at the top of the page, paste only the token (without the word `Bearer`) and confirm.
4. Protected endpoints such as `POST /api/builds` or `DELETE /api/builds/{id}` now run as the admin.

---

## 3. Run the project locally

### Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| [Node.js](https://nodejs.org/) | 22 or newer | frontend |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0 | backend |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any recent | local SQL Server (option B) and the production image (option C) |

```bash
git clone https://github.com/VelinPoznakov/RigForge.git
cd RigForge
```

### Option A – Frontend only, using the live API

The quickest way to run the React app.

```bash
cd frontend
npm install
```

Create the file `frontend/.env.development.local` with:

```
VITE_API_URL=https://rigforge-62iq.onrender.com
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173. The live API already allows requests from this address.

### Option B – Frontend and backend on your machine

**1. Start SQL Server in Docker**

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong!Passw0rd>" -p 1433:1433 --name rigforge-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

**2. Configure the backend** with [user secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets), which are kept outside the repository:

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

`Database:MigrateOnStartup` creates the database and its tables on the first start. The `User` and `Admin` roles and the admin account are created automatically.

**3. Start the API**

```bash
dotnet run --launch-profile http
```

The API runs on http://localhost:5108 and Swagger on http://localhost:5108/swagger.

**4. Start the frontend** in a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.development.local` with:

```
VITE_API_URL=http://localhost:5108
```

```bash
npm run dev
```

Open http://localhost:5173.

### Option C – The production image (same as the live app)

The root `Dockerfile` builds the React app and the API into one image, exactly as Render does:

```bash
docker build -t rigforge .
docker run -p 10000:10000 -e "ConnectionStrings__Database=<connection string>" -e Jwt__Issuer=RigForge -e Jwt__Audience=RigForge -e "Jwt__Key=<32+ characters>" -e Jwt__AccessTokenMinutes=60 -e Admin__Email=admin@rigforge.local -e Admin__Username=admin -e "Admin__Password=<password>" -e Database__MigrateOnStartup=true rigforge
```

Open http://localhost:10000.

### Useful commands (frontend)

| Command | What it does |
|---|---|
| `npm install` | installs the packages |
| `npm run dev` | starts the dev server on http://localhost:5173 |
| `npm run build` | creates the production build in `frontend/dist` |
| `npm run lint` | checks the code with oxlint |

---

## 4. Pages

| Route | Page | Who can open it |
|---|---|---|
| `/` | **Catalog** – all builds with search, purpose filter, sorting and pagination | everyone |
| `/builds/:id` | **Build details** – photo, full specs, price, description, likes, author | everyone |
| `/users/:id` | **User builds** – all builds of one user | everyone |
| `/about` | **About** – what RigForge is | everyone |
| `/login` | **Login** | guests only |
| `/register` | **Register** | guests only |
| `/builds/new` | **Post a build** | logged-in users |
| `/builds/edit/:id` | **Edit build** | logged-in users (only the author can save) |
| `/profile` | **My builds** – account info and the user's own builds with Edit / Delete | logged-in users |
| `*` | **Not found** | everyone |

---

## 5. Technologies

| Part | Technologies |
|---|---|
| Frontend | React 19, React Router 8, Vite 8, Tailwind CSS 4, native `fetch`, oxlint |
| Backend | ASP.NET Core 10 Web API (C#), Entity Framework Core 10, ASP.NET Core Identity |
| Authentication | JWT bearer tokens with roles (`User`, `Admin`), account lockout after 5 failed logins |
| Database | Microsoft SQL Server – Azure SQL Database (serverless) in production, SQL Server 2022 in Docker locally |
| API documentation | OpenAPI + Swagger UI |
| Hosting | Render (one Docker container for the React app and the API), Azure (database) |

### Architecture in short

```
 Browser (React)  ──▶  Render – one Docker container          ──▶  Azure SQL Database
                       ASP.NET Core API
                        ├─ /api/...      REST endpoints (JSON)
                        ├─ /swagger      API documentation
                        ├─ /<guid>.jpg   uploaded build photos
                        └─ everything else → React app (index.html)
```

- The `Dockerfile` builds the React app and the API into one image. The API serves the React files and answers `/api/...`, so the frontend calls `/api/...` on the same address and no CORS setup is needed in production.
- The backend is layered: controllers handle HTTP and permissions, services hold the business logic, and Entity Framework Core maps the entities to SQL Server.
- The frontend is split into pages and reusable components (`src/components`), custom hooks (`src/hooks`), the auth context (`src/contexts`), validation rules (`src/validations`) and helpers such as the request functions and route paths (`src/ utils`).

---

## 6. Who built what

- **Backend** (ASP.NET Core API, database, authentication, deployment setup) – built by **Claude**, the AI assistant made by Anthropic.
- **Frontend** (React app) – built by **Velin Poznakov**.

---

## 7. Functional Guide

### 1. Project Overview

**Application Name:** RigForge

**Application Category / Topic:** Community catalog / social sharing platform for PC builds

**Main Purpose:** RigForge lets PC enthusiasts publish the computers they have built – with a photo, the main components, the total price and a short description – and discover builds from other people. Visitors can search and filter the catalog by purpose and parts to find ideas for their next PC, while registered users share their own rigs and like the builds they find useful.

### 2. User Access & Permissions

#### Guest (Not Authenticated)
- **Available pages / routes:** Catalog `/`, Build details `/builds/:id`, User builds `/users/:id`, About `/about`, Login `/login`, Register `/register`, Not found `*`.
- **Public data shown:** all builds (photo, purpose, title, CPU / GPU / RAM / storage / PSU, price, author, number of likes), the full details and description of each build, and the builds of any user.
- Guests cannot like or post. The like button leads to the login page, "Post a build" leads to the login page through the route guard, and "My builds" is shown only to logged-in users. The header has a "Log in" link for guests.

#### Authenticated User
- **Main sections / pages:** Catalog `/`, My builds `/profile`, Post a build `/builds/new`, About `/about`.
- **Details pages:** Build details `/builds/:id`, User builds `/users/:id`.
- **Create / Edit / Delete actions:**
  - create builds with a photo;
  - edit and delete **only their own** builds – from the details page or from the cards in "My builds";
  - like and unlike any build;
  - an **Admin** can also delete any build, but cannot edit other people's builds.
- Ownership is checked twice: the UI shows Edit / Delete only to the author, and the API answers `403 Forbidden` to anyone else.

### 3. Authentication & Session Handling

#### Authentication Flow
- **When the app loads:** `AuthProvider` reads the saved session (`{ token, user }`) from `localStorage` through the `usePersistedState` hook.
- **How authentication status is checked:** the user counts as logged in only if a token exists **and** it has not expired. The expiry time is read from the token itself (`decodeToken`), so an old token automatically shows the logged-out UI.
- **On successful login or registration:** the API returns a JWT. The app decodes it (id, email, username, roles, expiry), saves it in `localStorage` and in `AuthContext`, and redirects the user to "My builds".
- **On logout:** "Log out" on the "My builds" page calls `POST /api/auth/logout`, removes the session from `localStorage` and clears the context. The app switches to the guest view, and private pages are no longer reachable.
- Every request to the API sends the token in the `Authorization: Bearer <token>` header.

#### Session Persistence
- **How is the user session stored?** The token and the decoded user are stored in `localStorage` (key `auth`) and shared through `AuthContext`.
- **How is automatic login handled after a page refresh?** On startup `usePersistedState` reads the session back from `localStorage`, so the user stays logged in until the token expires.

### 4. Routing Structure

#### Route Guards Logic
- **Private routes** (`/builds/new`, `/builds/edit/:id`, `/profile`) are child routes of the `RouteGuard` layout route. If nobody is logged in, it redirects to `/login`; otherwise it renders the page through `<Outlet />`.
- **Guest-only pages** (`/login`, `/register`) redirect a logged-in user to "My builds" with `<Navigate>`.
- All other routes are public.

#### Main Routes
- 10 top-level pages: 4 public content pages (Catalog, Build details, User builds, About), 2 guest-only pages (Login, Register), 3 private pages (Post a build, Edit build, My builds) and the Not found page. See the table in [Pages](#4-pages).
- The data-driven pages are the catalog, build details, user builds, my builds and the create / edit form.

#### Nested & Parameterized Routes
- **Nested routing:** yes – the private pages are child routes of the `RouteGuard` layout route. The header and footer wrap every page.
- **Routes with URL parameters:** `/builds/:id`, `/builds/edit/:id` and `/users/:id`.

### 5. List → Details Flow

#### Catalog / List Page
- **What data is displayed?** A grid of build cards from `GET /api/builds`: photo, purpose badge, title, CPU / GPU / RAM, author, how long ago it was posted, number of likes and the price in euro, plus the total number of builds.
- **How does the user interact with the list?**
  - **Search** by CPU, GPU or title (press Enter; the ✕ button clears it);
  - **Filter** by purpose with chips (All, Gaming, Development, Workstation, Budget, HTPC);
  - **Sort** by newest, oldest, most liked, price low → high or high → low;
  - **Paginate** with previous / next and page numbers (12 builds per page);
  - **Like** a build straight from its card.

  Changing a filter builds a new query string, and the `useFetchData` hook loads the matching page from the API.

#### Details Page
- **How is navigation triggered?** Each card's title is a `<Link>` to `/builds/:id` that covers the whole card. After creating, editing or deleting a build the app navigates with `useNavigate`.
- **What data is received via route parameters?** The build `id`, read with `useParams`. The page loads `GET /api/builds/{id}` (specs, description, author, likes and whether the current user liked it), and the author card loads the author's number of builds.

### 6. Data Source & Backend

#### Backend Type
- **Real custom backend:** an ASP.NET Core 10 REST API with Entity Framework Core and ASP.NET Core Identity, connected to a hosted **Azure SQL Database**. Authentication uses JWT tokens with roles.
- **Deployment:** the API and the React production build run together in one Docker container on **Render**: https://rigforge-62iq.onrender.com. Swagger documentation is at `/swagger`.
- **Note for reviewers:** the free Render instance sleeps after 15 minutes without traffic and the database pauses when idle. The first request can take up to a minute while they wake up; after that the app responds normally.
- All data is stored in the database and does not reset between visits. Uploaded photos are stored on the server's disk, which is not permanent on Render's free plan, so a photo can disappear after a redeploy while the build itself stays.

### 7. Data Operations (CRUD)

The main collection is **Builds**. Likes support create and delete.

#### Create (POST)
- **How does the user create new data?** A logged-in user opens "Post a build" (`/builds/new`), fills in the controlled form (title, purpose, CPU, GPU, RAM, storage, PSU, price, description) and chooses a photo, which is previewed before upload. The form is validated in the browser and sent as `multipart/form-data` to `POST /api/builds`. On success the user goes to "My builds", where the new build appears.
- **Likes:** the heart on a card or on the details page sends `POST /api/builds/{id}/like` (or `DELETE` to unlike).

#### Read (GET)
- **Where is data fetched and displayed?**
  - the catalog: `GET /api/builds` with search, purpose, sort and page;
  - build details: `GET /api/builds/{id}`;
  - a user's builds: `GET /api/users/{id}/builds`;
  - "My builds": `GET /api/auth/me` for the account data and `GET /api/users/{id}/builds` for the builds.

  Every list and details page shows a loading spinner while it waits and an error panel if the request fails.

#### Update (PUT/PATCH)
- **How does the author edit an existing record?** The Edit button is shown only to the author – on the details page and on their cards in "My builds". It opens `/builds/edit/:id`, which loads the build with `useFetchData` and shows the same form as "Post a build", already filled in. The photo is optional: keeping it as it is keeps the current photo. The form is sent with `PUT /api/builds/{id}`.
- **How is the UI updated after the change?** The app navigates to the build's details page, which loads the updated build from the API.

#### Delete
- **How does the author delete an existing record?** The Delete button (author, or any admin on the details page) calls `DELETE /api/builds/{id}`. The API also removes the build's likes and photo.
- **How is the UI updated after the change?** After deleting from the details page the app navigates to "My builds" (or to the catalog for an admin). After deleting from "My builds" the list reloads without the build; if it was the last build on that page, the previous page is shown.

### 8. Forms & Validation

#### Forms Used
- **Login:** email, password
- **Register:** email, username, password, confirm password
- **Post a build / Edit build** (one shared form): title, purpose, CPU, GPU, RAM, storage, PSU, price, description, photo
- **Catalog search:** search text

The Register and build forms are controlled components. One generic `changeHandler` updates every field by its `name`, and errors appear when a field loses focus or when the form is submitted. The same rules are checked again by the API, and server messages are shown under the matching field or at the top of the form.

#### Validation Rules
- **Title:** required, 5–60 characters.
- **Price (€):** required, a number between 1 and 100 000.
- **Description:** required, 20–800 characters.
- **Photo:**
  - required when creating, optional when editing;
  - JPG, PNG or WEBP only;
  - at most 5 MB.
- **CPU, GPU, RAM, Storage, PSU:** required, 2–60 characters each.
- **Purpose:** one of Gaming, Development, Workstation, Budget, HTPC.
- **Username** (multiple rules):
  - 3–20 characters;
  - only letters, digits, `.`, `_` and `-`;
  - must not be taken already (checked by the server).
- **Email:**
  - valid email format;
  - at most 120 characters;
  - must not be registered already (checked by the server).
- **Password** (multiple rules):
  - at least 6 characters;
  - at least one digit;
  - "Confirm password" must match.

### 9. React-Specific Techniques

#### Hooks & Component Lifecycle
- **Which hooks are used, and where?**
  - `useState`: form values and errors, loading flags, selected filters, sort and page, the sort dropdown;
  - `useEffect`: loading data in `useFetchData`, cleaning up photo previews in the build form, clearing old errors on the Register page;
  - `useRef`: the catalog search input (for clearing it);
  - `useMemo`: the preview URL of a newly chosen photo;
  - `useContext`: reading the session from `AuthContext` (through the `useAuth` hook);
  - React Router hooks: `useParams` (ids in the URL) and `useNavigate` (redirects after create / edit / delete / login);
  - custom hooks: `useFetchData` (GET requests with loading and error state), `useForm` (generic controlled-form state, touched fields and validation), `usePersistedState` (state saved in `localStorage`) and `useAuth`.
- **Mount / update / unmount example:** `useFetchData` loads data in a `useEffect` that depends on the request path:
  - **mount** – opening the catalog or a build fetches its data;
  - **update** – changing a filter, the page or the build id changes the path, so the effect runs again and loads the new data;
  - **unmount** – the cleanup function aborts the pending request with `AbortController` when the user leaves the page or the path changes.

#### Context API
- **What state/data is shared through Context?** `AuthContext` shares the logged-in user, the token, whether the user is authenticated, the `login`, `register` and `logout` functions, and the login / register errors and loading state.
- **Which components consume it?** The navbar and footer (guest vs. logged-in links, avatar), `RouteGuard`, the Login and Register pages, the build card and details page (like button, owner and admin actions) and "My builds" (user id, logout).

#### Component Styling
- **How are components styled?** With **Tailwind CSS** utility classes, plus the external stylesheet `src/index.css`. It imports Tailwind and defines the design tokens (colour palette, fonts, page width) and the base styles for the page and focus outlines. Tailwind is connected through its Vite plugin (`vite.config.js`).

### 10. Typical User Flow

1. A visitor opens the catalog, chooses the **Gaming** filter and sorts by **Most liked**.
2. They open a build to see its full specs, price and description.
3. They register an account and are logged in immediately.
4. They like the build they opened.
5. They click **Post a build**, fill in their own rig, upload a photo and publish it.
6. In **My builds** they notice a typo, click **Edit**, fix it and save – the details page shows the corrected build.
7. They delete an old build from **My builds** and finally log out.

### 11. Error & Edge Case Handling

- **Authentication errors:**
  - wrong credentials show "Invalid email or password.";
  - 5 failed attempts lock the account for 5 minutes ("Too many failed attempts…");
  - a taken email or username during registration is shown on the form;
  - an expired token switches the app to the logged-out view;
  - private pages redirect guests to the login page instead of failing.
- **Network or data errors:**
  - every page that loads data shows a spinner while waiting and an error panel with a readable message and a "Try again" button if the request fails;
  - the forms validate input before sending, so invalid data never crashes the app, and validation errors from the API appear under the matching fields;
  - the build form's submit button is disabled while saving, to prevent double submissions;
  - editing someone else's build is rejected by the API, and the form shows "You can only change your own builds."
- **Empty or missing data states:**
  - **Empty results:** a search or filter without results shows "No builds match your filters" with a **Reset filters** button; a user without builds shows "No builds yet"; "My builds" without builds shows "You haven't shared a build yet" with a link to post one.
  - **Missing records:** a build that does not exist shows "Build not found.", and unknown URLs show the Not found page.

---

## 8. More information

The full project documentation – architecture, backend and API, data model, frontend structure, deployment and configuration – is in the [`documentation`](documentation) folder: **`documentation/RigForge-Documentation.docx`**.
