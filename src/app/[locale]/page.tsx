import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import DigitalFireplace from "~/components/digital-fireplace";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 数字壁炉 */}
      <DigitalFireplace />
    </main>
  );
}
