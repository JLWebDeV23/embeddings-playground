import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardProps,
} from "@nextui-org/card";

function ChatnadoCard({ children, ...props }: CardProps) {
    return <Card {...props}>{children}</Card>;
}

export { ChatnadoCard as Card, CardHeader, CardBody, CardFooter };
