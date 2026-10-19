export default function Profile(){

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            {/* Data: GET /api/auth/me, then GET /api/users/{me.id}/builds */}
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <section className="flex flex-col items-center gap-6 rounded-[14px] border border-line bg-card p-6 text-center md:flex-row md:text-left">
                    <span className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-18 text-[26px]">v</span>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                            <h1 className="text-2xl font-bold tracking-tight">velin</h1>
                            {/* one badge per role in user.roles */}
                            <span className="inline-flex h-5.5 items-center rounded-full bg-accent/10 px-2.5 text-[11px] font-semibold text-accent">User</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-ink-muted">velin@example.com</p>
                    </div>

                    <dl className="flex w-full justify-center gap-8 border-t border-line pt-4 md:w-auto md:border-0 md:pt-0 [&_dd]:font-mono [&_dd]:text-lg [&_dd]:font-bold [&_dt]:text-xs [&_dt]:text-ink-dim">
                        <div>
                            <dt>Builds</dt>
                            {/* totalCount from the builds request */}
                            <dd>4</dd>
                        </div>
                        <div>
                            <dt>Member since</dt>
                            <dd>Sep 2026</dd>
                        </div>
                    </dl>

                    {/* auth step: clears the token, no API call */}
                    <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim">Log out</button>
                </section>

                <div className="mt-10 mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-lg font-bold tracking-tight">My builds</h2>
                    <a className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover" href="../build-form/create-build.html">
                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        Post a build
                    </a>
                </div>

                {/* Same BuildCard, but the footer has owner actions instead of the owner name */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Gaming</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>34
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Ryzen Workhorse</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 7 5700X3D</dd>
                                <dt>GPU</dt><dd>RTX 4060 Ti 8GB</dd>
                                <dt>RAM</dt><dd>32GB DDR4-3600</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <div className="relative z-10 flex gap-2">
                                    <a className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim" href="../build-form/edit-build.html">Edit</a>
                                    <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-danger/35 bg-danger/10 text-danger hover:bg-danger/20">Delete</button>
                                </div>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">1 268<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-workstation/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Workstation</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>6
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Video Editing Tower</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Ryzen 9 9950X</dd>
                                <dt>GPU</dt><dd>RTX 4070 Super</dd>
                                <dt>RAM</dt><dd>64GB DDR5-6000</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <div className="relative z-10 flex gap-2">
                                    <a className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim" href="../build-form/edit-build.html">Edit</a>
                                    <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-danger/35 bg-danger/10 text-danger hover:bg-danger/20">Delete</button>
                                </div>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">2 940<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-budget/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">Budget</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>15
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">First PC for my brother</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Intel Core i3-12100F</dd>
                                <dt>GPU</dt><dd>Arc A580 8GB</dd>
                                <dt>RAM</dt><dd>16GB DDR4-3200</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <div className="relative z-10 flex gap-2">
                                    <a className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim" href="../build-form/edit-build.html">Edit</a>
                                    <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-danger/35 bg-danger/10 text-danger hover:bg-danger/20">Delete</button>
                                </div>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">520<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>

                    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
                        <div className="relative aspect-5/2 bg-media bg-linear-135 from-htpc/80 to-transparent to-70%">
                            {/* <img className="absolute inset-0 size-full object-cover" src={imageSrc(build.imageUrl)} alt={build.title} /> */}
                            <span className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">HTPC</span>
                            <span className="absolute top-2.5 right-2.5 inline-flex h-6 items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
            <svg className="size-2.75 fill-none stroke-ink-muted" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z" /></svg>3
          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-4">
                            <h3 className="text-base leading-snug font-bold">
                                {/* after:absolute after:inset-0 stretches the link over the whole card */}
                                <a className="after:absolute after:inset-0" href="../build-details/build-details.html">Tiny Plex Server</a>
                            </h3>
                            <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                                <dt>CPU</dt><dd>Intel N100</dd>
                                <dt>GPU</dt><dd>UHD Graphics iGPU</dd>
                                <dt>RAM</dt><dd>16GB DDR5-4800</dd>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                                <div className="relative z-10 flex gap-2">
                                    <a className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim" href="../build-form/edit-build.html">Edit</a>
                                    <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors border border-danger/35 bg-danger/10 text-danger hover:bg-danger/20">Delete</button>
                                </div>
                                <span className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">310<span className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                            </div>
                        </div>
                    </article>
                </section>

                {/* Empty state: user has no builds yet */}
                <div className="rounded-[14px] border border-dashed border-line-strong px-6 py-14 text-center text-ink-muted" hidden>
                    <h3 className="mb-1.5 text-base font-semibold text-ink">You haven't shared a build yet</h3>
                    <p>Post your first rig and get feedback from the community.</p>
                    <a className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover mt-5" href="../build-form/create-build.html">Post a build</a>
                </div>
            </div>
        </main>
    );
}
