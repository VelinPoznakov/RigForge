import {Link} from "react-router";
import {protectedRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function About(){

    return(
        <main className="flex-1 pt-7 pb-14 sm:pt-10 sm:pb-18">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6">
                <section className="mb-12 max-w-190">
                    <p className="mb-3 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">About RigForge</p>
                    <h1 className="text-[30px] leading-[1.15] font-extrabold tracking-tight sm:text-[44px]">A place to
                        show off the PC you built — and to plan the next one.</h1>
                    <p className="mt-4 text-[17px] leading-[1.7] text-ink-muted">
                        RigForge is a community catalog of real builds. Every rig lists its parts and price, so you can
                        see
                        what people actually run for gaming, coding, rendering or a quiet living-room box.
                    </p>
                </section>

                <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
                    <article className="rounded-[14px] border border-line bg-card p-6">
                        <span className="font-mono text-[13px] font-bold text-accent">01</span>
                        <h2 className="mt-2.5 mb-1.5 text-[17px] font-bold">Share your build</h2>
                        <p className="text-sm text-ink-muted">Add a photo, the five core parts, the price and a few
                            words about why you chose them.</p>
                    </article>
                    <article className="rounded-[14px] border border-line bg-card p-6">
                        <span className="font-mono text-[13px] font-bold text-accent">02</span>
                        <h2 className="mt-2.5 mb-1.5 text-[17px] font-bold">Find inspiration</h2>
                        <p className="text-sm text-ink-muted">Filter by purpose, search by CPU or GPU and sort by price
                            or by what the community likes most.</p>
                    </article>
                    <article className="rounded-[14px] border border-line bg-card p-6">
                        <span className="font-mono text-[13px] font-bold text-accent">03</span>
                        <h2 className="mt-2.5 mb-1.5 text-[17px] font-bold">Get feedback</h2>
                        <p className="text-sm text-ink-muted">Like the builds you would copy and leave comments with
                            questions or upgrade ideas.</p>
                    </article>
                </section>

                <section className="mb-12 flex flex-col gap-4">
                    <h2 className="text-lg font-bold tracking-tight">Builds for every purpose</h2>
                    <div className="flex flex-wrap gap-2">
                        <span
                            className="inline-flex h-8 shrink-0 cursor-default items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong hover:bg-accent-hover bg-field text-ink-soft">Gaming</span>
                        <span
                            className="inline-flex h-8 shrink-0 cursor-default items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong hover:bg-accent-hover bg-field text-ink-soft">Development</span>
                        <span
                            className="inline-flex h-8 shrink-0 cursor-default items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong hover:bg-accent-hover bg-field text-ink-soft">Workstation</span>
                        <span
                            className="inline-flex h-8 shrink-0 cursor-default items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong hover:bg-accent-hover bg-field text-ink-soft">Budget</span>
                        <span
                            className="inline-flex h-8 shrink-0 cursor-default items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors border-line-strong hover:bg-accent-hover bg-field text-ink-soft">HTPC</span>
                    </div>
                </section>

                <section
                    className="flex flex-col items-stretch justify-between gap-5 rounded-[14px] border border-line bg-card bg-linear-135 from-accent/10 to-transparent to-70% p-7 text-center sm:flex-row sm:items-center sm:text-left">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Ready to share yours?</h2>
                        <p className="text-ink-muted">It takes about two minutes.</p>
                    </div>
                    <Link className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover"
                       to={protectedRoutes.createBuild}>Post a build</Link>
                </section>
            </div>
        </main>
    );
}
