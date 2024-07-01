import { Card, Chip, Skeleton } from "@nextui-org/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PropsWithChildren } from "react";

type MessageContainerProps = {
    isLoading: boolean;
    role: string;
} & PropsWithChildren;

function MessageContainer({
    role,
    isLoading,
    children,
}: MessageContainerProps) {
    if (role === "system") {
        return null;
    }
    if (isLoading && role === "user") {
        return (
            <Skeleton className="markdown rounded-md text-sm text-gray-500 w-fit p-2 self-end">
                {children}
            </Skeleton>
        );
    } else if (role === "user") {
        return (
            <Card className="markdown text-sm text-gray-500 w-fit p-2 self-end">
                {children}
            </Card>
        );
    } else if (isLoading) {
        return (
            <Skeleton className="markdown rounded-md text-sm text-gray-500 w-fit">
                {children}
            </Skeleton>
        );
    } else {
        return (
            <div className="markdown text-sm text-gray-500 w-full">
                {children}
            </div>
        );
    }
}

export function ChatBubble({
    text,
    role,
    isLoading = false,
}: {
    text: string;
    role: string;
    isLoading?: boolean;
}) {
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
                <MessageContainer isLoading={isLoading} role={role}>
                    {Message}
                </MessageContainer>
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
