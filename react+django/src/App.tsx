import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
    const [apples, setApples] = useState<Apple[]>([])

    interface Apple {
        name: string;
        color: string;
        photo_url: string;
    }

    useEffect(() => {
        const applesListUrl = 'http://localhost:8000/apples/'
        axios.get<Apple[]>(applesListUrl)
            .then(response => setApples(response.data))
    }, [])

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {apples.map((apple, index) => (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden" key={index}>
                        <img
                            src={apple.photo_url}
                            alt={`${apple.name} apple`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{apple.name}</h3>
                            <p className="text-gray-600">Color: {apple.color}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App