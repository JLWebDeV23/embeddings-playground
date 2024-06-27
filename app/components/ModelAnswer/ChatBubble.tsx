import { Chip } from "@nextui-org/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatBubble({ text, role }: { text: string; role: string }) {
    return (
        <>
            {/* <p className={` text-xs px-2 py-1 ${role === "user" ? "self-end" : ""}`}>{role}</p> */}
            <div className="flex flex-col justify-start rounded-md w-full">
                <div
                    className={`markdown text-sm text-gray-500 ${
                        role === "user"
                            ? "w-fit p-2 self-end bg-surface/50"
                            : "w-full"
                    }`}
                >
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                            rehypeSlug,
                            [
                                rehypePrism,
                                {
                                    ignoreMissing: true,
                                },
                            ],
                            [
                                rehypeAutolinkHeadings,
                                {
                                    properties: {
                                        className: ["anchor"],
                                    },
                                },
                            ],
                        ]}
                    >
                        {text}
                    </Markdown>
                </div>
            </div>
        </>
    );
}

export function ScoreBubble({ score }: { score: number }) {
    function getScoreColor(score: number) {
        if (score < 0.3) {
            return "danger";
        } else if (score < 0.7) {
            return "warning";
        } else {
            return "success";
        }
    }

    return (
        <Chip
            variant="dot"
            size="sm"
            color={getScoreColor(score)}
            className="mt-3 mb-0"
        >
            {score}
        </Chip>
    );
}
