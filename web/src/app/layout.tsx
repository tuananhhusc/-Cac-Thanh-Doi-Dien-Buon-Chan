import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const SITE_URL = "https://cacthanh.vercel.app";
const TITLE = "Các Thánh Đối Diện Buồn Chán";
const DESCRIPTION =
  "Báo cáo nghiên cứu chuyên sâu: Phương cách các thánh Công giáo đối diện và vượt qua sự buồn chán (acedia), sự khô khan tâm linh và Đêm Tối Tâm Hồn, từ Giáo phụ Sa mạc đến Mẹ Têrêsa Calcutta và Đức Hồng Y Nguyễn Văn Thuận.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "acedia",
    "buồn chán tâm linh",
    "đêm tối tâm hồn",
    "dark night of the soul",
    "các thánh",
    "linh đạo Công giáo",
    "burnout",
    "spiritual dryness",
    "Mẹ Têrêsa",
    "Nguyễn Văn Thuận",
    "Thánh Gioan Thánh Giá",
    "tu đức học",
  ],
  authors: [{ name: "Nghiên cứu tu đức học" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "vi_VN",
    siteName: "Các Thánh Đối Diện Buồn Chán",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Inline script to set .dark class before first paint; prevents FOUC
const themeInitScript = `
(function(){try{
  var t=localStorage.getItem('theme');
  var d=t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  if(d) document.documentElement.classList.add('dark');
}catch(e){}})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${notoSerif.variable} scroll-smooth`}
    >
      <head>
        {/* Inline theme script, must run before body renders */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased bg-stone-50 dark:bg-[#1c1917] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
