import {Link} from "react-router";
import useFetchData from "../ utils/request.js";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function BuildAuthor({owner}){

    const {data, loading: isLoading, errors} = useFetchData(
        {items: [], page: 1, pageSize: 1, totalCount: 0, totalPages: 0},
        `/api/users/${owner.id}/builds?page=1&pageSize=1`
    );

    return(
        <section className="flex flex-col gap-3.5 rounded-xl border border-line bg-card p-5.5">
            <div className="flex items-center gap-3.25">
                <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-11 text-base">{owner.username[0]}</span>
                <div className="flex min-w-0 flex-col gap-0.75">
                    <p className="truncate text-[15px] font-semibold text-ink">@{owner.username}</p>
                    {!isLoading && !errors && (
                        <p className="text-[12.5px] text-ink-dim">{data.totalCount} {data.totalCount === 1 ? 'build' : 'builds'} shared</p>
                    )}
                </div>
            </div>
            <Link className="inline-flex h-9.5 w-full items-center justify-center rounded-lg border border-line-strong bg-field text-[13.5px] font-medium text-ink-muted transition-colors hover:border-ink-dim hover:text-ink"
                  to={publicRoutes.userBuilds(owner.id)}>View profile</Link>
        </section>
    );
}
