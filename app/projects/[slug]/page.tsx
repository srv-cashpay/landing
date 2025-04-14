import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

// ✅ Define the props structure
interface PageProps {
  params: {
    slug: string;
  };
}

// ✅ Create Redis instance from environment
const redis = Redis.fromEnv();

// ✅ Generate static paths
export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allProjects
    .filter((project) => project.published)
    .map((project) => ({
      slug: project.slug,
    }));
}

// ✅ Main page component
export default async function PostPage({ params }: PageProps) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
    return null; // TypeScript safeguard
  }

  const views =
    (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}
