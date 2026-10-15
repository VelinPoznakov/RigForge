import {Link} from "react-router";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function NotFound(){

    return(
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
            <p className="font-mono text-[72px] leading-none font-bold text-accent sm:text-[112px]">404</p>
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="mb-3 max-w-95 text-ink-muted">The page you are looking for doesn't exist or was removed.</p>
            <Link replace={true} className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors bg-accent text-on-accent hover:bg-accent-hover"
               to={publicRoutes.home}>Back to catalog</Link>
        </main>
    );
}