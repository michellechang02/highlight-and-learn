import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button} from '@nextui-org/react';
import DictionaryEntryCard from './components/DictionaryEntryCard';
import ImageCarousel from './components/ImageCarousel';
import TextWithInputs from './components/TextWithInputs';
import WordList from './components/WordList';


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


function App() {


  const [selectedWord, setSelectedWord] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);
  const [dictionaryWord, setDictionaryWord] = useState<string>('');
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [readingTime, setReadingTime] = useState<boolean>(true);


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    // Only set the state if there is text selected
    if (selectedText) {
      setSelectedWord(selectedText);
    }
  };

  const handleWordSubmit = async () => {

    if (selectedWord) {
      if (selectedWord.trim().includes(' ')) {
        alert('Word to visualize should be one word, not multiple words separated by a space.');
        return;
      }

      setDictionaryWord(selectedWord.toLowerCase());
      setHighlightedWords((prevHighlightedWords) => {
        if (!prevHighlightedWords.includes(selectedWord)) {
          return [...prevHighlightedWords, selectedWord];
        }
        return prevHighlightedWords;
      });

      try {
        // Fetch both image URLs and dictionary definition simultaneously
        const [unsplashResponse, dictionaryResponse] = await Promise.all([
          axios.get(`https://highlight-and-learn.vercel.app/unsplash/${dictionaryWord}`),
          axios.get(`https://highlight-and-learn.vercel.app/dictionary/${dictionaryWord}`)
        ]);
  
        // Handle Unsplash response
        if (unsplashResponse.status === 200 && unsplashResponse.data && unsplashResponse.data.regular_urls) {
          console.log("Image URLs from Unsplash:", unsplashResponse.data.regular_urls);
          setImageUrls(unsplashResponse.data.regular_urls);
        } else if (unsplashResponse.data?.error) {
          console.error(`Unsplash Error: ${unsplashResponse.data.error}`);
        }
  
        // Handle Dictionary response
        if (dictionaryResponse.status === 200 && dictionaryResponse.data && dictionaryResponse.data.entries) {
          console.log("Dictionary definition:", dictionaryResponse.data.entries[0]);
          setDictionary(dictionaryResponse.data.entries); // Ensure setting entire entries array
        } else if (dictionaryResponse.data?.error) {
          console.error(`Dictionary Error: ${dictionaryResponse.data.error}`);
        }

        // Update keys to trigger re-render
        setCarouselKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };



  return (
    <>
      <div className="flex h-screen w-screen p-4 box-border">
  <div className="flex w-full h-full p-4">
    {/* Left Card */}
    {readingTime ? 
    <Card className="w-1/2 h-full">
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <h4 className="text font-bold">Selected word: {selectedWord}</h4>
        <Button color="warning" variant="flat" onClick={handleWordSubmit}>
          Highlight me!
        </Button>
      </CardHeader>
      <CardBody
        className="flex flex-col h-full"
        onMouseUp={handleMouseUp} // Capture selection on mouse release
      >
        <textarea
          placeholder="Enter a piece of text..."
          className="flex-1 h-full w-full p-4 border border-gray-300 rounded-md resize-none"
          value={text}
          onChange={handleTextChange}
        />
      </CardBody>
    </Card>
    : 
    <TextWithInputs highlightedWords={highlightedWords} text={text} setReadingTime={setReadingTime} />
    }

    {/* Right Section with Definition and Image */}
    <div className="flex flex-col w-1/2 h-full gap-[20px] ml-10">
      
      <Card className="flex-1">
      <CardHeader className="flex justify-between items-center">
        <h4 className="font-bold ml-2">Highlighted Word List</h4>
        <Button color="warning" variant="flat" className="ml-4"
        onClick={() => setReadingTime(false)}>
          Quiz Me!
        </Button>
      </CardHeader>
        <CardBody>
         <WordList highlightedWords={highlightedWords}/>
        </CardBody>
      </Card>
      <DictionaryEntryCard dictionary={dictionary} selectedWord={dictionaryWord} />

    
      
    </div>
  </div>
</div>

    </>
  );
}

export default App;
