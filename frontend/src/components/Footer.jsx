import { Link } from 'react-router'
import { publicRoutes, protectedRoutes } from "../ utils/ApplicationUrlPaths.js";

export default function Footer(){

    const user = {
        userId: 'user id',
        username: 'test'
    }

    return (
        <footer className="border-t border-line bg-surface">
            <div
                className="mx-auto w-full max-w-site px-4 sm:px-6 grid grid-cols-2 gap-8 py-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
                <div className="col-span-2 md:col-span-1">
                    <Link className="flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.14em]"
                       to={publicRoutes.home}>
                        <span className="size-3 rounded-xs bg-accent"></span>RIGFORGE
                    </Link>
                    <p className="mt-3 max-w-75 text-sm text-ink-muted">A community catalog of real PC builds.
                        Share yours, find inspiration and get feedback.</p>
                </div>

                <nav>
                    <h2 className="mb-3 font-mono text-[11px] tracking-widest text-ink-dim uppercase">Explore</h2>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><Link className="text-ink-muted transition-colors hover:text-ink"
                               to={publicRoutes.home}>Catalog</Link></li>
                        <li><Link className="text-ink-muted transition-colors hover:text-ink"
                               to={publicRoutes.about}>About</Link></li>
                    </ul>
                </nav>


                {user ?
                    (<nav>
                        <h2 className="mb-3 font-mono text-[11px] tracking-widest text-ink-dim uppercase">Builds</h2>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link className="text-ink-muted transition-colors hover:text-ink"
                                   to={protectedRoutes.createBuild}>Post a build</Link></li>
                            <li><Link className="text-ink-muted transition-colors hover:text-ink"
                                   to={protectedRoutes.profile}>My builds</Link></li>
                        </ul>
                    </nav>)
                    :
                    (<nav>
                        <h2 className="mb-3 font-mono text-[11px] tracking-widest text-ink-dim uppercase">Account</h2>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link className="text-ink-muted transition-colors hover:text-ink" to={publicRoutes.login}>Log
                                in</Link></li>
                            <li><Link className="text-ink-muted transition-colors hover:text-ink"
                                   to={publicRoutes.register}>Register</Link></li>
                        </ul>
                    </nav>)
                }
            </div>

            <div className="border-t border-line">
                <div
                    className="mx-auto w-full max-w-site px-4 sm:px-6 flex flex-col gap-1 py-5 text-xs text-ink-dim sm:flex-row sm:justify-between">
                    <p>© 2026 RigForge</p>
                    <p>All prices are in euro (€)</p>
                </div>
            </div>
        </footer>
    );
}