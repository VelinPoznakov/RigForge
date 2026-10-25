import useFetchData, {toQueryString} from "../ utils/request.js";
import {Link} from "react-router";
import {useState} from "react";
import useAuth from "../hooks/useAuth.js";
import {protectedRoutes} from "../ utils/ApplicationUrlPaths.js";
import Spinner from "./Loading.jsx";
import ErrorLoadingBuilds from "./ErrorLoadingBuilds.jsx";
import BuildCollection from "./BuildCollection.jsx";
import Pagination from "./Pagination.jsx";

const profileDefaultState = {
    user: {
        id: '',
        email: '',
        username: '',
        createdAt: '',
        roles: []
    }
}

const buildsDefaultState = {
    items: [],
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0
}

const defaultOptions = {
    page: 1,
    pageSize: 12,
}

export default function Profile(){
    const {user, logout} = useAuth();
    const [page, setPage] = useState(defaultOptions.page);

    const query = {
        ...defaultOptions,
        page: page,
    }

    const {data: profile, loading: isProfileLoading, errors: profileErrors} = useFetchData(
        profileDefaultState,
        '/api/auth/me'
    );

    const {data: builds, loading: areBuildsLoading, errors: buildsErrors, onRefresh} = useFetchData(
        buildsDefaultState,
        `/api/users/${user.id}/builds?${toQueryString(query)}`
    );

    const onDelete = () => {
        if (builds.items.length === 1 && page > 1)
            setPage(page - 1);
        else
            onRefresh();
    }

    const memberSince = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {month: 'short', year: 'numeric'});
    }

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                {isProfileLoading && <Spinner />}

                <ErrorLoadingBuilds isLoading={isProfileLoading} errors={profileErrors} title="Could not load your profile" />

                {!isProfileLoading && !profileErrors && (
                    <>
                        <section className="flex flex-col items-center gap-6 rounded-[14px] border border-line bg-card p-6 text-center md:flex-row md:text-left">
                            <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-18 text-[26px]">{profile.user.username[0]}</span>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                                    <h1 className="text-2xl font-bold tracking-tight">{profile.user.username}</h1>
                                    {profile.user.roles.map(role =>
                                        <span key={role} className="inline-flex h-5.5 items-center rounded-full bg-accent/10 px-2.5 text-[11px] font-semibold text-accent">{role}</span>
                                    )}
                                </div>
                                <p className="mt-0.5 truncate text-sm text-ink-muted">{profile.user.email}</p>
                            </div>

                            <dl className="flex w-full justify-center gap-8 border-t border-line pt-4 md:w-auto md:border-0 md:pt-0 [&_dd]:font-mono [&_dd]:text-lg [&_dd]:font-bold [&_dt]:text-xs [&_dt]:text-ink-dim">
                                <div>
                                    <dt>Builds</dt>
                                    <dd>{builds.totalCount}</dd>
                                </div>
                                <div>
                                    <dt>Member since</dt>
                                    <dd>{memberSince(profile.user.createdAt)}</dd>
                                </div>
                            </dl>

                            <button type="button"
                                    onClick={logout}
                                    className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim">Log out</button>
                        </section>

                        <div className="mt-10 mb-5 flex items-center justify-between gap-4">
                            <h2 className="text-lg font-bold tracking-tight">My builds</h2>
                            <Link className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover"
                                  to={protectedRoutes.createBuild}>
                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                                Post a build
                            </Link>
                        </div>

                        {areBuildsLoading && <Spinner />}

                        <ErrorLoadingBuilds isLoading={areBuildsLoading} errors={buildsErrors} />

                        {!areBuildsLoading && !buildsErrors && builds.items.length > 0 && (
                            <BuildCollection builds={builds.items} onLike={onRefresh} onDelete={onDelete} showActions/>
                        )}

                        {!areBuildsLoading && !buildsErrors && builds.items.length === 0 && (
                            <div className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted">
                                <h3 className="mb-1.5 text-base font-semibold text-ink">You haven't shared a build yet</h3>
                                <p>Post your first rig and get feedback from the community.</p>
                                <Link className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover mt-5"
                                      to={protectedRoutes.createBuild}>Post a build</Link>
                            </div>
                        )}

                        <Pagination page={page} setPage={setPage} totalPages={builds.totalPages} />
                    </>
                )}
            </div>
        </main>
    );
}
