import { render, screen } from '@testing-library/react';
import MainBox from '../src/modules/hooks/MainBox'; // or wherever the file is
import '@testing-library/jest-dom';

test('renders weather data', () => {
    const fakeWeather = {
        location: { name: 'Sydney', country: 'Australia' },
        current: {
        temperature: 20,
        windSpeed: 10,
        humidity: 50,
        condition: { text: 'Sunny' }
        }
    };

    render(<MainBox weatherData={fakeWeather} selectedHour={{}} />);
    
    expect(screen.getByText(/Sydney, Australia/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperature:/i)).toBeInTheDocument();
});

test('shows error message when error exists', () => {
    render(<HeaderSection error="Location not found" />);
    expect(screen.getByText(/Error fetching location/i)).toBeInTheDocument();
});
