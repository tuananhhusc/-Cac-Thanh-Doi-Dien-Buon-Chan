import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

export type TocLevel = 2 | 3;

export type ReportBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; table: TableData }
  | { type: "spacer" };

export type ReportSection = {
  id: string;
  level: TocLevel;
  title: string;
  blocks: ReportBlock[];
};

export type TableData = {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
};

export type ReferenceItem = {
  id: number;
  text: string;
  url?: string;
};

export type ReportData = {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  references: ReferenceItem[];
};

function normalizeText(input: string): string {
  // Remove en dash / em dash variants in display, giữ lại khoảng trắng hợp lý.
  return input
    .replace(/[\u2013\u2014]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function slugify(input: string): string {
  return normalizeText(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isBlank(line: string) {
  return line.trim().length === 0;
}

function looksLikeHeading(line: string) {
  if (line.length > 140) return false;
  if (/[.。]$/.test(line.trim())) return false;
  if (line.includes("http")) return false;
  if (/^Bảng\s+\d+:/i.test(line)) return true;
  // Heuristic: title-case-ish and not too long.
  const words = line.trim().split(/\s+/);
  if (words.length < 2 || words.length > 18) return false;
  return /^[A-ZÀ-ỴĐ]/.test(line.trim());
}

function parseTable1(lines: string[], startIdx: number) {
  // Expects:
  // Bảng 1: ...
  // header1
  // header2
  // header3
  // rowTitle
  // col1
  // col2
  // col3
  // ... repeated 3 times ...
  const title = lines[startIdx].trim();
  const headers = [lines[startIdx + 1], lines[startIdx + 2], lines[startIdx + 3]].map((s) =>
    normalizeText(s),
  );
  const rows: string[][] = [];
  let i = startIdx + 4;
  while (i + 3 < lines.length && !isBlank(lines[i])) {
    const rowTitle = normalizeText(lines[i]);
    const c1 = normalizeText(lines[i + 1] ?? "");
    const c2 = normalizeText(lines[i + 2] ?? "");
    const c3 = normalizeText(lines[i + 3] ?? "");
    rows.push([rowTitle, c1, c2, c3]);
    i += 4;
    if (i < lines.length && isBlank(lines[i])) break;
  }
  return {
    table: {
      id: "bang-1",
      title,
      headers: ["Hiện tượng", ...headers],
      rows,
    } satisfies TableData,
    nextIdx: i,
  };
}

function parseTable2(lines: string[], startIdx: number) {
  // Bảng 2: ...
  // H1
  // H2
  // Attribute
  // left
  // right
  // ... repeated ...
  const title = lines[startIdx].trim();
  const hLeft = normalizeText(lines[startIdx + 1] ?? "");
  const hRight = normalizeText(lines[startIdx + 2] ?? "");
  const headers = ["Tiêu chí", hLeft, hRight];
  const rows: string[][] = [];
  let i = startIdx + 3;
  while (i + 2 < lines.length && !isBlank(lines[i])) {
    const criterion = normalizeText(lines[i]);
    const left = normalizeText(lines[i + 1] ?? "");
    const right = normalizeText(lines[i + 2] ?? "");
    rows.push([criterion, left, right]);
    i += 3;
    if (i < lines.length && isBlank(lines[i])) break;
  }
  return {
    table: {
      id: "bang-2",
      title,
      headers,
      rows,
    } satisfies TableData,
    nextIdx: i,
  };
}

function parseTable3(lines: string[], startIdx: number) {
  const title = lines[startIdx].trim();
  const hLeft = normalizeText(lines[startIdx + 1] ?? "");
  const hRight = normalizeText(lines[startIdx + 2] ?? "");
  const headers = ["Đặc điểm", hLeft, hRight];
  const rows: string[][] = [];
  let i = startIdx + 3;
  while (i + 2 < lines.length && !isBlank(lines[i])) {
    const feature = normalizeText(lines[i]);
    const left = normalizeText(lines[i + 1] ?? "");
    const right = normalizeText(lines[i + 2] ?? "");
    rows.push([feature, left, right]);
    i += 3;
    if (i < lines.length && isBlank(lines[i])) break;
  }
  return {
    table: {
      id: "bang-3",
      title,
      headers,
      rows,
    } satisfies TableData,
    nextIdx: i,
  };
}

function parseReferences(lines: string[], startIdx: number) {
  const refs: ReferenceItem[] = [];
  let i = startIdx;
  let id = 1;
  while (i < lines.length) {
    const raw = normalizeText(lines[i]);
    if (!raw) {
      i++;
      continue;
    }
    const urlMatch = raw.match(/(https?:\/\/\S+)/);
    const url = urlMatch?.[1];
    refs.push({ id, text: raw, url });
    id++;
    i++;
  }
  return refs;
}

export function estimateReadingMinutes(sections: ReportSection[]): number {
  let words = 0;
  for (const s of sections) {
    words += s.title.split(/\s+/).length;
    for (const b of s.blocks) {
      if (b.type === "paragraph") words += b.text.split(/\s+/).length;
    }
  }
  // Vietnamese reading speed ≈ 180–200 words per minute
  return Math.max(1, Math.round(words / 185));
}

export async function getReportData(): Promise<ReportData> {
  const reportPath = path.resolve(process.cwd(), "src", "data", "buonchan.txt");
  const raw = await fs.readFile(reportPath, "utf8");
  const lines = raw.split(/\r?\n/);

  const title = normalizeText(lines[0] ?? "") || "Các Thánh Đối Diện Buồn Chán";
  const subtitle = undefined;

  const majorHeadings = new Set<string>([
    "Dẫn Nhập: Hiện Tượng Buồn Chán Dưới Góc Nhìn Hiện Sinh Và Thần Học Tu Đức",
    "Phân Định Khái Niệm: Sự Buồn Chán Tâm Linh, Sự Khô Khan Và Đêm Tối Tâm Hồn",
    'Giáo Phụ Sa Mạc: Cuộc Chiến Khốc Liệt Với "Ác Quỷ Trưa" Qua Sự Kiên Tâm',
    "Thánh Tôma Aquinô: Liệu Pháp Tâm Lý - Thể Lý Tích Hợp Chữa Lành Nỗi Buồn",
    "Bước Ngoặt Từ Sự Chán Nản Tột Độ: Kinh Nghiệm Hoán Cải Của Thánh I-nhã Loyola",
    'Chuyển Hóa Sự Tẻ Nhạt Thường Nhật: "Con Đường Nhỏ" Của Thánh Têrêsa Lisieux',
    "Bước Vào Chốn Rỗng Tuếch Hãi Hùng: Kinh Nghiệm Đêm Tối Tâm Hồn",
    "Chiến Thắng Nghịch Cảnh Tù Đày Và Sự Lặp Lại: Đức Hồng Y Phanxicô Xaviê Nguyễn Văn Thuận",
    "Ứng Dụng Hiện Đại: Giải Phẫu Và Điều Trị Hội Chứng Buồn Chán Tâm Linh Kỷ Nguyên Mới",
    "Kết Luận",
    "Nguồn trích dẫn",
  ]);

  const sections: ReportSection[] = [];
  let current: ReportSection | null = null;
  let inReferences = false;
  let referencesStartIdx = -1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = normalizeText(line);

    if (trimmed === "Nguồn trích dẫn") {
      inReferences = true;
      referencesStartIdx = i + 1;
      if (current) {
        sections.push(current);
        current = null;
      }
      continue;
    }

    if (inReferences) continue;

    if (isBlank(trimmed)) {
      if (current && current.blocks.length > 0) current.blocks.push({ type: "spacer" });
      continue;
    }

    if (/^Bảng\s+1:/i.test(trimmed)) {
      if (!current) {
        current = {
          id: "bang-1",
          level: 2,
          title: "Bảng 1",
          blocks: [],
        };
      }
      const { table, nextIdx } = parseTable1(lines, i);
      current.blocks.push({ type: "table", table });
      i = nextIdx;
      continue;
    }

    if (/^Bảng\s+2:/i.test(trimmed)) {
      if (!current) {
        current = {
          id: "bang-2",
          level: 2,
          title: "Bảng 2",
          blocks: [],
        };
      }
      const { table, nextIdx } = parseTable2(lines, i);
      current.blocks.push({ type: "table", table });
      i = nextIdx;
      continue;
    }

    if (/^Bảng\s+3:/i.test(trimmed)) {
      if (!current) {
        current = {
          id: "bang-3",
          level: 2,
          title: "Bảng 3",
          blocks: [],
        };
      }
      const { table, nextIdx } = parseTable3(lines, i);
      current.blocks.push({ type: "table", table });
      i = nextIdx;
      continue;
    }

    if (looksLikeHeading(trimmed)) {
      const isMajor = majorHeadings.has(trimmed);
      const level: TocLevel = isMajor ? 2 : 3;
      const idBase = slugify(trimmed.replace(/^Bảng\s+\d+:\s*/i, ""));
      const id = idBase || `section-${sections.length + 1}`;

      if (current) sections.push(current);
      current = { id, level, title: trimmed, blocks: [] };
      continue;
    }

    if (!current) {
      current = { id: "noi-dung", level: 2, title: "Nội dung", blocks: [] };
    }
    current.blocks.push({ type: "paragraph", text: trimmed });
  }

  if (current) sections.push(current);

  const references =
    referencesStartIdx >= 0 ? parseReferences(lines, referencesStartIdx) : [];

  return { title, subtitle, sections, references };
}

