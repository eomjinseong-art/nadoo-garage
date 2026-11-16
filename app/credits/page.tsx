import Link from "next/link";
import { getImage, hrefFor, vehicles } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "사진 크레딧",
  description: "나두카&모터사이클에 쓴 사진의 출처와 라이선스. 공개 사진은 퍼블릭 도메인, CC0, CC BY, CC BY-SA만 사용합니다.",
  path: "/credits",
});

export default function CreditsPage() {
  const rows = vehicles.map((v) => ({ v, image: getImage(v.slug) }));
  const missing = rows.filter((r) => !r.image);
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-xs tracking-[0.2em] text-accent uppercase">Credits</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">사진 크레딧</h1>
        <p className="mt-4 leading-relaxed text-muted">
          사진은 위키미디어 공용과 Flickr에서 가져왔고, 라이선스가 퍼블릭 도메인, CC0, CC BY, CC BY-SA인 파일만 실었습니다. 화면에 맞게 크기만
          줄였습니다. ‘운영자 제공’으로 표시한 사진을 빼면 운영자의 실제 차량이 아니라 같은 모델의 공개 사진이며, 색상이나 세부 사양이 다른
          경우 각 항목에 적어 두었습니다.
        </p>
        <p className="mt-3 text-sm text-muted">
          사진 {rows.length - missing.length}장 · 그래픽 대체 {missing.length}건
          {missing.length ? ` (${missing.map((r) => r.v.nameKo).join(", ")})` : ""}
        </p>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-3 font-medium">항목</th>
              <th className="px-4 py-3 font-medium">작가</th>
              <th className="px-4 py-3 font-medium">라이선스</th>
              <th className="px-4 py-3 font-medium">파일</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ v, image }) => (
              <tr key={v.slug} className="border-t border-line align-top">
                <td className="px-4 py-3">
                  <Link href={hrefFor(v)} className="hover:text-accent">{v.nameKo}</Link>
                  {v.imageNote ? <span className="mt-1 block text-xs text-muted">{v.imageNote}</span> : null}
                </td>
                <td className="px-4 py-3 text-muted">{image ? image.author : "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {image ? (
                    image.licenseUrl ? (
                      <a href={image.licenseUrl} className="underline underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
                        {image.license}
                      </a>
                    ) : (
                      image.license
                    )
                  ) : (
                    "그래픽 대체"
                  )}
                </td>
                <td className="px-4 py-3">
                  {image && !image.page ? (
                    <span className="text-muted">{image.file}</span>
                  ) : image ? (
                    <a href={image.page} className="underline underline-offset-2 hover:text-accent" target="_blank" rel="noopener noreferrer">
                      {image.file}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
