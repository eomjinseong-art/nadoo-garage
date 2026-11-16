import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-5xl">404</p>
      <p className="mt-4 text-muted">이 자리는 비어 있는 주차 칸이에요.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-accent px-4 py-2 text-sm text-on-accent">차고로 돌아가기</Link>
    </main>
  );
}
