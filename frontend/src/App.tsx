import axios from 'axios';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';


function App() {

  const [selectedWord, setSelectedWord] = useState<string>('');

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
        } else if (unsplashResponse.data.error) {
          console.error(`Unsplash Error: ${unsplashResponse.data.error}`);
        }
  
        // Fetch dictionary definition from Merriam-Webster API
        const dictionaryResponse = await axios.get(`https://highlight-and-learn.vercel.app/dictionary/${selectedWord}`);
        if (dictionaryResponse.data) {
          console.log("Dictionary definition:", dictionaryResponse.data);
        } else if (dictionaryResponse.data.error) {
          console.error(`Dictionary Error: ${dictionaryResponse.data.error}`);
        }
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
          {/* Insert definition content here */}
        </CardBody>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex justify-center">
          <h4 className="font-bold text-center">Definition</h4>
        </CardHeader>
        <CardBody>
          {/* Insert image content here */}
        </CardBody>
      </Card>
    </div>
  </div>
</div>

    </>
  );
}

export default App;
