export default function UserBuilds(){

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            {/* Data: GET /api/users/{id}/builds (always newest first, no filters) */}
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <a className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink" href="../home/home.html">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to catalog
                </a>

                {/* username: from the link state or items[0].owner.username (no user endpoint) */}
                <section className="mb-8 flex items-center gap-3.5 sm:gap-5">
                    <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-14 text-xl sm:size-18 sm:text-[26px]">d</span>
                    <div>
                        <h1 className="text-[26px] leading-tight font-bold tracking-tight sm:text-[32px]">@dani99</h1>
                        <p className="mt-1.5 text-sm text-ink-muted">14 builds shared</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-budget/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Budget</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-accent stroke-accent" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>58
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Budget 1080p Starter</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 5 5600</dd>
                                <dt>GPU</dt><dd>RX 6600 8GB</dd>
                                <dt>RAM</dt><dd>16GB DDR4-3200</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <span className="text-xs text-ink-dim">2 days ago</span>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">608<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Gaming</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>41
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">1440p Sweet Spot</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 5 7600</dd>
                                <dt>GPU</dt><dd>RX 7800 XT 16GB</dd>
                                <dt>RAM</dt><dd>32GB DDR5-6000</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <span className="text-xs text-ink-dim">1 week ago</span>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">1 150<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-development/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Development</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>8
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Linux Dev Station</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 7 7700</dd>
                                <dt>GPU</dt><dd>RX 7600 8GB</dd>
                                <dt>RAM</dt><dd>64GB DDR5-5600</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <span className="text-xs text-ink-dim">3 weeks ago</span>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">1 020<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-htpc/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">HTPC</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>5
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Quiet Couch Box</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 5 8500G</dd>
                                <dt>GPU</dt><dd>Radeon 740M iGPU</dd>
                                <dt>RAM</dt><dd>16GB DDR5-5200</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <span className="text-xs text-ink-dim">1 month ago</span>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">430<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Empty state: user exists but has no builds */}
                <div className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted" hidden>
                    <h3 className="mb-1.5 text-base font-semibold text-ink">No builds yet</h3>
                    <p>This user hasn't shared any builds.</p>
                </div>

                {/* Pagination: page / totalPages, hidden when totalPages <= 1 */}
                <nav className="mt-10 flex flex-wrap justify-center gap-1.5" aria-label="Pages">
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong pointer-events-none opacity-40" href="#" aria-disabled="true">‹ Prev</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-accent bg-accent/10 text-accent" href="#" aria-current="page">1</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong" href="#">2</a>
                    <a className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong" href="#">Next ›</a>
                </nav>
            </div>
        </main>
    );
}
