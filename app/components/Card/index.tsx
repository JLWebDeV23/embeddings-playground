import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardProps,
} from '@nextui-org/card';

function ChatnadoCard({ children, className = '', ...props }: CardProps) {
  return (
    <Card {...props} className={`shrink-0 ${className}`}>
      {children}
    </Card>
  );
}

export { ChatnadoCard as Card, CardHeader, CardBody, CardFooter };
