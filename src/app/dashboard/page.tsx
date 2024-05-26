"use client"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../../firebaseConfig';
import Image from 'next/image';
import SideNav from '../components/shared/SideNav';

interface Suggestion {
    id: string;
    text: string;
    imageUrl: string;
}

const Dashboard = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fashionAdvice, setFashionAdvice] = useState<string | null>(null);
    const [displayedText, setDisplayedText] = useState<string>('');
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
  
    const handleDrop = useCallback((event) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      if (droppedFiles.length > 0) {
        setFile(droppedFiles[0]);
      }
    }, []);
  
    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files);
      if (selectedFiles.length > 0) {
        setFile(selectedFiles[0]);
      }
    };
  
    const preventDefault = (event) => event.preventDefault();
  
    const handleRemoveFile = () => {
      setFile(null);
    };
    const handleSubmit = async () => {
      setFashionAdvice(null);
      setDisplayedText('');
      if (!file) {
        alert('Please upload an image.');
        return;
      }
  
      setLoading(true);
  
      // Simulate API call for fashion advice generation
      // Replace this with your actual API call
      setTimeout(() => {
        setLoading(false);
        setFashionAdvice(' Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.');
      }, 2000);
    };


    useEffect(() => {
        // Fetch user suggestions on initial load
        fetchUserSuggestions();
    }, []);


    const fetchUserSuggestions = async () => {
        try {
            const response = await axios.get<{ suggestions: Suggestion[] }>('/api/user/suggestions');
            setSuggestions(response.data.suggestions);
          
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };

    console.log(suggestions)

    const storage = getStorage(app);
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) return;

        console.log(file);
        const metadata = {
          contentType: file?.type
        };
        const imageRef = ref(storage, 'image-store/'+file?.name);
        const uploadTask = uploadBytesResumable(imageRef, file, metadata);

        uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');

          progress==100&&getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          console.log(error)
        },
      );

    };

    const handleGetSuggestion = async () => {
        if (!imageUrl) {
            console.error('Please upload an image first');
            return;
        }

        try {
            const response = await axios.post<{ suggestion: string }>('/api/user/suggestion', { imageUrl });
            console.log('Fashion suggestion:', response.data.suggestion);
            // Update suggestions state to include the new suggestion
            setSuggestions(prevSuggestions => [...prevSuggestions, {
                id: new Date().toISOString(),
                text: response.data.suggestion,
                imageUrl,
            }]);
            // Update user credits state
            // setCredits(prevCredits => prevCredits - 1);
        } catch (error) {
            console.error('Error getting fashion suggestion:', error);
        }
    };

    return (
      <div  className="flex h-[calc(100vh-20vh)]  overflow-auto">
      <SideNav />
       <div className="flex flex-1 m-8 flex-col md:flex-row">
        <div  className="md:w-1/4 align-center m-auto">
        <div>
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
        </div>
        </div>
        <div className='m-8 text-center md:w-3/4'>
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
            </div>
      </div>
    </div>
    );
};

export default Dashboard;
