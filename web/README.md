# Các Thánh Đối Diện Buồn Chán Web App

Một ứng dụng đọc nghiên cứu hiện đại, responsive, trình bày trọn vẹn báo cáo:

> **“Báo Cáo Nghiên Cứu Chuyên Sâu: Phương Cách Các Thánh Công Giáo Đối Diện Và Vượt Qua Sự Buồn Chán, Khô Khan Và Đêm Tối Tâm Hồn”**

Ứng dụng kết hợp **cảm giác tạp chí học thuật** với **mỹ học Công giáo tối giản** (Marian blue + gold).

---

## 1. Tech stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS (App Dir, `@tailwindcss/typography`)
- **Icons**: `lucide-react`
- **Fonts (Vietnamese friendly)**:
  - `Be_Vietnam_Pro` (sans-serif, UI + headings phụ)
  - `Noto_Serif` (serif, body text học thuật)
- **Utilities**:
  - `clsx` + `tailwind-merge` (`cn` helper)

---

## 2. Kiến trúc thư mục

```text
web/
  buonchan.txt          # (1 level up, ở root repo) – nguồn văn bản gốc

  src/
    app/
      layout.tsx        # SEO meta, theme init (dark mode), font config, global shell
      page.tsx          # Trang chính: assemble tất cả section, Abstract, ToC, v.v.
      globals.css       # Tailwind + typography + biến màu, dark mode, print styles

    components/
      Header.tsx        # Header tối giản với thập giá + control bar
      ProgressBar.tsx   # Thanh tiến độ đọc cố định trên top
      TableOfContents.tsx
                        # ToC sticky desktop + nút nổi mobile với bottom sheet
      ReportSection.tsx # Wrapper cho h2/h3, thêm số La Mã cho section chính
      ComparisonTable.tsx
                        # Bảng so sánh responsive + hỗ trợ dark mode
      RichText.tsx      # Render đoạn văn + citation [n] có tooltip
      References.tsx    # “Nguồn trích dẫn” ở cuối, anchor #ref-n
      ThemeToggle.tsx   # Chuyển dark / light mode
      FontSizeControl.tsx
                        # A− / A / A+ (điều chỉnh font-scale toàn trang)
      ShareButton.tsx   # Chia sẻ (Web Share / copy link) + nút In / PDF
      BackToTop.tsx     # Nút lên đầu trang nổi góc phải dưới
      Abstract.tsx      # Khung Tóm tắt + Từ khoá
      PullQuote.tsx     # Khối trích dẫn (pull quote) nổi bật
      GlossaryCard.tsx  # Bảng thuật ngữ các khái niệm chính
      ArticleWrapper.tsx
                        # Provider bọc toàn article để tooltip citation đọc được references

    context/
      ReferencesContext.tsx
                        # React context giữ danh sách tài liệu tham khảo

    data/
      report.ts         # Parser đọc `../buonchan.txt` → cấu trúc section, bảng, references

    lib/
      cn.ts             # `cn(...classes)` = `twMerge(clsx(...))`
```

> Lưu ý: file báo cáo gốc `buonchan.txt` nằm ở **thư mục cha** của `web/` (root workspace).  
> Parser trong `report.ts` luôn đọc từ `../buonchan.txt`.

---

## 3. Cách parser đọc `buonchan.txt`

File `src/data/report.ts` chịu trách nhiệm:

- **Kiểu dữ liệu chính**:
  - `ReportSection` – tiêu đề, level (H2/H3), mảng block:
    - `paragraph` – một đoạn văn
    - `table` – tham chiếu `TableData`
    - `spacer` – khoảng cách giữa đoạn
  - `TableData` – `title`, `headers[]`, `rows[][]`
  - `ReferenceItem` – `[id, text, url?]` cho “Nguồn trích dẫn”
- **Hàm quan trọng**:
  - `getReportData()`:
    - Đọc `../buonchan.txt`
    - Chia dòng, sử dụng heuristic `looksLikeHeading()` để nhận diện H2/H3
    - Tách 3 bảng:
      - Bảng 1: phân biệt *Acedia / Khô khan / Đêm tối*
      - Bảng 2: *Consolation vs Desolation* (theo Thánh I-nhã)
      - Bảng 3: *Acedia cổ điển vs hiện đại (burnout, workaholism)*
    - Gặp dòng `"Nguồn trích dẫn"` → chuyển sang mode parse references
  - `normalizeText(input)`:
    - Xoá en dash `–` theo yêu cầu
    - Chuẩn hoá khoảng trắng
  - `estimateReadingMinutes(sections)`:
    - Đếm số từ trong tiêu đề + đoạn văn
    - Ước lượng thời gian đọc `≈ words / 185`, làm tròn và tối thiểu 1 phút

