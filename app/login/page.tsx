"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NetflixLogo } from "@/components/netflix-logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    router.push("/profiles");
  }

  const inputClassName =
    "h-12 rounded border border-white/40 bg-[#333]/70 px-4 text-base text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-white/20 md:text-base";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[450px] rounded-md bg-black/75 px-8 py-12 sm:px-16 sm:py-14"
    >
      <h1 className="mb-7 text-3xl font-bold text-white">Sign In</h1>

      <div className="flex flex-col gap-4">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Email or phone number"
          autoComplete="email"
          className={inputClassName}
        />
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          placeholder="Password"
          autoComplete="current-password"
          className={inputClassName}
        />

        {error ? (
          <p className="text-sm text-[#E87C03]" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded bg-[#E50914] text-base font-medium text-white hover:bg-[#c11119]"
        >
          Sign In
        </Button>
      </div>

      <p className="mt-10 text-base text-white/55">
        New to Netflix?{" "}
        <span className="font-medium text-white hover:underline">
          Sign up now
        </span>
      </p>

      <p className="mt-4 text-xs leading-relaxed text-white/40">
        This page is protected by Google reCAPTCHA to ensure you&apos;re not a
        bot.{" "}
        <span className="text-blue-500 hover:underline">Learn more.</span>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* Same background treatment as landing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(105deg, rgba(0,0,0,0.55) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(0,0,0,0.75) 70%, #000 100%),
            repeating-linear-gradient(
              -12deg,
              #1a1a1a 0px,
              #1a1a1a 90px,
              #111 90px,
              #111 180px,
              #222 180px,
              #222 270px,
              #0d0d0d 270px,
              #0d0d0d 360px
            )
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"
      />

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-5 sm:px-8 md:px-12">
          <NetflixLogo />
        </div>
      </header>

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-24">
        <Suspense
          fallback={
            <div className="h-80 w-full max-w-[450px] rounded-md bg-black/75" />
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
