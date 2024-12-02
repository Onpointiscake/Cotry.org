const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../server');  // Importa la app desde server.js
const Poll = require('../src/models/poll'); // Modelo Poll

const request = supertest(app);
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => { await mongoose.connection.db.dropDatabase() });

describe('Poll Routes', () => {
    describe('GET /api/polls/:id', () => {
        it('should return a poll when given a valid ID', async () => {
            const poll = await Poll.create({ title: 'Test Poll', options: [] });
            const response = await request.get(`/api/polls/${poll._id}`);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Poll');
        });
    
        it('should return 404 if poll is not found', async () => {
            const response = await request.get('/api/polls/000000000000000000000000');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Poll not found');
        });
    
        it('should return 500 for invalid ID format', async () => {
            const response = await request.get('/api/polls/invalidid');
            expect(response.status).toBe(500);
        });
    });
})
/*
describe('User Routes', () => {
    // Test the Register Route
    describe('POST /api/users/register', () => {
        it('should register a new user successfully with valid fields', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    citizenid: '12345678A',
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        });

        it('should return an error if all fields are not provided', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('All fields are required');
        });

        it('should return an error if the citizenid format is invalid', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    citizenid: 'invalidid',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid DNI format');
        });

        it('should return an error if email is already registered', async () => {
            // Register the first user
            await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    citizenid: '12345678A',
                });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    citizenid: '98765432B',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email already registered.');
        });

        it('should return an error if DNI is already registered', async () => {
            // Register the first user
            await request(app)
                .post('/api/users/register')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123',
                    citizenid: '12345678A',
                });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                    citizenid: '12345678A',  // Same DNI
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('This DNI is already registered.');
        });
    });

    // Test the Login Route
    describe('POST /api/users/login', () => {
        it('should login a user with valid email and password', async () => {
            // Register the user first
            await request(app)
                .post('/api/users/login')
                .send({
                    email: 'email2',
                    password: 'password2',
                });

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'email2',
                    password: 'password2',
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBeDefined();
        });

        it('should return an error for invalid credentials (email or password)', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'wronguser@example.com',
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid email or password');
        });

        it('should return an error for missing email or citizenid', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email and password are required');
        });
    });
});
*/