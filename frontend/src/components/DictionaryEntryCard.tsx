import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';

interface Pronunciation {
  mw: string; // Pronunciation string
}

interface DictionaryEntry {
  date?: string; // Date of first use, optional
  hwi?: {
    hw: string; // Headword
    prs?: Pronunciation[]; // Pronunciation array, optional
  };
  shortdef: string[]; // Short definitions array
  fl: string; // Part of speech
}

interface DictionaryEntryCardProps {
  dictionary: DictionaryEntry[];
  selectedWord: string;
}

const DictionaryEntryCard: React.FC<DictionaryEntryCardProps> = ({ dictionary, selectedWord }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler to go to the next entry in the array
  const handleNext = () => {
    if (currentIndex < dictionary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handler to go to the previous entry in the array
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentEntry = dictionary[currentIndex];

  return (
    <Card className="flex-1 shadow-md border border-gray-200">
      <CardHeader className="flex justify-center">
        <h4 className="font-bold text-center">Dictionary Entries</h4>
      </CardHeader>
      <CardBody>
        {dictionary.length > 0 ? (
          <>
            {/* Word Header with Pronunciation */}
            <div className="bg-gray-100 p-4 rounded-t-md">
              <div className="font-bold text-2xl flex items-baseline space-x-2" style={{ color: '#F7B750' }}>
                <span>{selectedWord}</span>
                {currentEntry.hwi?.prs && currentEntry.hwi.prs.length > 0 && (
                  <span className="text-md text-gray-500">({currentEntry.hwi.prs[0].mw})</span>
                )}
                {currentEntry.hwi?.hw && (
                  <span className="text-lg text-gray-800 italic">{currentEntry.hwi.hw}</span>
                )}
              </div>
              {/* Part of Speech and Date */}
              <div className="mt-2 text-md text-gray-500 flex items-baseline space-x-4">
                {currentEntry.fl && <span className="italic">({currentEntry.fl})</span>}
                {currentEntry.date && (
                  <span>First Use: {currentEntry.date.replace(/{.*?}/g, '')}</span>
                )}
              </div>
            </div>

            {/* Definitions */}
            <div className="bg-white p-4 rounded-b-md mt-4">
              {currentEntry.shortdef?.length > 0 ? (
                <ul className="list-decimal pl-6 space-y-2 text-gray-700">
                  {currentEntry.shortdef.map((definition, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {definition}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No definitions available.</div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                variant="flat"
                color="warning"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === dictionary.length - 1}
                variant="flat"
                color="warning"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 p-4">No entries available.</div>
        )}
      </CardBody>
    </Card>
  );
};

export default DictionaryEntryCard;
