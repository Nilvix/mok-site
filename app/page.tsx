import { VenuePage } from "@/components/VenuePage";

// Контент из админки появляется на сайте не позже чем через 5 минут (или сразу после сохранения)
export const revalidate = 300;

export default function Page() {
  return <VenuePage id="220" />;
}
