import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { TableOfContents } from "@/components/TableOfContents";
import { ComparisonTable } from "@/components/ComparisonTable";
import { References } from "@/components/References";
import { ReportSection } from "@/components/ReportSection";
import { RichText } from "@/components/RichText";
import { Abstract } from "@/components/Abstract";
import { PullQuote } from "@/components/PullQuote";
import { GlossaryCard } from "@/components/GlossaryCard";
import { BackToTop } from "@/components/BackToTop";
import { ArticleWrapper } from "@/components/ArticleWrapper";
import { getReportData, estimateReadingMinutes } from "@/data/report";

// Pull quotes placed after specific section IDs
const PULL_QUOTES: Record<string, { quote: string; attribution: string }> = {
  "giao-phu-sa-mac-cuoc-chien-khoc-liet-voi-ac-quy-trua-qua-su-kien-tam": {
    quote: "Hãy ở lại trong phòng của bạn, và căn phòng sẽ dạy bạn mọi điều.",
    attribution: "Lời khuyên của các Giáo phụ Sa mạc, thế kỷ IV",
  },
  "thanh-toma-aquino-lieu-phap-tam-ly-the-ly-tich-hop-chua-lanh-noi-buon": {
    quote: "Khi con người bị kẹt trong sự buồn chán, một niềm vui hợp pháp, dù là nhỏ bé, đều có khả năng mở rộng tâm hồn đang bị nỗi buồn bóp nghẹt.",
    attribution: "Thánh Tôma Aquinô, Summa Theologica I-II, q.38",
  },
  "chuyen-hoa-su-te-nhat-thuong-nhat-con-duong-nho-cua-thanh-teresa-lisieux": {
    quote: "Không có gì là nhỏ bé trong mắt Thiên Chúa nếu được làm với tình yêu.",
    attribution: "Thánh Têrêsa Lisieux, Story of a Soul",
  },
  "chien-thang-nghich-canh-tu-day-va-su-lap-lai-duc-hong-y-phanxico-xavier-nguyen-van-thuan": {
    quote: "Tôi sẽ không chờ đợi. Tôi sẽ sống phút hiện tại và làm cho nó đầy tình thương.",
    attribution: "Đức Hồng Y Phanxicô Xaviê Nguyễn Văn Thuận",
  },
};

// Which H2 sections get a Roman numeral (major content sections, not references)
const NUMBERED_SECTION_IDS = new Set([
  "dan-nhap-hien-tuong-buon-chan-duoi-goc-nhin-hien-sinh-va-than-hoc-tu-duc",
  "phan-dinh-khai-niem-su-buon-chan-tam-linh-su-kho-khan-va-dem-toi-tam-hon",
  "giao-phu-sa-mac-cuoc-chien-khoc-liet-voi-ac-quy-trua-qua-su-kien-tam",
  "thanh-toma-aquino-lieu-phap-tam-ly-the-ly-tich-hop-chua-lanh-noi-buon",
  "buoc-ngoan-tu-su-chan-nan-tot-do-kinh-nghiem-hoan-cai-cua-thanh-i-nha-loyola",
  "chuyen-hoa-su-te-nhat-thuong-nhat-con-duong-nho-cua-thanh-teresa-lisieux",
  "buoc-vao-chon-rong-tuech-hai-hung-kinh-nghiem-dem-toi-tam-hon",
  "chien-thang-nghich-canh-tu-day-va-su-lap-lai-duc-hong-y-phanxico-xavier-nguyen-van-thuan",
  "ung-dung-hien-dai-giai-phau-va-dieu-tri-hoi-chung-buon-chan-tam-linh-ky-nguyen-moi",
  "ket-luan",
]);

