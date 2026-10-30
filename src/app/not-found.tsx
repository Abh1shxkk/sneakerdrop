import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-cocoa px-6 text-center text-cream">
      <div>
        <p className="font-display text-[clamp(7rem,25vw,16rem)] font-bold leading-[0.8]">404</p>
        <h1 className="headline mt-6 text-4xl">This pair walked off.</h1>
        <p className="mt-2 text-cream/75">The page you&apos;re looking for doesn&apos;t exist or was removed.</p>
        <LinkButton href="/" variant="cream" arrow className="mt-8">
          Back to the drop
        </LinkButton>
      </div>
    </main>
  );
}
