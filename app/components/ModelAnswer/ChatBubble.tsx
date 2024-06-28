import { Card, Chip } from "@nextui-org/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatBubble({ text, role }: { text: string; role: string }) {
    const Message = (
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
    );
    return (
        <>
            <div className="flex flex-col justify-start w-full">
                {role === "user" || role === "system" ? (
                    <Card className="markdown text-sm text-gray-500 w-fit p-2 self-end">
                        {Message}
                    </Card>
                ) : (
                    <div className="markdown text-sm text-gray-500 w-full">
                        {Message}
                    </div>
                )}
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
