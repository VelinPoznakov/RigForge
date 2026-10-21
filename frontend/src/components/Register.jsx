import {Link} from "react-router";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function Register(){

    return(
        // Submit: POST /api/auth/register { email, username, password, confirmPassword }
        <main className="grid flex-1 place-items-center bg-[radial-gradient(ellipse_at_top,rgba(236,122,58,0.08),transparent_60%)] px-4 py-10 max-sm:items-start max-sm:pt-7">
            <div className="w-full max-w-105 rounded-[14px] border border-line bg-card px-5 py-6 sm:p-8">
                <div className="mb-6 text-center">
                    <span className="mb-3.5 inline-block size-3.5 rounded-[3px] bg-accent"></span>
                    <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                    <p className="mt-1 text-sm text-ink-muted">Share your builds with the RigForge community.</p>
                </div>

                <form className="flex flex-col gap-4">
                    {/* 409: "That email is already registered." / "That username is already taken." */}
                    <div className="rounded-md border border-danger/35 bg-danger/10 px-3.5 py-2.5 text-sm text-[#ff8a87]" hidden>That username is already taken.</div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" for="email">Email</label>
                        <input className="w-full rounded-md border border-line-strong bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none" id="email" name="email" type="email" autocomplete="email" maxlength="120" placeholder="you@example.com" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" for="username">Username</label>
                        <input className="w-full rounded-md border border-line-strong bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none" id="username" name="username" autocomplete="username" maxlength="20" placeholder="rigbuilder" />
                        <span className="text-xs text-ink-dim">3–20 characters: letters, digits, . _ -</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" for="password">Password</label>
                        <input className="w-full rounded-md border border-line-strong bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:border-accent focus:ring-3 focus:ring-accent/15 focus:outline-none" id="password" name="password" type="password" autocomplete="new-password" />
                        <span className="text-xs text-ink-dim">At least 6 characters, including a number.</span>
                    </div>

                    {/* example of a field with a validation error */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-ink-soft" for="confirmPassword">Confirm password</label>
                        <input className="w-full rounded-md border border-danger bg-field px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-dim focus:ring-3 focus:ring-danger/15 focus:outline-none" id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" />
                        <span className="text-xs text-danger">Passwords do not match.</span>
                    </div>

                    <button type="submit" className="inline-flex h-10.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover mt-1 w-full">Create account</button>
                </form>

                <p className="mt-5 text-center text-sm text-ink-muted">Already have an account? <Link className="font-semibold text-accent" to={publicRoutes.login}>Log in</Link></p>
            </div>
        </main>
    );
}