export default async function Home() {
  const report = await getReportData();
  const readingMinutes = estimateReadingMinutes(report.sections);

  // Assign sequential numbers only to major sections
  let sectionCounter = 0;
  const sectionNumbers: Record<string, number> = {};
  for (const sec of report.sections) {
    if (sec.level === 2 && NUMBERED_SECTION_IDS.has(sec.id)) {
      sectionNumbers[sec.id] = ++sectionCounter;
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 dark:bg-[#1c1917] dark:text-stone-100">
      <ProgressBar />
      <div className="sticky top-0 z-40 print-hide">
        <Header title={report.title} />
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pt-10">
        <div className="lg:flex lg:items-start lg:gap-10">

          {/* Desktop sticky sidebar */}
          <aside className="hidden w-[260px] shrink-0 lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-auto print-hide">
            <TableOfContents rootId="report-root" />
          </aside>

          {/* Mobile floating ToC */}
          <div className="lg:hidden print-hide">
            <TableOfContents rootId="report-root" />
          </div>

          {/* Main article */}
          <ArticleWrapper references={report.references}>
            <article
              id="report-root"
              className="prose prose-slate w-full max-w-3xl dark:prose-invert"
            >
              {/* ── Masthead ──────────────────────────────────────────── */}
              <header className="not-prose mb-6 sm:mb-8">
                <div
                  className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Báo cáo nghiên cứu chuyên sâu
                </div>
                <h1
                  className="mt-1.5 text-[1.45rem] font-bold leading-snug tracking-tight text-slate-900 dark:text-stone-50 sm:mt-2 sm:text-3xl md:text-4xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {report.title}
                </h1>
                <div
                  className="mt-2 text-[11px] text-slate-500 dark:text-stone-500 sm:text-xs"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="mt-4 h-px bg-gradient-to-r from-amber-600/60 via-amber-600/20 to-transparent" />
              </header>

              {/* ── Abstract ──────────────────────────────────────────── */}
              <Abstract readingMinutes={readingMinutes} />

              {/* ── Glossary ──────────────────────────────────────────── */}
              <GlossaryCard />

              {/* ── Sections ──────────────────────────────────────────── */}
              {report.sections.map((section) => (
                <div key={section.id}>
                  <ReportSection
                    as={section.level === 2 ? "h2" : "h3"}
                    id={section.id}
                    title={section.title}
                    sectionNumber={sectionNumbers[section.id]}
                  >
                    {section.blocks.map((block, idx) => {
                      if (block.type === "spacer") {
                        return <div key={`${section.id}-sp-${idx}`} className="h-1.5" />;
                      }
                      if (block.type === "table") {
                        return (
                          <ComparisonTable
                            key={`${section.id}-tb-${block.table.id}`}
                            table={block.table}
                          />
                        );
                      }
                      return (
                        <p key={`${section.id}-p-${idx}`} className="text-justify">
                          <RichText text={block.text} />
                        </p>
                      );
                    })}
                  </ReportSection>

                  {/* Pull quote after selected sections */}
                  {PULL_QUOTES[section.id] && (
                    <PullQuote
                      quote={PULL_QUOTES[section.id]!.quote}
                      attribution={PULL_QUOTES[section.id]!.attribution}
                    />
                  )}
                </div>
              ))}

              {/* ── Appendix ──────────────────────────────────────────── */}
              <ReportSection
                as="h2"
                id="phu-luc-so-lieu-hien-dai"
                title="Phụ lục: Một số số liệu hiện đại"
              >
                <p className="text-justify">
                  Các nghiên cứu gần đây cho thấy những gì các thánh đã kinh nghiệm không chỉ là
                  chuyện của quá khứ. Một khảo sát trên 3.824 linh mục Công giáo sử dụng Thang đo
                  Sự Khô Khan Tâm Linh (Spiritual Dryness Scale) cho thấy khoảng 46% linh mục
                  thỉnh thoảng trải nghiệm tình trạng khô khan, và khoảng 12% trải nghiệm nó
                  thường xuyên hoặc rất thường xuyên. Những yếu tố dự báo mạnh mẽ nhất bao gồm
                  cảm thức yếu về sự hiện diện siêu việt của Thiên Chúa, cảm giác kiệt sức cảm
                  xúc và các triệu chứng trầm cảm.
                </p>
                <p className="text-justify">
                  Một báo cáo tại Pháp năm 2020 về tình trạng sức khỏe của 6.313 linh mục (khoảng
                  42% tổng số linh mục tại nước này) ghi nhận tỷ lệ burnout lâm sàng khoảng 2%,
                  nhưng đồng thời cho thấy một tỉ lệ đáng kể các trường hợp kết hợp giữa trầm
                  cảm và căng thẳng do công việc mục vụ. Trung bình, các linh mục làm việc khoảng
                  9,4 giờ mỗi ngày, hơn một nửa sống một mình, và nhiều người mô tả cảm giác quá
                  tải, cô đơn và thiếu nâng đỡ. Những số liệu này xác nhận rằng acedia, sự khô
                  khan và đêm tối tâm hồn không chỉ là khái niệm tu đức cổ điển, mà còn gắn liền
                  với các thách đố tâm lý và xã hội rất cụ thể của mục vụ đương đại.
                </p>
              </ReportSection>

              {/* ── References ────────────────────────────────────────── */}
              <References items={report.references} />
            </article>
          </ArticleWrapper>
        </div>
      </main>

      <BackToTop />
    </div>
  );
}
