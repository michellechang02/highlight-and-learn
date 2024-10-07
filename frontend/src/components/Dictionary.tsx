import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';

interface Pronunciation {
    mw: string; // Pronunciation string
  }
  
  interface DictionaryEntry {
    date?: string; // Date of first use, optional
    hwi: {
      hw: string; // Headword
      prs?: Pronunciation[]; // Pronunciation array, optional
    };
    shortdef: string[]; // Short definitions array
    fl: string; // Part of speech
  }

  interface DictionaryProps {
    entries: DictionaryEntry[];
    word: string;
  }

const Dictionary: React.FC<DictionaryProps> = ({ entries, word }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!entries || entries.length === 0) {
    return <div>No definitions available for "{word}".</div>;
  }

  const currentEntry = entries[currentIndex];

  // Handler to go to the next entry in the array
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % entries.length);
  };

  // Handler to go to the previous entry in the array
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + entries.length) % entries.length);
  };

  

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Card className="w-full max-w-screen-md shadow-md border border-gray-200">
        <CardHeader className="flex justify-between items-center bg-gray-100 p-4 rounded-t-md">
            <div className="font-bold text-lg">
            <span className="text-purple-600">{word}</span> {/* Displaying the searched word prominently */}
            {currentEntry.hwi?.hw && (
                <span className="text-purple-600 ml-2">{currentEntry.hwi.hw}</span>
            )}
            {currentEntry.hwi?.prs && currentEntry.hwi.prs.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">({currentEntry.hwi.prs[0].mw})</span>
            )}
            </div>
            <div className="text-sm text-gray-500">
            {currentEntry.fl && <span className="mr-2">({currentEntry.fl})</span>}
            {currentEntry.date && <span>First Use: {currentEntry.date}</span>}
            </div>
        </CardHeader>
        <CardBody className="bg-white p-4 rounded-b-md">
            <ul className="list-disc pl-6 space-y-2">
            {currentEntry.shortdef?.length > 0 ? (
                currentEntry.shortdef.map((definition, idx) => (
                <li key={idx} className="text-gray-700">
                    {definition}
                </li>
                ))
            ) : (
                <li className="text-gray-500">No definitions available.</li>
            )}
            </ul>
        </CardBody>
        </Card>

      <div className="flex justify-between w-full max-w-screen-md">
        <Button variant="flat" color="warning" onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button variant="flat" color="warning" onClick={handleNext} disabled={currentIndex === entries.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Dictionary;
