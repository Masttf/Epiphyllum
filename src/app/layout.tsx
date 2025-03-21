import "@/styles/variables.css";
import "@/styles/globals.css";
import "@/styles/markdown.css";
import "@/styles/markdown-extend.css";
import "@/styles/scrollbar.css";
import "katex/dist/katex.css";
import "overlayscrollbars/styles/overlayscrollbars.css";
import Icon from "@/components/Icon";
import BodyScrollBar from "@/components/bodyScrollBar";
import BackToTop from "@/components/backToTop";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="zh-CN"
            className="text-sm md:text-base bg-gray-200 transition"
            data-overlayscrollbars-initialize
        >
            <meta charSet="UTF-8" />
            <body
                className="min-h-screen transition"
                data-overlayscrollbars-initialize
            >
                <BodyScrollBar />
                <Icon />
                {children}
                <BackToTop />
            </body>
        </html>
    );
}
