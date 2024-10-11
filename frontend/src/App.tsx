import axios from 'axios';
import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Card, CardHeader, CardBody, Button} from '@nextui-org/react';
import DictionaryEntryCard from './components/DictionaryEntryCard';
import TextWithInputs from './components/TextWithInputs';
import WordList from './components/WordList';
import ImageCarousel from './components/ImageCarousel';


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
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [dictionaryKey, setDictionaryKey] = useState<number>(0);
  const [dictionaryWord, setDictionaryWord] = useState<string>('');
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [readingTime, setReadingTime] = useState<boolean>(true);
  const [highlightedWordsKey, setHighlightedWordsKey] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('Dictionary');
  const [carouselKey, setCarouselKey] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);


  const handleDelete = () => {
    setHighlightedWords([]);
    setDictionaryWord('');
    setDictionary([]);
    setHighlightedWordsKey((prevKey) => prevKey + 1);
    setDictionaryKey((prevKey) => prevKey + 1);
    setCarouselKey((prevKey) => prevKey + 1);
  };

  const handleTextDelete = () => {
    setText('');
    setHighlightedWords([]);
    setDictionaryWord('');
    setDictionary([]);
    setHighlightedWordsKey((prevKey) => prevKey + 1);
    setDictionaryKey((prevKey) => prevKey + 1);
    setCarouselKey((prevKey) => prevKey + 1);
  }


  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const fetchDictionary = async (dictionaryWord: string) => {
    try {
      setDictionaryWord(dictionaryWord.toLowerCase());
      const [unsplashResponse, dictionaryResponse] = await Promise.all([
        axios.get(`https://highlight-and-learn-backend.vercel.app/unsplash/${dictionaryWord}`),
        axios.get(`https://highlight-and-learn-backend.vercel.app/dictionary/${dictionaryWord}`)
      ]);

      // Handle Unsplash response
      if (unsplashResponse.status === 200 && unsplashResponse.data && unsplashResponse.data.regular_urls) {
        console.log("Image URLs from Unsplash:", unsplashResponse.data.regular_urls);
        setImages(unsplashResponse.data.regular_urls);
      } else if (unsplashResponse.data?.error) {
        console.error(`Unsplash Error: ${unsplashResponse.data.error}`);
      }
  
      // Handle Dictionary response
      if (dictionaryResponse.status === 200 && dictionaryResponse.data && dictionaryResponse.data.entries) {
        console.log("Dictionary definition:", dictionaryResponse.data.entries[0]);
        // Call the setDictionary function here with the result
        setDictionary(dictionaryResponse.data.entries); // Ensure setting entire entries array
      } else if (dictionaryResponse.data?.error) {
        console.error(`Dictionary Error: ${dictionaryResponse.data.error}`);
      }

      setCarouselKey((prevKey) => prevKey + 1);
      setDictionaryKey((prevKey) => prevKey + 1);
  
  
    } catch (error) {
      console.error("An error occurred:", error);
    }
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
      if (!/[a-zA-Z]/.test(selectedWord)) {
        alert('Word to visualize should contain at least one alphabet character.');
        return;
      }

      if (selectedWord.trim().includes(' ')) {
        alert('Word to visualize should be one word, not multiple words separated by a space.');
        return;
      }

      const wordToFetch = selectedWord.toLowerCase();
      setDictionaryWord(wordToFetch); // Set the word before the API calls
      setHighlightedWords((prevHighlightedWords) => {
        if (!prevHighlightedWords.includes(selectedWord)) {
          return [...prevHighlightedWords, selectedWord];
        }
        return prevHighlightedWords;
      });

      try {
        // Fetch both image URLs and dictionary definition simultaneously
        const [unsplashResponse, dictionaryResponse] = await Promise.all([
          axios.get(`https://highlight-and-learn-backend.vercel.app/unsplash/${wordToFetch}`),
          axios.get(`https://highlight-and-learn-backend.vercel.app/dictionary/${wordToFetch}`)
        ]);
  
        // Handle Unsplash response
        if (unsplashResponse.status === 200 && unsplashResponse.data && unsplashResponse.data.regular_urls) {
          console.log("Image URLs from Unsplash:", unsplashResponse.data.regular_urls);
          setImages(unsplashResponse.data.regular_urls);
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
        setDictionaryKey((prevKey) => prevKey + 1);
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
        <div className="flex gap-2">
          <Button color="warning" variant="flat" onClick={handleWordSubmit}>
            Highlight me!
          </Button>
          <Button color="danger" variant="flat" onClick={handleTextDelete} isIconOnly>
            <FaTrashAlt />
          </Button>
        </div>
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
        <div className="flex items-center gap-2 ml-4">
          <Button color="warning" variant="flat" onClick={() => setReadingTime(false)}>
            Quiz Me!
          </Button>
          <Button color="danger" isIconOnly variant="flat" onClick={() => handleDelete()}>
            <FaTrashAlt />
          </Button>
        </div>
      </CardHeader>
        <CardBody>
         <WordList key={highlightedWordsKey}
         highlightedWords={highlightedWords}
         fetchDictionary={fetchDictionary}/>
        </CardBody>
      </Card>

    <Card className="flex-1 shadow-md border border-gray-200">
    <CardHeader className="flex justify-start">
        <div className="flex gap-4">
          <Button
            color={activeTab === 'Dictionary' ? 'warning' : 'default'}
            variant="flat"
            onClick={() => setActiveTab('Dictionary')}
          >
            Dictionary
          </Button>
          <Button
            color={activeTab === 'Images' ? 'warning' : 'default'}
            variant="flat"
            onClick={() => setActiveTab('Images')}
          >
            Images
          </Button>
        </div>
      </CardHeader>
      {activeTab === 'Dictionary' ?
      <DictionaryEntryCard key={dictionaryKey} dictionary={dictionary} selectedWord={dictionaryWord} />
      : 
      <ImageCarousel key={carouselKey} images={images} />
      
      }
      </Card>
    
      
    </div>
  </div>
</div>

    </>
  );
}

export default App;
