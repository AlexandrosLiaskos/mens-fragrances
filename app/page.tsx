import { getSkus, asset } from "@/lib/catalog";
import Catalogue from "@/components/home/Catalogue";

export default function Page() {
  return <Catalogue items={getSkus()} signature={asset("/signature-gold.png")} />;
}
