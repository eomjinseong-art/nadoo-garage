"use client";

import { useEffect, useState } from "react";
import { ABACUS_KEY, ABACUS_NAMESPACE, ABACUS_STORAGE_KEY, PROD_HOSTS } from "@/lib/site";

/** 테스트 방문(자동화 브라우저, 봇, 미리보기 주소)은 집계하지 않고 값만 읽습니다. */
function isTestTraffic() {
  if (typeof window === "undefined") return true;
  if (navigator.webdriver) return true;
  if (/headless|bot|crawler|spider|lighthouse/i.test(navigator.userAgent)) return true;
  return !PROD_HOSTS.includes(window.location.hostname);
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    const last = window.localStorage.getItem(ABACUS_STORAGE_KEY);
    const skip = isTestTraffic();
    const mode = last === today || skip ? "get" : "hit";
    fetch(`https://abacus.jasoncameron.dev/${mode}/${ABACUS_NAMESPACE}/${ABACUS_KEY}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { value?: number }) => {
        if (typeof data.value === "number") setCount(data.value);
        if (last !== today && !skip) window.localStorage.setItem(ABACUS_STORAGE_KEY, today);
      })
      .catch(() => {
        /* counter is decorative */
      });
  }, []);

  return (
    <span
      className="inline-flex items-center gap-1 text-sm text-muted tabular-nums"
      title="하루 한 번 집계되는 방문 수"
      aria-label={count == null ? "방문 수" : `방문 ${count.toLocaleString("ko-KR")}`}
      data-visitor-counter={ABACUS_NAMESPACE}
    >
      <span aria-hidden="true">👁</span>
      <span>{count == null ? "—" : count.toLocaleString("ko-KR")}</span>
    </span>
  );
}
