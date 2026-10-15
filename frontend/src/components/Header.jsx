import { useState } from "react";
import Navbar from "./Navbar.jsx";
import {Link} from "react-router";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function Header(){

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-surface">
            <div className="mx-auto w-full max-w-site px-4 sm:px-6 flex h-16 items-center gap-6">
                <Link className="flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.14em]"
                   to={publicRoutes.home}>
                    <span className="size-3 rounded-xs bg-accent"></span>RIGFORGE
                </Link>

                <button type="button"
                        className="ml-auto grid size-10 place-items-center rounded-md border border-line-strong md:hidden"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        aria-controls="main-nav"
                        onClick={() => setMenuOpen(!menuOpen)}>
                    <svg className="size-5 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7h16M4 12h16M4 17h16"/>
                    </svg>
                </button>

                <Navbar isOpen={menuOpen} />

            </div>
        </header>

    )
}