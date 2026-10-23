import useFetchData, {toQueryString} from "../ utils/request.js";
import {useRef, useState} from "react";
import Spinner from "./Loading.jsx";
import BuildCollection from "./BuildCollection.jsx";
import {filtersOptions, rigPurposes} from "../ utils/ApplicationConstants.js";
import Pagination from "./Pagination.jsx";
import ErrorLoadingBuilds from "./ErrorLoadingBuilds.jsx";

const defaultOptions = {
    search: '',
    purpose: '',
    sort: 'Newest',
    page: 1,
    pageSize: 12,
}

export default function Home(){

    const [purposes, setPurposes] = useState(rigPurposes[0]);
    const [filter, selectedFilter] = useState(filtersOptions[0]);
    const [isSortDropdownOpened, setIsSortDropdownOpened] = useState(false);
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);
    const [page, setPage] = useState(defaultOptions.page);

    const query = {
        ...defaultOptions,
        search,
        purpose: purposes.purpose,
        sort: filter.sort,
        page: page,
    }

    const {data, errors, onRefresh, loading: isLoading} = useFetchData(
        {items: [], page: 1, pageSize: 12, totalCount: 0, totalPages: 0},
        `/api/builds?${toQueryString(query)}`
    );

    const onSearchSubmit = (formData) => {
        setSearch((formData.get('search') ?? '').trim());
    }

    const clearSearch = () => {
        searchInputRef.current.value = '';
        setSearch('');
    }

    const openCloseSortOptions = () => {
        setIsSortDropdownOpened(!isSortDropdownOpened);
    }

    const selectFromDropdown = (option) => {
        selectedFilter(option);
        setPage(1);
        setIsSortDropdownOpened(false);
    }

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">Build
                            Catalog</h1>
                        <p className="mt-1.5 text-sm text-ink-muted">{data.totalCount} rigs shared by the community — filter by what
                            you are building for.</p>
                    </div>

                    <div className="relative max-sm:w-full">
                        <button
                            type="button"
                            onClick={openCloseSortOptions}
                            className="flex h-9 w-full items-center gap-2 rounded-md border border-accent bg-card pr-2.5 pl-3 text-[13px] transition-colors max-sm:justify-between">
                            <span className="text-ink-dim">Sort</span>
                            <span className="font-semibold text-ink">{filter.value}</span>
                            <svg className={isSortDropdownOpened ?
                                "size-3.5 rotate-180 text-ink-muted transition-transform" : "size-3.5 rotate-360 text-ink-muted transition-transform"} viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {isSortDropdownOpened && (<ul className="absolute top-full right-0 z-20 mt-2 w-56 rounded-[10px] border border-line-strong bg-card p-1 shadow-lg shadow-black/40 max-sm:left-0 max-sm:w-full">
                            {filtersOptions.map(option =>
                                <li key={option.key}>
                                    {filter.value === option.value ?
                                        (<button type="button"
                                                 onClick={() => selectFromDropdown(option)}
                                                 className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-accent transition-colors hover:bg-field">
                                            {option.value}
                                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                 strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6 9 17l-5-5"/>
                                            </svg>
                                        </button>)
                                        :
                                        (<button type="button"
                                                 onClick={() => selectFromDropdown(option)}
                                                 className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-field hover:text-ink">
                                            {option.value}
                                        </button>)}
                                </li>)}
                        </ul>)}

                    </div>
                </div>

                <form className="mb-7 flex flex-wrap items-center gap-3" role="search" action={onSearchSubmit}>
                    <label className="relative w-full sm:w-75">
                        <svg
                            className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-ink-dim"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7"/>
                            <path d="m20 20-3.5-3.5"/>
                        </svg>
                        <input
                            ref={searchInputRef}
                            className="w-full rounded-md border border-line-strong bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none h-9 pl-9 pr-9 text-[13px] [&::-webkit-search-cancel-button]:appearance-none"
                            type="search" name="search" maxLength="60" placeholder="Search by CPU, GPU or title..."
                            defaultValue={search}/>

                        {search && (
                            <button type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                    className="absolute top-1/2 right-1.5 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded text-ink-dim transition-colors hover:bg-line-strong hover:text-ink">
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12"/>
                                </svg>
                            </button>
                        )}
                    </label>

                    <div
                        className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                        {rigPurposes.map(purpose =>
                            <button type="button"
                                    onClick={() => { setPurposes(purpose); setPage(1); }}
                                    key={purpose.key}
                                    className={`inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors ${
                                        purposes.value === purpose.value ? 
                                            ('border-accent bg-accent/10 text-accent')
                                            :
                                            ('border-line-strong bg-field text-ink-soft hover:border-ink-dim')}`}>{purpose.value}
                            </button>
                        )}
                    </div>
                </form>

                {isLoading && <Spinner />}

                {<ErrorLoadingBuilds isLoading={isLoading} errors={errors} />}

                {!isLoading && !errors && <BuildCollection builds={data.items} onLike={onRefresh}/>}

                {data.items.length === 0 ?? (
                    <div
                        className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted"
                        hidden>
                        <h3 className="mb-1.5 text-base font-semibold text-ink">No builds match your filters</h3>
                        <p>Try another purpose or clear the search.</p>
                        <button type="button"
                                className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim mt-5">Reset
                            filters
                        </button>
                    </div>)}

                {<Pagination page={page} setPage={setPage} totalPages={data.totalPages} />}
            </div>
        </main>
    );
}
