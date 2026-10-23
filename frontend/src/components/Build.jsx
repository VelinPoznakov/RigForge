import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";
import {Link, useNavigate} from "react-router";
import useAuth from "../hooks/useAuth.js";
import {mutate} from "../ utils/request.js";

export default function Build(
    {
        id,
        title,
        purpose,
        imageUrl,
        cpu,
        gpu,
        ram,
        priceEur,
        owner,
        likesCount,
        isLikedByCurrentUser,
        createdAt,
        onLike,
        showUser= true
    }){

    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const daysSince = (dateString) => {
        const msPerDay = 1000 * 60 * 60 * 24;

        return Math.floor((Date.now() - new Date(dateString)) / msPerDay);
    }

    const timeAgo = (dateString) => {
        const days = daysSince(dateString);

        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;

        return `${Math.floor(days / 365)} years ago`;
    }

    const onLikeClick = async () => {
        if (!isAuthenticated) {
            navigate(publicRoutes.login);
            return;
        }

        try {
            await mutate(isLikedByCurrentUser ? 'DELETE' : 'POST', `/api/builds/${id}/like`);
            onLike();
        }
        catch {}
    }

    return(
        <article
            className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-card transition hover:-translate-y-0.5 hover:border-line-strong">
            <div
                className="relative aspect-5/2 bg-media bg-linear-135 from-gaming/80 to-transparent to-70%">
                <img className="absolute inset-0 size-full object-cover" src={`${import.meta.env.VITE_API_URL ?? ''}${imageUrl}`} alt={title} />
                <span
                    className="inline-flex h-5.5 items-center rounded border border-white/10 bg-black/70 px-1.75 font-mono text-[10px] tracking-[0.08em] text-[#d9dde3] uppercase absolute top-2.5 left-2.5">{purpose}
                </span>
                <button type="button"
                        onClick={onLikeClick}
                        aria-pressed={isLikedByCurrentUser}
                        aria-label={isLikedByCurrentUser ? 'Unlike' : 'Like'}
                        className="absolute top-2.5 right-2.5 z-10 inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 font-mono text-[11px] text-ink">
                    <svg className={isLikedByCurrentUser ?
                        ("size-2.75 fill-accent stroke-accent")
                        :
                        ("size-2.75 fill-none stroke-ink-muted")} viewBox="0 0 24 24" strokeWidth="2.5"><path
                        d="M12 20.5s-7.5-4.6-9.5-9.1C1 8 3 4.4 6.6 4c2.1-.2 3.9.9 5.4 2.8C13.5 4.9 15.3 3.8 17.4 4 21 4.4 23 8 21.5 11.4 19.5 15.9 12 20.5 12 20.5z"/></svg>{likesCount}
                </button>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="text-base leading-snug font-bold">
                    <Link className="after:absolute after:inset-0" to={publicRoutes.buildDetails(id)}>{title}</Link>
                </h3>
                <dl className="grid grid-cols-[44px_minmax(0,1fr)] gap-y-1 font-mono text-[11.5px] [&_dd]:truncate [&_dd]:text-ink-soft [&_dt]:text-ink-dim">
                    <dt>CPU</dt>
                    <dd>{cpu}</dd>
                    <dt>GPU</dt>
                    <dd>{gpu}</dd>
                    <dt>RAM</dt>
                    <dd>{ram}</dd>
                </dl>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
                    {showUser ?
                        (<Link className="relative z-10 flex min-w-0 items-center gap-2 text-xs text-ink-muted hover:text-ink"
                               to={publicRoutes.userBuilds(owner.id)}>
                                    <span
                                        className="grid shrink-0 place-items-center rounded-full border border-line-strong bg-avatar font-semibold text-ink-soft uppercase size-5 text-[9px]">{owner.username[0]}</span>
                            <span className="truncate">{owner.username}</span>
                            <span className="whitespace-nowrap text-ink-dim">· {timeAgo(createdAt)}</span>
                        </Link>)
                        :
                        (<span className="whitespace-nowrap text-ink-dim">{timeAgo(createdAt)}</span>)
                    }
                    <span
                        className="font-mono text-[15px] font-bold whitespace-nowrap text-accent">{priceEur}<span
                        className="ml-0.5 text-[10px] font-medium text-ink-dim">€</span></span>
                </div>
            </div>
        </article>
    );
}