export default function Home(){
    /* Todo:
        count builds fetch,
         purpose click,
          builds fetch,
          pagination,
          likes and is the liked this,
          search bar,
          better dropdown
    */

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">Build
                            Catalog</h1>
                        {/* 128 = totalCount from GET /api/builds */}
                        <p className="mt-1.5 text-sm text-ink-muted">128 rigs shared by the community — filter by what
                            you are building for.</p>
                    </div>

                    {/* sort: Newest | Oldest | MostLiked | PriceAscending | PriceDescending */}
                    <div className="relative max-sm:w-full">
                        {/* trigger button */}
                        <button
                            type="button"
                            className="flex h-9 w-full items-center gap-2 rounded-md border border-accent bg-card pr-2.5 pl-3 text-[13px] transition-colors max-sm:justify-between">
                            <span className="text-ink-dim">Sort</span>
                            <span className="font-semibold text-ink">Most liked</span>
                            <svg className="size-3.5 rotate-180 text-ink-muted transition-transform" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {/* options list (shown when open) */}
                        <ul className="absolute top-full right-0 z-20 mt-2 w-56 rounded-[10px] border border-line-strong bg-card p-1 shadow-lg shadow-black/40 max-sm:left-0 max-sm:w-full">
                            <li>
                                <button type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-field hover:text-ink">
                                    Newest
                                </button>
                            </li>
                            <li>
                                <button type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-field hover:text-ink">
                                    Oldest
                                </button>
                            </li>
                            {/* selected option: orange + check mark */}
                            <li>
                                <button type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-accent transition-colors hover:bg-field">
                                    Most liked
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                         strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-field hover:text-ink">
                                    Price: low to high
                                </button>
                            </li>
                            <li>
                                <button type="button"
                                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] text-ink-soft transition-colors hover:bg-field hover:text-ink">
                                    Price: high to low
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="mb-7 flex flex-wrap items-center gap-3" role="search">
                    <label className="relative w-full sm:w-75">
                        <svg
                            className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-ink-dim"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7"/>
                            <path d="m20 20-3.5-3.5"/>
                        </svg>
                        <input
                            className="w-full rounded-md border border-line-strong bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none h-9 pl-9 text-[13px]"
                            type="search" name="search" maxLength="60" placeholder="Search by CPU, GPU or title..."/>
                    </label>

                    {/* purpose filter: "All" = no purpose param. On phones the chips scroll sideways. */}
                    <div
                        className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-accent bg-accent/10 text-accent">All
                        </button>
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim">Gaming
                        </button>
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim">Development
                        </button>
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim">Workstation
                        </button>
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim">Budget
                        </button>
                        <button type="button"
                                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong bg-field text-ink-soft hover:border-ink-dim">HTPC
                        </button>
                    </div>
                </form>

                {/* BuildGrid: one BuildCard per item in items */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div
                            className="relative aspect-5/2 bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Gaming</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-accent stroke-accent" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>34
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Ryzen
                                    Workhorse</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Ryzen 7 5700X3D</dd>
                                <dt>GPU</dt>
                                <dd>RTX 4060 Ti 8GB</dd>
                                <dt>RAM</dt>
                                <dd>32GB DDR4-3600</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">v</span>
                                    <span className="truncate">@velin</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span
                                    className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">1 268<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div
                            className="relative aspect-5/2 bg-media bg-linear-135 from-development/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Development</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>21
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Silent
                                    Dev Box</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Ryzen 7 8845HS</dd>
                                <dt>GPU</dt>
                                <dd>Radeon 780M iGPU</dd>
                                <dt>RAM</dt>
                                <dd>32GB DDR5-4800</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">m</span>
                                    <span className="truncate">@mira_k</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">997<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div
                            className="relative aspect-5/2 bg-media bg-linear-135 from-budget/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Budget</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-accent stroke-accent" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>58
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Budget
                                    1080p Starter</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Ryzen 5 5600</dd>
                                <dt>GPU</dt>
                                <dd>RX 6600 8GB</dd>
                                <dt>RAM</dt>
                                <dd>16GB DDR4-3200</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">d</span>
                                    <span className="truncate">@dani99</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">608<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div
                            className="relative aspect-5/2 bg-media bg-linear-135 from-workstation/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Workstation</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>12
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Render
                                    Node A2</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Threadripper 7960X</dd>
                                <dt>GPU</dt>
                                <dd>RTX 4080 Super</dd>
                                <dt>RAM</dt>
                                <dd>128GB DDR5-5600</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">s</span>
                                    <span className="truncate">@studio_bg</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span
                                    className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">5 829<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-htpc/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">HTPC</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>9
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Living
                                    Room HTPC</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Ryzen 5 8600G</dd>
                                <dt>GPU</dt>
                                <dd>Radeon 760M iGPU</dd>
                                <dt>RAM</dt>
                                <dd>16GB DDR5-5200</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">p</span>
                                    <span className="truncate">@petar.t</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">455<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div
                            className="relative aspect-5/2 bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span
                                className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Gaming</span>
                            <span
                                className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path
                    d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>77
              </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">White
                                    ITX Showpiece</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt>
                                <dd>Ryzen 7 7800X3D</dd>
                                <dt>GPU</dt>
                                <dd>RTX 4070 Ti Super</dd>
                                <dt>RAM</dt>
                                <dd>32GB DDR5-6000</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <a className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                                   href="../user-builds/user-builds.html">
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">i</span>
                                    <span className="truncate">@ivo_builds</span>
                                    <span className="whitespace-nowrap text-ink-dim">· 2d</span>
                                </a>
                                <span
                                    className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">2 362<span
                                    className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Empty state: show instead of the grid when items.length === 0 */}
                <div
                    className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted"
                    hidden>
                    <h3 className="mb-1.5 text-base font-semibold text-ink">No builds match your filters</h3>
                    <p>Try another purpose or clear the search.</p>
                    <button type="button"
                            className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim mt-5">Reset
                        filters
                    </button>
                </div>

                {/* Pagination: page / totalPages, hidden when totalPages <= 1 */}
                <nav className="mt-10 flex flex-wrap justify-center gap-1.5" aria-label="Pages">
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong pointer-events-none opacity-40"
                       href="#" aria-disabled="true">‹ Prev</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-accent bg-accent/10 text-accent"
                       href="#" aria-current="page">1</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong"
                       href="#">2</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong"
                       href="#">3</a>
                    <span className="inline-flex items-center px-1 text-ink-dim">…</span>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong"
                       href="#">11</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong"
                       href="#">Next ›</a>
                </nav>
            </div>
        </main>
    );
}
