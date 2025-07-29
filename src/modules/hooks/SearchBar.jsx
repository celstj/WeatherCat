import React, {useState} from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestion = async(input) => {
        if (input.length > 2) {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`
                );
                const data = await response.json();
                setSuggestions(data);
                } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        fetchSuggestion(e.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        onSearch(suggestion.name);
        setSuggestions([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setSuggestions([]); // Clear suggestions
        }
    };

    return (
        <div className='search-bar'>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={query}
                    onChange={handleChange}
                    placeholder="  Search Location..."
                    className='search-input'
                />
                <button type="submit">
                &#x1F50E;&#xFE0E;
                </button>
                
                {suggestions.length > 0 && (
                    <ul className='suggestions-dropdown'>
                        {suggestions.map((suggestion, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                            {suggestion.name}, {suggestion.region}, {suggestion.country}
                            </li>
                        ))}
                    </ul>
                )}                
            </form>
        </div>
    )
}

export default SearchBar;