import { getAllSortedPosts, getPostBySlug } from "@/utils/getData";
import { BlogData } from "@/utils/getData";
import { postMeta } from "@/components/PostCard/postcard";
import ContentWrapper from "@/components/contentWrapper";
import { getPostIdToSlug, getPostSlugToId } from "@/utils/getData";
import Footer from "@/components/footer";
import PostSideBar from "@/components/postSidebar";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageTocContent from "@/components/pageTocContent";
import { profileConfig, WebUrl } from "@/config/config";
import GiscusComments from "@/components/GiscusComments";
import License from "@/components/License";
export const dynamicParams = false; // 禁用动态参数（纯静态生成）
// export const revalidate = 3600; // ISR 配置（单位：秒）
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
function PostWrapper({
    children,
    slug,
}: {
    children: React.ReactNode;
    slug: string;
}) {
    return (
        // md:grid-cols-[auto_17.5rem]???
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[auto_17.5rem] grid-rows-[repeat(auto-fill,1fr)] gap-4 px-0 md:px-4 mt-24">
            <main className="col-span-2 lg:col-span-1 overflow-hidden">
                {children}
            </main>
            <GiscusComments className="col-span-2 lg:col-span-1 block row-start-2" />
            <PostSideBar
                slug={slug}
                className="flex flex-col gap-4 row-start-3 col-span-2 lg:row-start-1 lg:col-start-2 lg:col-span-1 lg:max-w-[17.5rem] min-w-[0px]"
            ></PostSideBar>
            <div className="footer col-span-2 lg:col-span-1 onload-animation block row-start-4 lg:row-start-3">
                <Footer></Footer>
            </div>
        </div>
    );
}
export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const decodeSlug = decodeURIComponent(slug);
    const post: BlogData = (await getPostBySlug(decodeSlug)) as BlogData;
    return {
        title: post.title,
        description: post.description,
        keywords: post.tags.join(", "),
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date.toString(),
            images: "/avater.png",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: "/avater.png",
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const decodeSlug = decodeURIComponent(slug);
    const post: BlogData = (await getPostBySlug(decodeSlug)) as BlogData;
    const PostSlugToId = await getPostSlugToId();
    const PostIdToSlug = await getPostIdToSlug();
    const nowId = PostSlugToId.get(decodeSlug)!;
    const prevPostId = nowId - 1;
    const nextPostId = nowId + 1;
    const prevSlug = prevPostId >= 0 ? PostIdToSlug.get(prevPostId) : "#";
    const nextSlug =
        nextPostId < PostIdToSlug.size ? PostIdToSlug.get(nextPostId) : "#";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${WebUrl}/post/${decodeSlug}`,
        },
        headline: decodeSlug,
        description: post.description,
        image: post.image || "",
        author: {
            "@type": "Person",
            name: profileConfig.name,
            url: WebUrl,
        },
        publisher: {
            "@type": "Organization",
            name: profileConfig.name,
            logo: {
                "@type": "ImageObject",
                url: profileConfig.imageSrc.startsWith("http")
                    ? profileConfig.imageSrc
                    : WebUrl + profileConfig.imageSrc,
            },
        },
        datePublished: post.date.toString(),
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostWrapper slug={decodeSlug}>
                <div className="relative w-full card-base md:px-9 pb-4 pt-6 px-6 z-10">
                    {post.image && (
                        <div className="overflow-hidden relative w-full aspect-video rounded-2xl mb-8">
                            <Image
                                src={post.image}
                                alt="post cover"
                                sizes="100vw"
                                fill
                                quality={100}
                                className={`object-cover object-center`}
                            />
                        </div>
                    )}
                    <div className="relative flex flex-col pb-8 border-b border-dashed">
                        <h1 className="block w-full font-bold text-3xl transition line-clamp-2 text-center mb-3">
                            {post.title}
                        </h1>

                        {postMeta({
                            className:
                                "flex justify-center items-center text-neutral-500 gap-x-4",
                            published: post.date,
                            category: post.category,
                            tags: post.tags,
                        })}
                    </div>
                    <div className="lg:hidden pb-2 mb-2 border-b border-dashed">
                        <div className="flex flex-col items-center gap-1 justify-center">
                            <div className="mt-2 text-lg font-bold">目录</div>
                            <div className="w-5 h-1 rounded-md bg-sky-500"></div>

                            <div className="w-full overflow-scroll scroll-container mt-2 px-2 pb-2 transition max-h-[20vh]">
                                <PageTocContent slug={decodeSlug} />
                            </div>
                        </div>
                    </div>
                    <ContentWrapper
                        contentHtml={post.contentHtml}
                        className="pt-2"
                    />
                    <License
                        title={post.title}
                        postUrl={`${WebUrl}/post/${decodeSlug}`}
                        pubDate={post.date}
                        className="rounded-xl mb-6"
                    />
                </div>
                <div className="flex w-full font-bold mt-4 flex-col gap-4 md:flex-row md:justify-between">
                    {prevSlug != "#" && (
                        <Link
                            href={`/post/${prevSlug}`}
                            className="flex w-full mb-1 overflow-hidden items-center px-4 gap-4 bg-white rounded-2xl shadow-md h-[3.75rem]"
                        >
                            <svg
                                height="1em"
                                width="1em"
                                viewBox="0 0 24 24"
                                className="text-[2rem] text-sky-500"
                            >
                                <use href="#ai:material-symbols:chevron-left-rounded"></use>
                            </svg>
                            <div className="text-back/75 overflow-hidden text-base whitespace-nowrap">
                                {prevSlug}
                            </div>
                        </Link>
                    )}
                    {nextSlug != "#" && (
                        <Link
                            href={`/post/${nextSlug}`}
                            className="flex mb-1 flex-row-reverse overflow-hidden w-full items-center px-4 gap-4 bg-white rounded-2xl shadow-md h-[3.75rem]"
                        >
                            <svg
                                height="1em"
                                width="1em"
                                viewBox="0 0 24 24"
                                className="text-[2rem] text-sky-500"
                            >
                                <use href="#ai:material-symbols:chevron-right-rounded"></use>
                            </svg>
                            <div className="text-back/75 overflow-hidden text-base whitespace-nowrap">
                                {nextSlug}
                            </div>
                        </Link>
                    )}
                </div>
            </PostWrapper>
        </>
    );
}
export async function generateStaticParams() {
    const posts = await getAllSortedPosts();
    return posts.map((post) => ({ slug: post.slug }));
}