Parser **không dùng** `dangerouslySetInnerHTML`; mọi thứ được render qua React component.

---

## 4. Các tính năng chính

### 4.1. Trải nghiệm đọc

- **Cột đọc trung tâm**
  - `max-w-3xl`, `prose prose-slate`, `leading-relaxed`, `text-justify`
  - Nền `bg-stone-50`, chữ `text-slate-900` (dark mode: đá tối + chữ sáng)

- **Tóm tắt (Abstract)**
  - Thành phần `Abstract` đặt ngay sau H1:
    - Border + nền vàng nhạt (amber)
    - Giải thích ngắn mục tiêu nghiên cứu, phạm vi, các thánh được khảo sát
    - Hiển thị **“⏱ Đọc khoảng X phút”** từ `estimateReadingMinutes`
    - Dòng “Từ khoá”: `Acedia`, *Spiritual Dryness*, *Dark Night of the Soul*, `Burnout`, `Giáo phụ Sa mạc`, `Linh đạo I-nhã`...

- **Bảng thuật ngữ (GlossaryCard)**
  - Các entry: `Acedia`, `Sự Khô Khan Tâm Linh`, `Đêm Tối Tâm Hồn`, `Hypomone`, `Antirrhetikos`, `Consolation / Desolation`
  - Mỗi mục có định nghĩa súc tích + nguồn (Evagrius, Tôma, Gioan Thánh Giá, I-nhã…)

- **Pull Quotes**
  - Các câu then chốt được đưa thành khối trích dẫn lớn:
    - “Hãy ở lại trong phòng của bạn, và căn phòng sẽ dạy bạn mọi điều.”
    - “Một niềm vui hợp pháp, dù nhỏ bé, có thể mở rộng tâm hồn đang bị nỗi buồn bóp nghẹt.”
    - “Không có gì là nhỏ bé trong mắt Thiên Chúa nếu được làm với tình yêu.”
    - “Tôi sẽ không chờ đợi. Tôi sẽ sống phút hiện tại và làm cho nó đầy tình thương.”

### 4.2. Mục lục (ToC) & điều hướng

- **Desktop**
  - Sidebar trái sticky `lg:sticky lg:top-20`
  - Tự động lấy tất cả `h2[id]`, `h3[id]` dưới `#report-root`
  - Highlight section hiện tại bằng IntersectionObserver:
    - Viền trái vàng, nền trắng, chữ xanh Marian
  - H2 được đánh số La Mã (I. II. III...) trong `ReportSection`

- **Mobile**
  - **Nút nổi “Mục lục”** ở góc phải dưới:
    - Hiển thị luôn tiêu đề section hiện tại (rút gọn)
  - Bấm mở **bottom sheet**:
    - Danh sách Mục lục cuộn được
    - Tap vào một mục → smooth scroll đến section + tự đóng sheet

- **Back to top**
  - Nút tròn nhỏ với icon mũi tên, xuất hiện sau khi cuộn > 400px.

### 4.3. Progress bar

- `ProgressBar.tsx`:
  - Lắng nghe `scroll` trên `document.documentElement`
  - Tính `scrollTop / (scrollHeight - clientHeight)`
  - Vẽ thanh vàng `bg-amber-600` cố định trên đầu trang.

### 4.4. Bảng so sánh (ComparisonTable)

- Nền header xanh Marian (`bg-blue-900`), chữ trắng.
- Dòng xen kẽ `bg-white` / `bg-slate-50` (dark: tông stone).
- Bao ngoài `overflow-x-auto` để kéo ngang trên mobile.

---

## 5. Hệ thống citation & references

### 5.1. Citation inline `[n]` với tooltip

- `RichText.tsx`:
  - Tìm các pattern `.1`, `).12`, `"13"` ở cuối câu → chuyển thành `[n]`.
  - Mỗi `[n]` render `CitationLink`:
    - **Hover/tap**: hiện tooltip nhỏ phía trên:
      - `[n]` + mô tả tài liệu tham khảo (đã bỏ URL)
      - Link `url` (nếu có) mở tab mới
    - **Click**: cuộn tới `#ref-n` trong phần “Nguồn trích dẫn”.

- Tooltip sử dụng `ReferencesContext`:
  - `ArticleWrapper` bọc toàn bộ `<article>` và cung cấp `references` qua context.

### 5.2. References cuối trang

- `References.tsx`:
  - H2: “Nguồn trích dẫn”
  - Danh sách `<ol>`:
    - Mỗi item có:
      - `[n]` ở cột trái (màu vàng)
      - Văn bản trích dẫn gốc
      - Nếu có URL → link có underline

---

## 6. Dark mode & điều chỉnh cỡ chữ

