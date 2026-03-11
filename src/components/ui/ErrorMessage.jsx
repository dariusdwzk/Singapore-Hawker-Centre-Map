function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-4">
      <div className="max-w-md space-y-4 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 shadow-sm">
        <p>{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default ErrorMessage
