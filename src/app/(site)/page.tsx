import { Collection } from "@/components/site/Collection";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Spotlight } from "@/components/site/Spotlight";
import { WaitlistBand } from "@/components/site/WaitlistBand";
import { WhySection } from "@/components/site/WhySection";
import { getProducts } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  const heroProducts = featured.length > 0 ? featured : products;

  return (
    <>
      <Hero products={heroProducts} />
      <Marquee />
      <Spotlight products={featured.length > 0 ? featured : products.slice(0, 4)} />
      <Collection products={products} />
      <WhySection product={products.find((p) => !p.featured && p.availability === "available") ?? products[0]} />
      <WaitlistBand products={products} />
    </>
  );
}
