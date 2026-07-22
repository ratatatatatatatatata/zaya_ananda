import { AnandaCinematic } from "@/components/AnandaCinematic";
import { HomeSections } from "@/components/HomeSections";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <AnandaCinematic />
      <HomeSections />
    </>
  );
}
