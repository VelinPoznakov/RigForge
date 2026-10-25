import useFetchData, {toQueryString} from "../ utils/request.js";
import {Link, useParams} from "react-router";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";
import {useState} from "react";
import Pagination from "./Pagination.jsx";
import Spinner from "./Loading.jsx";
import ErrorLoadingBuilds from "./ErrorLoadingBuilds.jsx";
import BuildCollection from "./BuildCollection.jsx";

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

export default function UserBuilds(){
    const {id} = useParams();
    const [page, setPage] = useState(defaultOptions.page);

    const query = {
        ...defaultOptions,
        page: page,
    }

    const {data, loading, errors, onRefresh} = useFetchData(
        buildsDefaultState,
        `/api/users/${id}/builds?${toQueryString(query)}`
    );

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <Link className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink" to={publicRoutes.home}>
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to catalog
                </Link>

                <section className="mb-8 flex items-center gap-3.5 sm:gap-5">
                    <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-14 text-xl sm:size-18 sm:text-[26px]">{data.items[0]?.owner.username[0]}</span>
                    <div>
                        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">@{data.items[0]?.owner.username}</h1>
                        <p className="mt-1.5 text-sm text-ink-muted">{data.totalCount} builds shared</p>
                    </div>
                </section>

                {loading && <Spinner />}

                {<ErrorLoadingBuilds isLoading={loading} errors={errors} />}

                {!loading && !errors && <BuildCollection builds={data.items} onLike={onRefresh} showUser={false}/>}

                {!loading && !errors && data.items.length === 0 && (
                    <div className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted">
                        <h3 className="mb-1.5 text-base font-semibold text-ink">No builds yet</h3>
                        <p>This user hasn't shared any builds.</p>
                    </div>
                )}

                {<Pagination page={page} setPage={setPage} totalPages={data.totalPages} />}
            </div>
        </main>
    );
}
