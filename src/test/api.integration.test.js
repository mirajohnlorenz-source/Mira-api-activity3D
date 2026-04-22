jest.mock('../config/db', () => jest.fn());

const request = require('supertest');
const app = require('../../server');
const Room = require('../models/roomModel');

jest.mock('../models/roomModel');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Integration Test: Room API', () => {
  it('POST /api/v1/rooms should return the created room', async () => {
    const newRoom = {
      roomNumber: 301,
      type: 'Suite',
      price: 250,
    };
    const savedRoom = { _id: 'room-301', ...newRoom };

    Room.create.mockResolvedValue(savedRoom);

    const response = await request(app).post('/api/v1/rooms').send(newRoom);

    expect(response.statusCode).toBe(201);
    expect(response.body.roomNumber).toBe(301);
    expect(response.body.type).toBe('Suite');
    expect(response.body.price).toBe(250);
    expect(Room.create).toHaveBeenCalledWith(newRoom);
  });

  it('GET /api/v1/rooms should return rooms from the database', async () => {
    const rooms = [{
      roomNumber: 401,
      type: 'Single',
      price: 120,
    }];

    Room.find.mockResolvedValue(rooms);

    const response = await request(app).get('/api/v1/rooms');

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      status: 200,
      message: 'Retrieved rooms from DB',
    });
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      roomNumber: 401,
      type: 'Single',
      price: 120,
    });
    expect(Room.find).toHaveBeenCalledTimes(1);
  });
});
