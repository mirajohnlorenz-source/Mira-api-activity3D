const { getAllRooms, createRoom } = require('../controllers/roomController');
const Room = require('../models/roomModel');
const staticRooms = require('../data/rooms');
const httpMocks = require('node-mocks-http');

jest.mock('../models/roomModel');

describe('Room Controller Unit Tests', () => {
  let req;
  let res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('GET /rooms (getAllRooms)', () => {
    it('should return 200 OK and rooms from the database when available', async () => {
      const fakeRooms = [{ roomNumber: 101, type: 'Single', price: 100 }];
      Room.find.mockResolvedValue(fakeRooms);

      await getAllRooms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        status: 200,
        message: 'Retrieved rooms from DB',
        data: fakeRooms,
      });
      expect(Room.find).toHaveBeenCalledTimes(1);
    });

    it('should return the static fallback when the database is empty', async () => {
      Room.find.mockResolvedValue([]);

      await getAllRooms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        status: 200,
        message: 'Retrieved rooms (static fallback)',
        data: staticRooms,
      });
    });

    it('should return the static fallback when the database throws an error', async () => {
      Room.find.mockRejectedValue(new Error('DB Connection Lost'));

      await getAllRooms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        status: 200,
        message: 'Retrieved rooms (static fallback due to DB error)',
        data: staticRooms,
      });
    });
  });

  describe('POST /rooms (createRoom)', () => {
    it('should return 201 Created and the new room', async () => {
      req.body = { roomNumber: 301, type: 'Suite', price: 450 };
      const fakeSavedRoom = { _id: '12345', ...req.body };
      Room.create.mockResolvedValue(fakeSavedRoom);

      await createRoom(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual(fakeSavedRoom);
      expect(Room.create).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 when room creation fails', async () => {
      req.body = { roomNumber: 301, type: 'Suite', price: -1 };
      Room.create.mockRejectedValue(new Error('Validation failed'));

      await createRoom(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({ message: 'Validation failed' });
    });
  });
});
