"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { OverlayScrollbars } from "overlayscrollbars";
import ScrollBar from "./scrollbar";
declare global {
    interface Window {
        pagefind: any;
    }
}
interface SearchData {
    url: string;
    meta: { title: string };
    excerpt: string;
    sub_results?: any;
}
interface SearchResult {
    id: string;
    data: () => Promise<SearchData>;
}
export default function Search({ handleClick }: { handleClick: () => void }) {
    useEffect(() => {
        async function loadPagefind() {
            // console.log("./pagefind/pagefind.js");
            if (process.env.NODE_ENV === "production") {
                window.pagefind = await import(
                    // @ts-expect-error pagefind generated after build
                    /* webpackIgnore: true */ "./pagefind/pagefind.js"
                );
            } else {
                window.pagefind = {
                    search: () => ({
                        results: [
                            {
                                id: "masttf",
                                data: async () => ({
                                    url: "/",
                                    meta: {
                                        title: "This Is a Fake Search Result",
                                    },
                                    excerpt:
                                        "Because the search cannot work in the <mark>dev</mark> environment.",
                                }),
                            },
                            {
                                id: "masttf2",
                                data: async () => ({
                                    url: "/archive",
                                    meta: {
                                        title: "If You Want to Test the Search",
                                    },
                                    excerpt:
                                        "Try running <mark>npm build && npm preview</mark> instead.",
                                }),
                            },
                        ],
                    }),
                };
            }
        }
        loadPagefind();
    }, []);

    return <SearchUi handleClick={handleClick} />;
}
function SearchUi({ handleClick }: { handleClick: () => void }) {
    const [result, setResult] = useState<SearchResult[]>([]);
    const [query, setQuery] = useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        //把body滚动条设为overflow-hiden 即禁止滚动
        const bodyOsInstance = OverlayScrollbars(document.body);
        bodyOsInstance?.destroy();
        document.body.classList.add("overflow-hidden");
        inputRef.current?.focus();
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                handleClick();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove("overflow-hidden");
            OverlayScrollbars(
                {
                    target: document.body,
                    cancel: {
                        nativeScrollbarsOverlaid: true,
                    },
                },
                {
                    scrollbars: {
                        theme: "scrollbar-base scrollbar-auto py-1",
                        autoHide: "move",
                        autoHideDelay: 500,
                        autoHideSuspend: false,
                    },
                }
            );
        };
    }, []);
    useEffect(() => {
        async function handleSearch() {
            // console.log("query", query);
            if (window.pagefind) {
                const search = await window.pagefind.search(query);
                setResult(search?.results || []);
            }
        }
        handleSearch();
    }, [query]);

    return (
        <div
            className="search-panel fixed inset-0 w-screen h-screen bg-gray-700/10 z-50"
            onClick={handleClick}
        >
            <div
                className="card-base w-full mx-auto max-w-[30rem] min-h-[4.5rem] bg-white opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col w-full py-4">
                    <div className="flex justify-between items-center border-0 border-b-2 border-solid mb-2 mx-4 h-8">
                        <div className="flex gap-1 items-center overflow-hidden">
                            <svg
                                height="1em"
                                width="1em"
                                viewBox="0 0 512 512"
                                className="text-[1rem]"
                            >
                                <use href="#ai:fa6:search"></use>
                            </svg>
                            <input
                                type="text"
                                ref={inputRef}
                                className="px-2 outline-none"
                                placeholder="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 items-center">
                            {query !== "" && (
                                <button
                                    className="w-7 h-7 rounded-md hover:bg-gray-200 flex justify-center items-center"
                                    onClick={() => {
                                        setQuery("");
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <svg
                                        height="1em"
                                        viewBox="0 0 16 16"
                                        width="1em"
                                        className="text-[1rem]"
                                    >
                                        <use href="#ai:fa6:delete"></use>
                                    </svg>
                                </button>
                            )}
                            <button
                                className="h-7 px-1 rounded-md border-2 border-solid hover:bg-gray-200 flex justify-center items-center text-sm font-normal p-1"
                                onClick={handleClick}
                            >
                                Esc
                            </button>
                        </div>
                    </div>
                    <ScrollBar
                        options={{
                            scrollbars: {
                                theme: "scrollbar-base scrollbar-auto py-1",
                                autoHide: "move",
                                autoHideDelay: 500,
                                autoHideSuspend: false,
                            },
                        }}
                        className="px-4 max-h-[50vh]"
                    >
                        <div className="flex flex-col">
                            {(result || []).map((items) => (
                                <SearchCard
                                    key={items.id}
                                    result={items}
                                    handleClick={handleClick}
                                ></SearchCard>
                            ))}
                        </div>
                    </ScrollBar>
                </div>
            </div>
        </div>
    );
}
function SearchCard({
    result,
    handleClick,
}: {
    result: SearchResult;
    handleClick?: () => void;
}) {
    const [data, setData] = useState<SearchData>();
    const [url, setUrl] = useState<string>("");
    useEffect(() => {
        async function fetchData() {
            const data = await result.data();
            setData(data);

            const path = data.url.match(/\/([^/]+)\.html$/);
            const ul = path ? path[1] : "";
            setUrl(ul);
        }

        fetchData();
    }, [result]);
    const resultHtml = useMemo(() => {
        if (!data) return "";
        return data.excerpt;
    }, [data]);
    return (
        <>
            {data && (
                <>
                    <Link
                        href={`/post/${url}`}
                        className="rounded-lg Myhover p-2 group"
                        onClick={handleClick}
                    >
                        <div className="text-xl font-bold">
                            {data.meta.title}
                            <svg
                                className="transition text-[var(--primary)] -translate-x-1 absolute group-hover:opacity-100 inline group-hover:translate-x-0 opacity-0 text-[1.5rem] translate-y-0.5"
                                data-icon="material-symbols:chevron-right-rounded"
                                height="1em"
                                viewBox="0 0 24 24"
                                width="1em"
                            >
                                <use xlinkHref="#ai:material-symbols:chevron-right-rounded"></use>
                            </svg>
                        </div>

                        <div className="text-50 font-normal">
                            <div
                                dangerouslySetInnerHTML={{ __html: resultHtml }}
                            ></div>
                        </div>
                    </Link>
                </>
            )}
        </>
    );
}
