import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react';

interface Props {
  text: string;
  highlightedWords: string[];
  setReadingTime: (isCorrect: boolean) => void; // Function type declaration improved
}

const TextWithInputs: React.FC<Props> = ({ text, highlightedWords, setReadingTime }) => {
  const [userInputs, setUserInputs] = useState<string[]>(new Array(highlightedWords.length).fill(''));

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    setUserInputs(updatedInputs);
  };

  // Check if user's inputs match the original highlighted words
const checkMatch = () => {
    // Create a counter to handle multiple identical highlighted words correctly
    let inputCounter = 0;
    
    const isMatch = text.split(' ').every((word) => {
      if (highlightedWords.includes(word) && inputCounter < userInputs.length) {
        const isCorrect = userInputs[inputCounter] === word;
        inputCounter++; // Increment the counter only if the word is highlighted
        return isCorrect;
      }
      return true; // Non-highlighted words don't affect the match
    });
  
    alert(isMatch ? 'Correct!' : 'Incorrect, try again.');
    if (isMatch) {
      setReadingTime(true); // Pass true if the answer is correct
    }
  };
  

  useEffect(() => {
    console.log(highlightedWords);
  }, [highlightedWords]);

  // Replace highlighted words with input fields in the text
const renderTextWithInputs = () => {
    let inputCounter = 0; // Counter to ensure each highlighted word gets a unique input
  
    return text.split(' ').map((word, index) => {
      if (highlightedWords.includes(word) && inputCounter < highlightedWords.length) {
        const inputIndex = inputCounter++; // Increment the counter for each occurrence of a highlighted word
        const inputWidth = word.length * 10; // Dynamic width based on word length
  
        return (
          <Input
            key={`input-${inputIndex}-${index}`}
            className="mx-2"
            value={userInputs[inputIndex]}
            onChange={(e) => handleInputChange(inputIndex, e.target.value)}
            size="sm"
            aria-label={`input-${inputIndex}-${index}`}
            style={{ width: `${inputWidth}px` }} // Set dynamic width
          />
        );
      } else {
        return <span key={index} className="mx-1">{word}</span>;
      }
    });
  };
  

  return (
    <Card className="w-1/2 h-full p-4">
        <CardHeader className="flex justify-center">
        <h4 className="font-bold text-center">Fill in the Blank Quiz</h4>
      </CardHeader>
      <CardBody className="flex flex-col h-full">
        <div className="text-lg mb-4">
          {renderTextWithInputs()}
        </div>
        <Button color="warning" variant="flat" onClick={checkMatch}>
          Check Answers
        </Button>
      </CardBody>
    </Card>
  );
};

export default TextWithInputs;
