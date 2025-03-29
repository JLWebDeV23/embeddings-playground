import React from 'react';
import { LogProbTreeNode } from '@/app/utils/interfaces';

type NewLogProbProps = {
  logProbNode: LogProbTreeNode[];
};

const NewLogProb: React.FC<NewLogProbProps> = ({ logProbNode }) => {
  const renderLogProbTreeNode = (node: LogProbTreeNode) => {
    return <div key={node.id}></div>;
  };
  return <div>NewLogProb</div>;
};

export default NewLogProb;
