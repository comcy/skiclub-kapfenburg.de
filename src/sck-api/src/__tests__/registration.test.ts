import request from 'supertest';
import express from 'express';
import registrationRoutes from '../routes/registration-route';
import { saveData } from '../services/data-service';
import { TripRegisterFormValue } from '../domain/registration';

jest.mock('../services/data-service');

const app = express();
app.use(express.json());
app.use('/api', registrationRoutes);

describe('Registration Routes', () => {
    const mockedSaveData = saveData as jest.Mock;

    beforeEach(() => {
        mockedSaveData.mockClear();
    });

    const mockTripRegisterFormValue: TripRegisterFormValue = {
        trip: {
            destination: 'Test Trip',
            date: '2025-12-25',
            availableBoardings: ['City A', 'City B'],
        },
        additionalText: 'Some additional text',
        participants: [
            {
                firstName: 'John',
                lastName: 'Doe',
                birthday: '1990-05-15',
                email: 'john.doe@test.com',
                phone: '123456789',
                boarding: 'City A',
            },
            {
                firstName: 'Jane',
                lastName: 'Doe',
                birthday: '1992-08-20',
                email: 'jane.doe@test.com',
                phone: '987654321',
                boarding: 'City B',
            },
        ],
    };

    it('POST /api/register - should save a trip registration successfully', async () => {
        mockedSaveData.mockResolvedValue(undefined);

        const response = await request(app).post('/api/register').send(mockTripRegisterFormValue);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Registrierung erfolgreich gespeichert.');
        expect(mockedSaveData).toHaveBeenCalledTimes(2);

        // Verify first participant
        expect(mockedSaveData).toHaveBeenCalledWith('trip-registration', {
            destination: 'Test Trip',
            date: '2025-12-25',
            firstName: 'John',
            lastName: 'Doe',
            birthday: '1990-05-15',
            email: 'john.doe@test.com',
            phone: '123456789',
            boarding: 'City A',
            age: 35,
            additionalText: 'Some additional text',
        });

        // Verify second participant
        expect(mockedSaveData).toHaveBeenCalledWith('trip-registration', {
            destination: 'Test Trip',
            date: '2025-12-25',
            firstName: 'Jane',
            lastName: 'Doe',
            birthday: '1992-08-20',
            email: 'jane.doe@test.com',
            phone: '987654321',
            boarding: 'City B',
            age: 33,
            additionalText: 'Some additional text',
        });
    });

    it('POST /api/register - should return an error if fields are missing', async () => {
        const invalidData = {
            trip: {
                destination: 'Test Trip',
                date: '2025-12-25',
            },
        };

        const response = await request(app).post('/api/register').send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Die Reise und mindestens ein Teilnehmer sind erforderlich.');
        expect(mockedSaveData).not.toHaveBeenCalled();
    });

    it('POST /api/register - should return a 500 error if saving fails', async () => {
        mockedSaveData.mockRejectedValue(new Error('Storage error'));

        const response = await request(app).post('/api/register').send(mockTripRegisterFormValue);

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Fehler bei der Verarbeitung Ihrer Anfrage.');
    });
});
