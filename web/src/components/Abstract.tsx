import { cn } from "@/lib/cn";

type Keyword = { term: string; lang?: string };

const KEYWORDS: Keyword[] = [
  { term: "Acedia" },
  { term: "Sự Khô Khan Tâm Linh" },
  { term: "Đêm Tối Tâm Hồn" },
  { term: "Dark Night of the Soul", lang: "en" },
  { term: "Tu đức học" },
  { term: "Burnout / Kiệt sức" },
  { term: "Giáo phụ Sa mạc" },
  { term: "Linh đạo I-nhã" },
];

export function Abstract({ readingMinutes }: { readingMinutes: number }) {
  return (
    <aside
      aria-label="Tóm tắt bài viết"
      className={cn(
        "not-prose my-6 rounded-xl border border-amber-600/30 bg-amber-50/60 px-5 py-5",
        "dark:border-amber-700/30 dark:bg-amber-900/10",
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <span
          className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Tóm tắt (Abstract)
        </span>
        <span
          className="whitespace-nowrap text-[11px] text-slate-500 dark:text-stone-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          ⏱ Đọc khoảng {readingMinutes} phút
        </span>
      </div>

      {/* Abstract text */}
      <p
        className="text-sm leading-relaxed text-slate-700 dark:text-stone-300"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Báo cáo trình bày một khảo sát chuyên sâu về cách thức các vị thánh Công giáo từ thế kỷ
        thứ IV đến thế kỷ XX đã nhận diện, phân loại và vượt qua các sắc thái khác nhau của sự
        buồn chán tâm linh. Nghiên cứu phân định ba hiện tượng thường bị nhầm lẫn:{" "}
        <em>acedia</em> (sự buồn sầu trước thiện hảo thiêng liêng),{" "}
        <em>sự khô khan tâm linh</em> (spiritual dryness), và <em>Đêm Tối Tâm Hồn</em> (Dark
        Night of the Soul). Thông qua phân tích di sản của các Giáo phụ Sa mạc, Thánh Tôma
        Aquinô, Thánh I-nhã Loyola, Thánh Têrêsa Lisieux, Thánh Gioan Thánh Giá, Mẹ Têrêsa
        Calcutta và Đức Hồng Y Phanxicô Xaviê Nguyễn Văn Thuận, bài viết cung cấp những phương
        pháp đối phó thực tiễn có thể ứng dụng cho hội chứng kiệt sức (burnout) và khủng hoảng
        ý nghĩa trong xã hội đương đại.
      </p>

      {/* Keywords */}
      <div className="mt-4">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Từ khoá:{" "}
        </span>
        <span className="text-[11px] leading-relaxed text-slate-600 dark:text-stone-400">
          {KEYWORDS.map((kw, i) => (
            <span key={kw.term}>
              {i > 0 && <span className="mx-1 text-slate-300 dark:text-stone-600">·</span>}
              <span className={kw.lang === "en" ? "italic" : ""}>{kw.term}</span>
            </span>
          ))}
        </span>
      </div>
    </aside>
  );
}
