export default function Pagination({
    totalPages,
    page,
    setPage
}){

    const goToPage = (newPage) => {
        setPage(newPage);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return(
      <>
          {totalPages > 1 && (
              <nav className="mt-10 flex flex-wrap justify-center gap-1.5" aria-label="Pages">
                  <button type="button"
                          onClick={() => goToPage(page - 1)}
                          disabled={page === 1}
                          className="inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong disabled:pointer-events-none disabled:opacity-40">
                      ‹ Prev
                  </button>

                  {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNumber =>
                      <button type="button"
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              aria-current={pageNumber === page ? 'page' : undefined}
                              className={`inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-2.5 font-mono text-[13px] ${
                                  pageNumber === page
                                      ? 'border-accent bg-accent/10 text-accent'
                                      : 'border-line bg-card text-ink-soft hover:border-line-strong'}`}>
                          {pageNumber}
                      </button>
                  )}

                  <button type="button"
                          onClick={() => goToPage(page + 1)}
                          disabled={page >= totalPages}
                          className="inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-2.5 font-mono text-[13px] border-line bg-card text-ink-soft hover:border-line-strong disabled:pointer-events-none disabled:opacity-40">
                      Next ›
                  </button>
              </nav>
          )}
      </>
    );
}