'use client';
import {
  Button,
  ButtonProps,
  Card,
  CardBody,
  CardHeader,
  Spacer,
} from '@nextui-org/react';
import Footer from './components/Footer/Footer';
import Link from 'next/link';

function ButtonLink({ children, ...props }: ButtonProps) {
  return (
    <Button {...props} as={Link}>
      {children}
    </Button>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col justify-center items-center flex-1 min-h-36">
        <h1 className="text-5xl font-bold mt-8">Chatnado</h1>
        <p className="text-xl">Intern Projects for Knowz</p>
        <div className="flex justify-center items-stretch gap-4 px-5 py-10 w-full max-w-6xl flex-col sm:flex-row">
          <Card
            isBlurred
            as={ButtonLink}
            href="/rag"
            className="w-full flex-1 p-0 transition-all duration-300 ease-out 
                        hover:scale-105 hover:skew-x-2 hover:-skew-y-1
                        "
          >
            <CardHeader className="pb-0">
              <h1>RAG</h1>
            </CardHeader>
            <CardBody className="overflow-visible">
              <p className="w-full text-wrap">
                Retrieval Augmented Generation (RAG) is a tool that allow you to
                retrieve and generate text based on your sources powered by AI.
              </p>
            </CardBody>
            <Spacer />
          </Card>
          <Card
            isBlurred
            as={ButtonLink}
            href="/logprob"
            className="w-full flex-1 p-0 transition-all duration-300 ease-out
                        hover:scale-105"
          >
            <CardHeader className="pb-0 ">
              <h1>Tokenizer</h1>
            </CardHeader>
            <CardBody className="overflow-visible">
              <p className="w-full text-wrap">
                Tokenizer is a playground where you can generate alternate end
                of sentence made by AI.
              </p>
            </CardBody>
            <Spacer />
          </Card>
          <Card
            isBlurred
            as={ButtonLink}
            href="/model-compare"
            className="w-full flex-1 p-0 transition-all duration-300 ease-out
                        hover:scale-105 hover:skew-x-2 hover:skew-y-1"
          >
            <CardHeader className="pb-0">
              <h1>Model Compare</h1>
            </CardHeader>
            <CardBody className="overflow-visible">
              <p className="w-full text-wrap">
                Model Compare is a tool that allow you to compare the output of
                Large Language Models (LLM) like GPT, LlaMA 3...
              </p>
            </CardBody>
            <Spacer />
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
