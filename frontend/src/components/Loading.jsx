export default function Spinner() {

    return (
        <div className="grid flex-1 place-items-center py-20" role="status" aria-label="Loading">
            <span className="size-10 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
        </div>
    );
}