import { getSkus } from "@/lib/catalog";
import Catalogue from "@/components/home/Catalogue";

export default function Page() {
  return <Catalogue items={getSkus()} />;
}
