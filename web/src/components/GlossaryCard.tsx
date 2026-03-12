import { cn } from "@/lib/cn";

type GlossaryEntry = { term: string; definition: string; source?: string };

const GLOSSARY: GlossaryEntry[] = [
  {
    term: "Acedia",
    definition:
      "Trạng thái 'buồn sầu trước sự thiện hảo của Thiên Chúa' (sorrow at the divine good); 'ác quỷ trưa' tấn công các tu sĩ sa mạc. Khác với sự lười biếng thông thường, acedia là sự tê liệt ý chí trước lời mời gọi thiêng liêng.",
    source: "Evagrius Pontus; Thánh Tôma Aquinô, Summa Theologica",
  },
  {
    term: "Sự Khô Khan Tâm Linh",
    definition:
      "Giai đoạn cạn kiệt cảm xúc trong cầu nguyện khi cảm thấy Thiên Chúa xa cách; có thể do nguyên nhân tự nhiên (mệt mỏi, căng thẳng) hoặc do Thiên Chúa chủ động 'cai sữa' linh hồn khỏi các an ủi cảm giác.",
    source: "Thang đo Spiritual Dryness Scale (SDS, 2013)",
  },
  {
    term: "Đêm Tối Tâm Hồn",
    definition:
      "Giai đoạn thanh luyện thụ động và sâu sắc do chính Thiên Chúa thực hiện trên những linh hồn đã trưởng thành, chuẩn bị cho sự kết hợp thần hiệp. Không phải trầm cảm lâm sàng, mà là kết quả của ánh sáng thần linh chiếu rọi quá gần.",
    source: "Thánh Gioan Thánh Giá, Noche Oscura del Alma",
  },
  {
    term: "Hypomone",
    definition:
      "Tiếng Hy Lạp: sự kiên tâm bền bỉ, 'ở lại'. Phương thuốc chính của các Giáo phụ Sa mạc chống lại acedia: giữ nguyên vị trí và không chạy trốn khỏi cuộc đối mặt nội tâm.",
    source: "Giáo phụ Sa mạc, thế kỷ IV–V",
  },
  {
    term: "Antirrhetikos",
    definition:
      "Nghệ thuật 'phản biện' tư tưởng tiêu cực bằng cách trích dẫn trực tiếp Lời Chúa để cắt đứt chuỗi suy nghĩ u ám của acedia, theo gương Chúa Giêsu trong hoang địa.",
    source: "Evagrius Pontus, Antirrhetikos",
  },
  {
    term: "Consolation / Desolation",
    definition:
      "Hai trạng thái đối lập trong linh đạo I-nhã: Sự an ủi (Consolation) là sự bình an và gia tăng đức mến; Sự sầu khổ (Desolation) là tối tăm, xao xuyến, cảm giác xa Chúa. Quy tắc I-nhã: không thay đổi quyết định trong lúc sầu khổ.",
    source: "Thánh I-nhã Loyola, Linh Thao",
  },
];

export function GlossaryCard({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Bảng thuật ngữ"
      className={cn(
        "not-prose my-8 rounded-xl border border-slate-200 bg-white shadow-sm",
        "dark:border-stone-700 dark:bg-stone-800/60",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-t-xl border-b border-slate-200 bg-slate-50 px-5 py-3",
          "dark:border-stone-700 dark:bg-stone-800",
        )}
      >
        <h3
          className="text-xs font-bold uppercase tracking-widest text-blue-900 dark:text-blue-300"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Bảng thuật ngữ chính
        </h3>
      </div>
      <dl className="divide-y divide-slate-100 dark:divide-stone-700/60">
        {GLOSSARY.map((entry) => (
          <div key={entry.term} className="px-5 py-3.5">
            <dt
              className="mb-1 text-sm font-semibold text-slate-900 dark:text-stone-100"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {entry.term}
            </dt>
            <dd
              className="text-[13px] leading-relaxed text-slate-600 dark:text-stone-400"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {entry.definition}
              {entry.source && (
                <span className="mt-0.5 block text-[11px] italic text-slate-400 dark:text-stone-500">
                  Nguồn: {entry.source}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
