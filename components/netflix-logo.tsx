import Link from "next/link";

const LETTER_SCALES = [1, 0.93, 0.87, 0.84, 0.84, 0.87, 0.93];

type NetflixLogoProps = {
  className?: string;
  href?: string;
};

export function NetflixLogo({
  className = "text-[2.25rem] sm:text-[2.75rem] md:text-[3rem]",
  href = "/",
}: NetflixLogoProps) {
  return (
    <Link
      href={href}
      aria-label="Netflix"
      className={`font-logo inline-flex select-none items-start leading-none tracking-[0.02em] text-[#E50914] ${className}`}
    >
      {"NETFLIX".split("").map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="inline-block origin-top"
          style={{ transform: `scaleY(${LETTER_SCALES[i]})` }}
        >
          {letter}
        </span>
      ))}
    </Link>
  );
}
