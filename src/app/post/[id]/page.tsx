import { getAllPosts, getPostById } from "@/utils/posts";
import { BlogPost } from "@/utils/posts";
import { format } from "date-fns";
import ContentWrapper from "@/components/contentWrapper";
export const dynamicParams = false; // 禁用动态参数（纯静态生成）
export const revalidate = 3600; // ISR 配置（单位：秒）

export default async function Post({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post: BlogPost = await getPostById(id);
    return (
        <div className="card-base p-8">
            <h1>{post.title}</h1>
            <p>{format(post.date, "yyyy-MM-dd")}</p>
            <ContentWrapper content={post.contentHtml}>
            </ContentWrapper>
        </div>
    );
}
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({ id: post.id }));
}
