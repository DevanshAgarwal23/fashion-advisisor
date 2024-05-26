'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { data: session } = useSession();
    const [image, setImage] = useState<File | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [credits, setCredits] = useState(0);

    useEffect(() => {
        if (session) {
            // Fetch user credits and suggestions
            axios.get('/api/user/credits').then(response => setCredits(response.data.credits));
            axios.get('/api/user/suggestions').then(response => setSuggestions(response.data.suggestions));
        }
    }, [session]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);

            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('/api/suggestions', formData);
            setSuggestions(response.data.suggestion);
            setCredits(response.data.credits);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <input type="file" onChange={handleImageUpload} />
            </div>
            <div>
                <h2>Suggestions History</h2>
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion.suggestion}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Credits Left: {credits}</h2>
            </div>
        </div>
    );
}
