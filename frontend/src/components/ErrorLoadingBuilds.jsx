export default function ErrorLoadingBuilds({
    isLoading,
    errors
}){

    return(
      <>
          {!isLoading && errors && (
              <div
                  className="rounded-[14px] border border-dashed border-danger/35 bg-danger/10 px-6 py-14 text-center text-[#ff8a87]"
                  role="alert">
                  <h3 className="mb-1.5 text-base font-semibold text-ink">Could not load builds</h3>
                  <p>
                      {errors.isInternalError
                          ? 'Could not reach the server. Check your connection and try again.'
                          : errors.general ?? Object.values(errors.messages)[0] ?? 'Something went wrong. Try again.'}
                  </p>
                  <button type="button"
                          onClick={() => window.location.reload()}
                          className="inline-flex h-9.5 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold whitespace-nowrap transition-colors border border-line-strong bg-field text-ink hover:border-ink-dim mt-5">
                      Try again
                  </button>
              </div>
          )}
      </>
    );
}