function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4]">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-amber-500" />
        Loading hawker centres...
      </div>
    </div>
  )
}

export default LoadingSpinner
