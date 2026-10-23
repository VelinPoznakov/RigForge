import Build from "./Build.jsx";

export default function BuildCollection({builds, onLike, showUser= true}) {
    return(
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {builds.map(build => <Build {...build} key={build.id} onLike={onLike} showUser={showUser}/>)}
        </section>
    );
}