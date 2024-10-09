import React from 'react';
import { Button } from '@nextui-org/react';

interface WordListProps {
  highlightedWords: string[];
  fetchDictionary: (word: string) => void;
}

const WordList: React.FC<WordListProps> = ({ highlightedWords, fetchDictionary }) => {


  return (
    <div className="mt-4 ml-2">
      {highlightedWords.length > 0 ? (
        highlightedWords.map((word, index) => (
          <Button key={index} color="warning" variant="flat" size="md"
          className="m-[3px]"
          onClick={() => fetchDictionary(word)}
          >{word}</Button>
        ))
      ) : (
        <h3 className="text-gray-500">No words to display</h3>
      )}
    </div>
  );
};

export default WordList;
