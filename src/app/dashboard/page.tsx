"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../../firebaseConfig';

interface Suggestion {
    id: string;
    text: string;
    imageUrl: string;
}

const Dashboard = () => {
    const [credits, setCredits] = useState<number>(0);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [imageUrl, setImageUrl] = useState<string>('');


    useEffect(() => {
        // Fetch user credits on initial load
        fetchCredits();
        // Fetch user suggestions on initial load
        fetchUserSuggestions();
    }, []);

    const fetchCredits = async () => {
        try {
            const response = await axios.get<{ credits: number }>('/api/user/credits');
            setCredits(response.data.credits);
        } catch (error) {
            console.error('Error fetching user credits:', error);
        }
    };

    const fetchUserSuggestions = async () => {
        try {
            const response = await axios.get<{ suggestions: Suggestion[] }>('/api/user/suggestions');
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };

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
            setCredits(prevCredits => prevCredits - 1);
        } catch (error) {
            console.error('Error getting fashion suggestion:', error);
        }
    };

    return (
        <div>
            <header>
                <h1>Dashboard</h1>
                <div>Credits: {credits}</div>
            </header>
            <main>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <button onClick={handleGetSuggestion}>Get Fashion Suggestion</button>
                {/* Render old suggestions */}
                <aside>
                    <h2>Old Suggestions</h2>
                    <ul>
                        {suggestions.map(suggestion => (
                            <li key={suggestion.id}>
                                <img src={suggestion.imageUrl} alt="Outfit" />
                                <p>{suggestion.text}</p>
                            </li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
};

export default Dashboard;
