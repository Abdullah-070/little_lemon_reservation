import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('BookingForm', () => {
  const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00'];
  const mockUpdateTimes = jest.fn();
  const mockSubmitForm = jest.fn(() => true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders booking form with all fields', () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /make your reservation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockSubmitForm).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('validates number of guests', async () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const guestsInput = screen.getByLabelText(/number of guests/i);
    
    // Test minimum
    fireEvent.change(guestsInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(screen.getByText(/minimum 1 guest required/i)).toBeInTheDocument();
    });

    // Test maximum
    fireEvent.change(guestsInput, { target: { value: '11' } });
    await waitFor(() => {
      expect(screen.getByText(/maximum 10 guests allowed/i)).toBeInTheDocument();
    });
  });

  test('updates available times when date changes', () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const dateInput = screen.getByLabelText(/choose date/i);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: tomorrowStr } });

    expect(mockUpdateTimes).toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    // Fill in all required fields
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/choose date/i), {
      target: { value: tomorrowStr }
    });

    fireEvent.change(screen.getByLabelText(/choose time/i), {
      target: { value: '18:00' }
    });

    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: '4' }
    });

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'John Doe' }
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });

    const submitButton = screen.getByRole('button', { name: /make your reservation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/confirmed', expect.any(Object));
    });
  });

  test('shows error when no times available', () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={[]}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/choose date/i), {
      target: { value: tomorrowStr }
    });

    expect(screen.getByText(/no available times for this date/i)).toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    render(
      <BrowserRouter>
        <BookingForm
          availableTimes={mockAvailableTimes}
          updateTimes={mockUpdateTimes}
          submitForm={mockSubmitForm}
        />
      </BrowserRouter>
    );

    const dateInput = screen.getByLabelText(/choose date/i);
    expect(dateInput).toHaveAttribute('aria-required', 'true');

    const timeSelect = screen.getByLabelText(/choose time/i);
    expect(timeSelect).toHaveAttribute('aria-required', 'true');
  });
});