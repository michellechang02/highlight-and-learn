import React from 'react';
import { Chip } from '@nextui-org/react';

interface WordListProps {
  highlightedWords: string[];
}

const WordList: React.FC<WordListProps> = ({ highlightedWords }) => {
  return (
    <div className="mt-4 ml-2">
      {highlightedWords.length > 0 ? (
        highlightedWords.map((word, index) => (
          <Chip key={index} color="warning" variant="flat" size="lg"
          className="m-[3px]"
          >{word}</Chip>
        ))
      ) : (
        <h3 className="text-gray-500">No words to display</h3>
      )}
    </div>
  );
};

export default WordList;
