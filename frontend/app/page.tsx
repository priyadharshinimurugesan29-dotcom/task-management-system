"use client";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-10">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl font-bold text-white">
            A
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#1f1f1f]">
            Let&apos;s get back on track
          </h1>

          <p className="mt-3 text-sm text-[#777]">
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Login buttons */}
        <div className="space-y-3">

          <button
            type="button"
            onClick={() => {
              window.location.href = "/tasks";
            }}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1f1f1f] text-sm font-medium text-white transition hover:bg-black"
          >
            Continue as Guest
        </button>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#deded8] bg-white text-sm font-medium text-[#333] transition hover:bg-[#f5f5f2]"
          >
            <span className="text-base font-semibold">G</span>
            Continue with Google
          </button>

        </div>

        {/* Terms */}
        <p className="mx-auto mt-8 max-w-sm text-xs leading-5 text-[#888]">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>

      </div>
    </main>
  );
}