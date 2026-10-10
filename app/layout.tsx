import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INU 생활형 계산기",
  description:
    "인천대학교(INU) 및 일상에 꼭 필요한 10가지 생활 밀착형 만능 계산기 모음 (퍼센트, 비만도, 할인율, 더치페이, 디데이, 학점, 대출 상환, 면적 변환, 유류비, 주휴수당)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
