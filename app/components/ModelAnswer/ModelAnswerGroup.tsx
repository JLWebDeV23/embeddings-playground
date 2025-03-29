import { ScrollShadow } from '@nextui-org/scroll-shadow';
import ModelAnswer from '.';
import { ModelData } from '@/app/utils/interfaces';

export default function ModelAnswerGroup({
  answers,
  groupNumber,
}: {
  answers: ModelData[];
  groupNumber: number;
}) {
  return (
    <>
      <p className="px-5 ">Page {groupNumber + 1}</p>
      <ScrollShadow className="flex gap-4 px-5 py-5 orientation-horizontal w-full">
        {answers.length > 0 &&
          answers.map((answer, index) => (
            <ModelAnswer
              key={index}
              modelNumber={index}
              answer={answer}
              isLast={index === answers.length - 1}
            />
          ))}
      </ScrollShadow>
    </>
  );
}
