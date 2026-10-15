import {Link} from "react-router";
import {protectedRoutes, publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function Navbar({ isOpen }){

    const user = {
        userId: 'user id',
        username: 'test'
    }

    return(
        <nav
            id="main-nav"
            aria-label="Main"
            className={`${isOpen ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-4 border-b border-line bg-surface p-4 md:static md:flex md:flex-1 md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}>
            <ul className="flex flex-col gap-1 md:flex-1 md:flex-row md:justify-center md:gap-7">
                <li><Link
                    className="rounded-md px-2 py-2.5 text-[13px] transition-colors md:px-0 md:py-1.5 text-accent"
                    to={publicRoutes.home}>Catalog</Link></li>

                {user && (
                    <li>
                        <Link
                            className="rounded-md px-2 py-2.5 text-[13px] transition-colors md:px-0 md:py-1.5 text-ink-muted hover:bg-field hover:text-ink md:hover:bg-transparent"
                            to={protectedRoutes.profile}>My builds
                        </Link>
                    </li>
                )}

                <li><Link
                    className="rounded-md px-2 py-2.5 text-[13px] transition-colors md:px-0 md:py-1.5 text-ink-muted hover:bg-field hover:text-ink md:hover:bg-transparent"
                    to={publicRoutes.about}>About</Link></li>
            </ul>
            <div
                className="flex items-center justify-between gap-3 border-t border-line pt-4 md:border-0 md:pt-0">
                <Link className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover"
                   to={protectedRoutes.createBuild}>
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Post a build
                </Link>
                <Link className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-8 text-xs"
                   to={protectedRoutes.profile} title="My profile">v</Link>
            </div>
        </nav>
    )
}