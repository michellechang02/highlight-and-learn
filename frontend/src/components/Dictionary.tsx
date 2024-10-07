import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';

interface Pronunciation {
  mw: string; // Pronunciation string
}

interface DictionaryEntry {
  date?: string; // Date of first use, optional
  hwi?: { // Make hwi optional
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
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <Card key={index} className="w-full max-w-screen-md shadow-md border border-gray-200">
            <CardHeader className="flex justify-between items-center bg-gray-100 p-4 rounded-t-md">
              <div className="font-bold text-lg">
                <span className="text-purple-600">{word}</span> {/* Displaying the searched word prominently */}
                {entry.hwi?.hw && (
                  <span className="text-purple-600 ml-2">{entry.hwi.hw}</span>
                )}
                {entry.hwi?.prs && entry.hwi.prs.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500">({entry.hwi.prs[0].mw})</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {entry.fl && <span className="mr-2">({entry.fl})</span>}
                {entry.date && <span>First Use: {entry.date}</span>}
              </div>
            </CardHeader>
            <CardBody className="bg-white p-4 rounded-b-md">
              {entry.shortdef?.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {entry.shortdef.map((definition, idx) => (
                    <li key={idx} className="text-gray-700">
                      {definition}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No definitions available.</div>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <div className="text-gray-500 p-4">No entries available.</div>
      )}
    </div>
  );
};

export default Dictionary;