### 6.1. Dark mode

- `layout.tsx`:
  - Chạy script inline rất sớm để:
    - Đọc `localStorage.theme`
    - Hoặc `prefers-color-scheme: dark`
    - Thêm / bỏ class `.dark` trên `<html>` **trước khi render body** → không nhấp nháy.

- `globals.css`:
  - Dùng custom properties:
    - `--background`, `--foreground`, `--accent-blue`, `--accent-gold`
  - `body` và `.prose` đọc từ các biến này (cả dark/sáng).

- `ThemeToggle.tsx`:
  - Nút tròn với icon *Sun/Moon*, lưu `localStorage.theme = 'dark' | 'light'`.

### 6.2. Điều chỉnh cỡ chữ

- `globals.css`:

  ```css
  html {
    font-size: calc(16px * var(--font-scale));
  }
  ```

- `FontSizeControl.tsx`:
  - 3 mức:
    - `A−` → `0.9`
    - `A`  → `1.0` (mặc định)
    - `A+` → `1.15`
  - Khi chọn:
    - Cập nhật `--font-scale` trên `document.documentElement`
    - Ghi `localStorage['font-scale']`

---

## 7. Print / PDF

- `ShareButton.tsx`:
  - `PrintButton` gọi `window.print()`

- `globals.css` – `@media print`:
  - Ẩn các phần có class `print-hide` (header, nút điều khiển, ToC, nút back-to-top…)
  - Điều chỉnh:
    - `body` → chữ đen trên nền trắng, 11pt
    - `h1`, `h2`, `h3` kích thước riêng, tránh ngắt trang xấu
    - `section { page-break-inside: avoid; }`
    - Bảng full width, font nhỏ hơn
    - Link hiển thị dạng: `Text (https://...)` (trừ citation sup).

---

## 8. SEO / Open Graph

- `layout.tsx` thiết lập:
  - `metadataBase`, `title`, `description`, `keywords`, `authors`
  - `openGraph` (article, `vi_VN`, `siteName`)
  - `twitter.card = summary_large_image`
  - `robots: index + follow`

Bạn có thể thay `SITE_URL` bằng domain deploy thực tế (hiện đặt tạm `https://cacthanh.vercel.app`).

---

## 9. Chạy dự án

### 9.1. Yêu cầu

- Node.js 18 hoặc mới hơn
- npm (hoặc pnpm/yarn nếu bạn muốn chỉnh lệnh)

### 9.2. Bước chạy

Từ **root repo** (chứa `buonchan.txt` và thư mục `web/`):

```bash
cd web
npm install
```

Chạy dev server:

```bash
npm run dev
```

Mặc định Next dùng cổng `3000`. Nếu cổng đó bận, bạn có thể:

```bash
npm run dev -- --port 3001
```

Mở trình duyệt:

- `http://localhost:3000` **hoặc** `http://localhost:3001` (tuỳ port bạn dùng).

Build production:

```bash
npm run build
npm start
```

---

## 10. Tuỳ biến & mở rộng

- **Đổi màu sắc**:
  - Chỉnh `--background`, `--foreground`, `--accent-*` trong `globals.css`.
- **Thêm Pull Quote mới**:
  - Vào `page.tsx`, thêm entry mới vào `PULL_QUOTES` với `id` của section tương ứng.
- **Mở rộng bảng thuật ngữ**:
  - Chỉnh `GLOSSARY` trong `GlossaryCard.tsx`.
- **Bổ sung nguồn trích dẫn**:
  - Sửa `buonchan.txt` phần “Nguồn trích dẫn”; parser sẽ tự động cập nhật danh sách references + tooltip.

---

## 11. Gợi ý triển khai thực tế

- Deploy trên **Vercel**:
  - Cấu hình `root = web/` nếu repo có nhiều thư mục.
  - Đảm bảo copy `buonchan.txt` vào cùng level với `web/` (hoặc chỉnh lại đường dẫn trong `report.ts` nếu muốn nhúng nội dung vào repo con).
- Nếu muốn biến site thành đa tài liệu:
  - Chuẩn hoá thêm một layer `content/` với nhiều `.txt`/`.md`
  - Bổ sung router dynamic `[slug]/page.tsx` và chuyển parser `report.ts` thành hàm tổng quát hơn.

---

## 12. Liên hệ / ghi chú

Dự án được thiết kế để:

- Tôn trọng **chiều sâu thần học – tu đức** của bản văn gốc.
- Mang lại trải nghiệm đọc dài hơi, ít mỏi mắt trên cả desktop lẫn mobile.
- Dễ mở rộng cho các báo cáo nghiên cứu Công giáo khác (chỉ cần thay `buonchan.txt` và điều chỉnh meta).

