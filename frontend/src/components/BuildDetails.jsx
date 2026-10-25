import {Link, useNavigate, useParams} from "react-router";
import useFetchData, {mutate} from "../ utils/request.js";
import {protectedRoutes, publicRoutes} from "../ utils/ApplicationUrlPaths.js";
import useAuth from "../hooks/useAuth.js";
import Spinner from "./Loading.jsx";
import ErrorLoadingBuilds from "./ErrorLoadingBuilds.jsx";
import BuildAuthor from "./BuildAuthor.jsx";

const buildDefaultState = {
    id: '',
    title: '',
    purpose: '',
    imageUrl: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    psu: '',
    priceEur: 0,
    owner: {id: '', username: ''},
    likesCount: 0,
    commentsCount: 0,
    isLikedByCurrentUser: false,
    createdAt: '',
    description: '',
    updatedAt: null,
}

const secondaryButtonClass = "inline-flex h-8.5 items-center justify-center rounded-lg border border-line-strong bg-field px-3.75 text-[13px] font-medium whitespace-nowrap transition-colors hover:border-ink-dim";

const formatDate = (dateString) => {
    const date = new Date(dateString);

    return `${date.getDate()} ${date.toLocaleString('en-US', {month: 'short'})} ${date.getFullYear()}`;
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2})
        .format(price)
        .replace(/,/g, ' ');
}

export default function BuildDetails(){
    const {id} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, user} = useAuth();

    const {data: build, loading: isLoading, errors, onRefresh} = useFetchData(
        buildDefaultState,
        `/api/builds/${id}`
    );

    const isOwner = isAuthenticated && user.id === build.owner.id;
    const isAdmin = isAuthenticated && user.roles.includes('Admin');

    const onLikeClick = async () => {
        if (!isAuthenticated) {
            navigate(publicRoutes.login);
            return;
        }

        try {
            await mutate(build.isLikedByCurrentUser ? 'DELETE' : 'POST', `/api/builds/${id}/like`);
            onRefresh();
        }
        catch {}
    }

    const onDeleteClick = async () => {
        try {
            await mutate('DELETE', `/api/builds/${id}`);
            navigate(isOwner ? protectedRoutes.profile : publicRoutes.home);
        }
        catch {}
    }

    const specs = [
        {label: 'CPU', value: build.cpu},
        {label: 'GPU', value: build.gpu},
        {label: 'Memory', value: build.ram},
        {label: 'Storage', value: build.storage},
        {label: 'Power supply', value: build.psu},
    ];

    const meta = [
        {label: 'Purpose', value: build.purpose},
        {label: 'Posted', value: formatDate(build.createdAt)},
        {label: 'Likes', value: build.likesCount},
    ];

    return(
        <main className="flex-1 pt-6 pb-14 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                {isLoading && !build.id && <Spinner />}

                <ErrorLoadingBuilds isLoading={isLoading} errors={errors} title="Could not load the build" />

                {build.id && !errors && (
                    <>
                        <nav className="mb-6 flex min-w-0 items-center gap-2.5 text-[13px]" aria-label="Breadcrumb">
                            <Link className="shrink-0 text-ink-muted hover:text-ink" to={publicRoutes.home}>Catalog</Link>
                            <span className="text-ink-dim">/</span>
                            <span className="truncate text-ink">{build.title}</span>
                        </nav>

                        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="flex min-w-0 flex-col gap-6">
                                <div className="relative aspect-5/2 overflow-hidden rounded-[14px] bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                                    <img className="absolute inset-0 size-full object-cover" src={`${import.meta.env.VITE_API_URL ?? ''}${build.imageUrl}`} alt={build.title} />
                                    <span className="absolute top-4.5 left-4.5 inline-flex items-center rounded-md bg-black/70 px-2.75 py-1.75 font-mono text-[10px] font-medium tracking-[0.08em] text-ink uppercase">{build.purpose}</span>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[34px]">{build.title}</h1>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <Link className="flex min-w-0 items-center gap-2.75" to={publicRoutes.userBuilds(build.owner.id)}>
                                            <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-8.5 text-[13px]">{build.owner.username[0]}</span>
                                            <span className="flex min-w-0 flex-col gap-0.5">
                                                <span className="truncate text-sm font-medium text-ink">@{build.owner.username}</span>
                                                <span className="text-xs text-ink-dim">Posted {formatDate(build.createdAt)}</span>
                                            </span>
                                        </Link>

                                        <div className="flex items-center gap-2.5">
                                            <button type="button"
                                                    onClick={onLikeClick}
                                                    aria-pressed={build.isLikedByCurrentUser}
                                                    aria-label={build.isLikedByCurrentUser ? 'Unlike' : 'Like'}
                                                    className={`inline-flex h-8.75 items-center gap-2 rounded-lg border px-3.75 text-[13px] font-semibold transition-colors ${build.isLikedByCurrentUser
                                                        ? 'border-accent bg-accent/10 text-accent'
                                                        : 'border-line-strong bg-field text-ink-muted hover:border-ink-dim hover:text-ink'}`}>
                                                <svg className={build.isLikedByCurrentUser
                                                    ? "size-3.75 fill-accent stroke-accent"
                                                    : "size-3.75 fill-none stroke-current"} viewBox="0 0 24 24" strokeWidth="2.5"><path
                                                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>
                                                {build.likesCount}
                                            </button>

                                            {isOwner && (
                                                <Link className={`${secondaryButtonClass} text-ink-muted hover:text-ink`} to={protectedRoutes.editBuild(build.id)}>Edit</Link>
                                            )}

                                            {(isOwner || isAdmin) && (
                                                <button type="button"
                                                        onClick={onDeleteClick}
                                                        className={`${secondaryButtonClass} text-[#e0a93c]`}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="max-w-190 text-[15px] leading-[1.65] whitespace-pre-line text-ink-muted">{build.description}</p>

                                <section className="overflow-hidden rounded-xl border border-line bg-card">
                                    <h2 className="bg-field px-5 py-3.5 font-mono text-[10px] font-medium tracking-[0.12em] text-ink-dim uppercase">Components</h2>
                                    <dl className="divide-y divide-line">
                                        {specs.map(spec =>
                                            <div key={spec.label} className="flex items-center gap-5 px-5 py-3.75">
                                                <dt className="w-24 shrink-0 text-[13px] text-ink-dim sm:w-37.5">{spec.label}</dt>
                                                <dd className="min-w-0 font-mono text-[13.5px] font-medium break-words text-ink">{spec.value}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </section>
                            </div>

                            <aside className="flex flex-col gap-5">
                                <section className="overflow-hidden rounded-xl border border-line bg-card">
                                    <div className="flex flex-col gap-2 px-5.5 pt-5.5 pb-5">
                                        <p className="font-mono text-[10px] font-medium tracking-[0.12em] text-ink-dim uppercase">Total build cost</p>
                                        <p className="flex items-baseline gap-1.5">
                                            <span className="font-mono text-4xl font-bold tracking-tight text-accent">{formatPrice(build.priceEur)}</span>
                                            <span className="font-mono text-base text-ink-dim">€</span>
                                        </p>
                                    </div>
                                    <dl className="divide-y divide-line border-t border-line text-[13px]">
                                        {meta.map(row =>
                                            <div key={row.label} className="flex items-center justify-between gap-4 px-5.5 py-3.25">
                                                <dt className="text-ink-dim">{row.label}</dt>
                                                <dd className="font-mono font-medium text-ink">{row.value}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </section>

                                <BuildAuthor owner={build.owner} />
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
