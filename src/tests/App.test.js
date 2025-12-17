import { render, screen } from '@testing-library/react';
import App, { timesReducer } from '../App';
import { fetchAPI } from '../utils/api';

jest.mock('../utils/api');

describe('App', () => {
  test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/little lemon/i)).toBeInTheDocument();
  });

  test('initializes available times', () => {
    const mockTimes = ['17:00', '18:00', '19:00'];
    fetchAPI.mockReturnValue(mockTimes);

    render(<App />);
    expect(fetchAPI).toHaveBeenCalled();
  });
});

describe('timesReducer', () => {
  test('returns initial state', () => {
    const mockTimes = ['17:00', '18:00'];
    fetchAPI.mockReturnValue(mockTimes);

    const result = timesReducer([], { type: 'INIT_TIMES' });
    expect(result).toEqual(mockTimes);
  });

  test('updates times based on date', () => {
    const mockTimes = ['19:00', '20:00'];
    fetchAPI.mockReturnValue(mockTimes);

    const testDate = new Date('2025-12-25');
    const result = timesReducer([], { type: 'UPDATE_TIMES', payload: testDate });
    
    expect(fetchAPI).toHaveBeenCalledWith(testDate);
    expect(result).toEqual(mockTimes);
  });

  test('returns current state for unknown action', () => {
    const currentState = ['17:00', '18:00'];
    const result = timesReducer(currentState, { type: 'UNKNOWN' });
    
    expect(result).toEqual(currentState);
  });
});