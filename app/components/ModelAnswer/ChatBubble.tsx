import { Card, Chip, Skeleton } from "@nextui-org/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PropsWithChildren } from "react";
import IonIcon from "@reacticons/ionicons";

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
            <div className="flex gap-3 self-end">
                <Skeleton className="markdown rounded-md text-sm text-gray-500 w-fit p-2">
                    {children}
                </Skeleton>
                <IonIcon name="person-outline" className="text-2xl pt-2" />
            </div>
        );
    } else if (role === "user") {
        return (
            <div className="flex gap-3 self-end">
                <Card className="markdown text-sm text-gray-500 w-fit p-2 ">
                    {children}
                </Card>
                <IonIcon name="person-outline" className="text-2xl pt-2" />
            </div>
        );
    } else if (isLoading) {
        return (
            <div className="flex gap-3">
                <IonIcon name="sparkles-outline" className="text-2xl pt-2" />
                <Skeleton className="markdown rounded-md text-sm text-gray-500 w-fit">
                    {children}
                </Skeleton>
            </div>
        );
    } else {
        return (
            <div className="flex gap-3">
                <IonIcon name="sparkles-outline" className="text-2xl pt-2" />
                <div className="markdown text-sm text-gray-500 w-full">
                    {children}
                </div>
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
