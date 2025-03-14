import React, { Fragment } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PageContent } from "@/utils/pages";
export default function postcard(props: PageContent) {
    return (
        <div className="card-base flex flex-col rounded-none first:rounded-t-[var(--rounded-large)] last:rounded-b-[var(--rounded-large)] md:flex-col w-full relative md:rounded-[var(--rounded-large)] ">
            <div className="pl-6 md:pl-9 pr-6 md:pr-2 pt-6 md:pt-7 pb-6 relative space-y-3 ">
                <Link
                    href={`/post/${props.slug}`}
                    className=" w-full block font-bold text-3xl 
        hover:text-sky-500 transition line-clamp-2 group md:before:block
          before:w-1 before:h-6 before:hidden before:absolute before:left-[18px]
          before:rounded-md before:bg-[var(--primary)] before:top-[35px]
          "
                >
                    {props.title}
                    <svg
                        className="transition text-[var(--primary)] -translate-x-1 absolute group-hover:opacity-100 inline group-hover:translate-x-0 opacity-0 text-[2rem] translate-y-0.5"
                        data-icon="material-symbols:chevron-right-rounded"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                    >
                        <use href="#ai:material-symbols:chevron-right-rounded"></use>
                    </svg>
                </Link>

                {postMeta({
                    className:
                        "flex flex-wrap text-neutral-500 items-center gap-4 gap-x-4 gap-y-2 mb-2 ",
                    published: props.date,
                    category: props.category,
                    tags: props.tags,
                })}
                <div className="text-75 mb-3.5 pr-4">{props.description}</div>
            </div>
        </div>
    );
}

export function postMeta({
    className,
    published,
    category,
    tags,
}: {
    className?: string;
    published: Date;
    category: string;
    tags?: string[];
}) {
    return (
        <div className={`${className} font-semibold text-sm`}>
            <div className="flex items-center">
                <div className="meta-icon">
                    <svg
                        className="text-xl"
                        data-icon="material-symbols:calendar-today-outline-rounded"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                    >
                        <use href="#ai:material-symbols:calendar-today-outline-rounded"></use>
                    </svg>
                </div>
                <span>{format(published, "yyyy-MM-dd")}</span>
            </div>

            <div className="flex items-center">
                <div className="meta-icon">
                    <svg
                        className="text-xl"
                        data-icon="material-symbols:book-2-outline-rounded"
                        height="1em"
                        viewBox="0 0 24 24"
                        width="1em"
                    >
                        <use href="#ai:material-symbols:book-2-outline-rounded"></use>
                    </svg>
                </div>
                <div className="flex flex-row flex-nowrap items-center">
                    <Link
                        href={`/archive/categories/${category}`}
                        className="rounded-md px-2 py-1 whitespace-nowrap Myhover block"
                    >
                        {category}
                    </Link>
                </div>
            </div>

            <div className="items-center hidden md:flex">
                <div className="flex flex-row flex-nowrap items-center">
                    <div className="meta-icon">
                        <svg
                            className="text-xl"
                            data-icon="material-symbols:tag-rounded"
                            height="1em"
                            viewBox="0 0 24 24"
                            width="1em"
                        >
                            <use href="#ai:material-symbols:tag-rounded"></use>
                        </svg>
                    </div>
                    {tags &&
                        tags.length > 0 &&
                        tags.map((tag, i) => (
                            <Fragment key={i}>
                                <div
                                    className={
                                        "mx-1.5 text-sm" +
                                        (i == 0 ? " hidden" : "")
                                    }
                                >
                                    /
                                </div>
                                <Link
                                    href={`/archive/tags/${tag}`}
                                    className="text-50 p-1 rounded-md Myhover whitespace-nowrap"
                                >
                                    {tag}
                                </Link>
                            </Fragment>
                        ))}
                    {!(tags && tags.length > 0) && (
                        <div className="transition text-50">noTags</div>
                    )}
                </div>
            </div>
        </div>
    );
}
