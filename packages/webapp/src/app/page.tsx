import Link from "next/link";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">Starbeam</h1>
        
        <div className="flex flex-col gap-4 items-center">
          <Link href={'/mini-app'} className="px-4 py-2 bg-white rounded-md text-black">
            Launch In Telegram
          </Link>
        </div>
      </main>
    </div>
  );
}
