"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILES = [
  { name: "Alex", initial: "A", color: "bg-[#E50914]" },
  { name: "Sam", initial: "S", color: "bg-[#0071EB]" },
  { name: "Jordan", initial: "J", color: "bg-[#46D369]" },
  { name: "Kids", initial: "K", color: "bg-[#808080]" },
] as const;

function ProfileAvatar({
  name,
  initial,
  color,
  onClick,
}: {
  name: string;
  initial: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[84px] flex-col items-center gap-2 sm:w-[112px] sm:gap-3 md:w-[132px]"
    >
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-md border-4 border-transparent text-4xl font-medium text-white transition-colors group-hover:border-white sm:text-5xl",
          color
        )}
      >
        {initial}
      </div>
      <span className="max-w-full truncate text-sm text-white/60 sm:text-base md:text-lg">
        {name}
      </span>
    </button>
  );
}

function ManageProfilesButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/manage-profiles")}
      className="group flex w-[84px] flex-col items-center gap-2 sm:w-[112px] sm:gap-3 md:w-[132px]"
    >
      <div className="flex aspect-square w-full items-center justify-center rounded-md border-4 border-transparent bg-[#808080] text-white transition-colors group-hover:border-white">
        <Pencil className="size-8 sm:size-10" strokeWidth={1.5} />
      </div>
      <span className="text-center text-sm text-white/60 sm:text-base md:text-lg">
        Manage Profiles
      </span>
    </button>
  );
}

export default function ProfilesPage() {
  const router = useRouter();

  function selectProfile(name: string) {
    router.push(`/home?profile=${encodeURIComponent(name)}`);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-4 py-16 text-white">
      <h1 className="mb-8 text-center text-3xl font-normal sm:mb-10 sm:text-4xl md:text-5xl">
        Who&apos;s watching?
      </h1>

      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8">
        {PROFILES.map((profile) => (
          <ProfileAvatar
            key={profile.name}
            name={profile.name}
            initial={profile.initial}
            color={profile.color}
            onClick={() => selectProfile(profile.name)}
          />
        ))}
        <ManageProfilesButton />
      </div>
    </div>
  );
}
