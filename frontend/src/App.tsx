import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button} from '@nextui-org/react';
import Dictionary from './components/Dictionary';
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);
  const [dictionaryKey, setDictionaryKey] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);



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

      try {
  
        // Fetch image URLs from Unsplash API
        const unsplashResponse = await axios.get(`https://highlight-and-learn.vercel.app/unsplash/${selectedWord}`);
        if (unsplashResponse.data && unsplashResponse.data.regular_urls) {
          console.log("Image URLs from Unsplash:", unsplashResponse.data.regular_urls);
          setImageUrls(unsplashResponse.data.regular_urls);
        } else if (unsplashResponse.data.error) {
          console.error(`Unsplash Error: ${unsplashResponse.data.error}`);
        }
  
        // Fetch dictionary definition from Merriam-Webster API
        const dictionaryResponse = await axios.get(`https://highlight-and-learn.vercel.app/dictionary/${selectedWord}`);
        if (dictionaryResponse.data) {
          console.log("Dictionary definition:", dictionaryResponse.data);
          setDictionary(dictionaryResponse.data);
          setDataLoaded(true);
        } else if (dictionaryResponse.data.error) {
          console.error(`Dictionary Error: ${dictionaryResponse.data.error}`);
        }


        // Set dataLoaded to true once both sets of data are loaded
        
        // Update keys to trigger re-render
        setCarouselKey((prevKey) => prevKey + 1);
        setDictionaryKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  useEffect(() => {
    if (dataLoaded) {
      const intervalId = setInterval(() => {
        setCarouselKey((prevKey) => prevKey + 1);
        setDictionaryKey((prevKey) => prevKey + 1);
        console.log("Dictionary entries at interval:", dictionary);
        console.log("typeof" + typeof(dictionary))
        console.log("Image URLs at interval:", imageUrls);
      }, 5000); // 5 seconds interval

      // Clean up interval on component unmount or when data changes
      return () => clearInterval(intervalId);
    }
  }, [dataLoaded]);

  return (
    <>
      <div className="flex h-screen w-screen p-4 box-border">
  <div className="flex w-full h-full p-4">
    {/* Left Card */}
    <Card className="w-1/2 h-full">
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <h4 className="text font-bold">Selected word: {selectedWord}</h4>
        <Button color="warning" variant="flat" onClick={handleWordSubmit}>
          Help me!
        </Button>
      </CardHeader>
      <CardBody
        className="flex flex-col h-full"
        onMouseUp={handleMouseUp} // Capture selection on mouse release
      >
        <textarea
          placeholder="Enter a piece of text..."
          className="flex-1 h-full w-full p-4 border border-gray-300 rounded-md resize-none"
        />
      </CardBody>
    </Card>

    {/* Right Section with Definition and Image */}
    <div className="flex flex-col w-1/2 h-full gap-[20px] ml-10">
      <Card className="flex-1">
        <CardHeader className="flex justify-center">
          <h4 className="font-bold text-center">
            Images
          </h4>
        </CardHeader>
        <CardBody>
         <ImageCarousel key={carouselKey} images={imageUrls} />
        </CardBody>
      </Card>

      <Card className="flex-1">
    <CardHeader className="flex justify-center">
      <h4 className="font-bold text-center">Dictionary Entry</h4>
    </CardHeader>
    <CardBody>
      {dictionary.length > 0 ? (
        <>
          {/* Headword and Details */}
          <CardHeader className="flex justify-between items-center bg-gray-100 p-4 rounded-t-md">
            <div className="font-bold text-lg">
              <span className="text-purple-600">{selectedWord}</span> {/* Displaying the searched word prominently */}
              {dictionary[0].hwi?.hw && (
                <span className="text-purple-600 ml-2">{dictionary[0].hwi.hw}</span>
              )}
              {dictionary[0].hwi?.prs && dictionary[0].hwi.prs.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">({dictionary[0].hwi.prs[0].mw})</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {dictionary[0].fl && <span className="mr-2">({dictionary[0].fl})</span>}
              {dictionary[0].date && <span>First Use: {dictionary[0].date}</span>}
            </div>
          </CardHeader>

          {/* Definitions */}
          <CardBody className="bg-white p-4 rounded-b-md">
            {dictionary[0].shortdef?.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {dictionary[0].shortdef.map((definition, idx) => (
                  <li key={idx} className="text-gray-700">
                    {definition}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No definitions available.</div>
            )}
          </CardBody>
        </>
      ) : (
        <div className="text-gray-500 p-4">No entries available.</div>
      )}
    </CardBody>
  </Card>
      
    </div>
  </div>
</div>

    </>
  );
}

export default App;
