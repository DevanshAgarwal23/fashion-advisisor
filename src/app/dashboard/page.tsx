"use client"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import SideNav from '../components/shared/SideNav';
import { handleImageUpload } from '../lib/upload';
import { useCredits } from '../lib/CreditContext';

interface Suggestion {
    id: string;
    text: string;
    imageUrl: string;
}

const Dashboard = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    // const [imageUrl, setImageUrl] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fashionAdvice, setFashionAdvice] = useState<string | null>(null);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [history, setHistory] = useState<any>(null);
  const speed = 10;
    useEffect(() => {
      if(fashionAdvice){
        let index = 0;
      const timer = setInterval(() => {
        setDisplayedText((prev) => prev + fashionAdvice[index]);
        index++;
        if (index === fashionAdvice.length-1) {
          clearInterval(timer);
        }
      }, speed);
  
      return () => clearInterval(timer);}
    }, [fashionAdvice, speed]);
  
    const handleDrop = useCallback((event : React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      if (droppedFiles.length > 0) {
        setFile(droppedFiles[0] as File);
      }
    }, []);
  
    const handleFileSelect = (event : React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] as File;
      setFile(file);
    };
  
    const preventDefault = (event : React.DragEvent<HTMLDivElement>) => event.preventDefault();
  
    const handleRemoveFile = () => {
      setFile(null);
    };
    const handleSubmit = async () => {
      console.log("inside submit")
      setFashionAdvice(null);
      setDisplayedText('');
      // if (!file) {
      //   alert('Please upload an image.');
      //   return;
      // }
  
 

      await handleGetSuggestion()
  
      // Simulate API call for fashion advice generation
      // Replace this with your actual API call
      // setTimeout(() => {
      //   setLoading(false);
      //   setFashionAdvice(' Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.');
      // }, 2000);
    };

    const {fetchCredits } = useCredits();

    useEffect(() => {
        // Fetch user suggestions on initial load
        fetchUserSuggestions();
        fetchCredits();
    }, [fashionAdvice]);

    useEffect(() => {
      // Fetch user suggestions on initial load
      fetchCredits();
  }, []);


    const fetchUserSuggestions = async () => {
        try {
            const response = await axios.get<{ suggestions: Suggestion[] }>('/api/user/suggestions');
            setSuggestions(response.data.suggestions);
          
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };


    

    function convertToBulletPoints(input: string): string {
      // Split the input string based on the pattern '/n/n-'
      const segments = input.split('/n/n-');
      
      // Format each segment as a bullet point
      const bulletPoints = segments.map(segment => `• ${segment.trim()}`);
      
      // Join the bullet points with newlines
      const result = bulletPoints.join('\n');
  
      return result;
   }

    const handleGetSuggestion = async () => {
      try{
        setLoading(true)
        const imageUrl = await handleImageUpload(file as File)
        if (!imageUrl) {
            console.error('Please upload an image first');
            alert("Please upload file again")
            return;
        }
      }catch(error){
        console.log(error)
        alert("Please upload file again")
        return;
      }
       
        try {
            console.log("making suggestin call")

            const response = await axios.post<{ suggestion: string }>('/api/suggestion', { imageUrl });
            console.log("suggestion call complete")
            console.log('Fashion suggestion:', response.data.suggestion);
            setLoading(false)
            setFashionAdvice(convertToBulletPoints(response.data.suggestion)) 
        } catch (error) {
            setLoading(false)
            alert("Error getting fashion suggestion,Please try again")
            console.error('Error getting fashion suggestion:', error);
        }
    };
    return (
      <div  className="flex h-[calc(100vh-20vh)]  overflow-auto">
      <SideNav setHistory={setHistory} history={suggestions} setFile={setFile} setFashionAdvice={setFashionAdvice}/>
       <div className="flex flex-1 m-8 flex-col md:flex-row">
        <div  className="md:w-1/4 align-center m-auto">
       {history !== null && typeof history === 'object' && !Array.isArray(history) && history?.image?<div>
       <Image width={250} height={250}  src={history?.image} alt="uploaded image" className="m-auto" />
       </div>:(  <><div>
            <div className='text-left pb-8 text-3xl font-light italic mt-2' style={{ fontFamily: 'freight-display-pro, serif !important' }}>Get Expert Fashion Advice by Uploading Your Image Now!</div>
          </div>
          <div>
        <div
          onDrop={handleDrop}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
          onDragLeave={preventDefault}
          className="w-full text-center m-auto max-w-3xl h-56 p-6 border-gray-300 rounded-lg"
        >
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="text-center block">
          <Image src="/upload.svg" alt="upload icon" width={20} height={20} className="m-auto" />
            <p className="mb-2 text-gray-500 cursor-pointer">Drag & Drop or <span className="text-[#51233A] font-bold">browse</span></p>
          </label>
          {file ? (
            <div className="relative mt-4">
              <h4 className="text-gray-700 mb-8">Uploaded Image:</h4>
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded Preview"
                className=" max-w-full h-14 m-auto"
              />
              <button
                onClick={handleRemoveFile}
                className="absolute top-0 right-0 mt-2 mr-2"
              >
                <Image src="/next.svg" alt="X Icon" width={20} height={20} className="text-red-500" />
              </button>
            </div>
          ) : <div className="text-small text-gray-300 mt-16">Your Image will be visible here</div>}
        </div>
          </div></> )}
        </div>
        <div className='m-8 text-center md:w-3/4'>
          {history !== null && typeof history === 'object' && !Array.isArray(history) && history?.text 
          ? <div className='whitespace-pre-wrap text-gray-500 text-justify italic py-2 px-4'>{history?.text}</div>
          :
          <>
          <div className='text-center m-auto'>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-[#51233A] flex justify-center text-sm hover:bg-[#51233A]/90 text-white py-2 px-4 rounded m-auto ${loading ? 'animate-pulse' : 'hover:bg-[#51233A]/90 transition duration-300 ease-in-out'}`}
                >
                  <Image src="/vercel.svg" alt="X Icon" width={20} height={20} className="text-white pr-1" />
                  {loading ? 'Generating...' : fashionAdvice ? 'Regenerate Fashion Advice' : 'Generate Fashion Advice'}
                </button>
              </div>
              {loading &&  <div className="flex items-center justify-center space-x-2 m-8">
                  <div className="w-4 h-4 bg-[#51233A] rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-[#51233A] rounded-full animate-bounce delay-200"></div>
                  <div className="w-4 h-4 bg-[#51233A] rounded-full animate-bounce delay-400"></div>
                </div>}
        
                {fashionAdvice && (
                    <div className="m-auto text-center max-w-2xl h-[calc(100vh-20vh)] overflow-auto">
                    <div>
                      <div className="">
                        <h2 className="text-xl font-semibold m-4">Here are your personalized fashion improvement suggestions!✨</h2>
                        <div className="whitespace-pre-wrap text-gray-500 text-justify italic">
                          {displayedText}
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
            </>
          }
            </div>
      </div>
    </div>
    );
};

export default Dashboard;
