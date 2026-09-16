import Link from "next/link";

export default function ManageProfilesPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-black px-4 text-white">
      <h1 className="text-2xl font-medium sm:text-3xl">Manage Profiles</h1>
      <p className="max-w-md text-center text-white/60">
        Profile management is not implemented yet.
      </p>
      <Link
        href="/profiles"
        className="rounded bg-[#E50914] px-6 py-2.5 text-sm font-medium hover:bg-[#c11119]"
      >
        Back to profiles
      </Link>
    </div>
  );
}
