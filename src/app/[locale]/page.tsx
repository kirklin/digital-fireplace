import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import DigitalFireplace from "~/components/digital-fireplace";
import { ModeToggle } from "~/components/theme-toggle";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background dark:bg-black">
      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      {/* 数字壁炉 */}
      <DigitalFireplace />
    </main>
  );
}
