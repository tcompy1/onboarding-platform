const request = require('supertest');
const app = require('../../src/index');
const pool = require('../../src/config/database');

describe('Applications API', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /applications', () => {
    it('should create a new application', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        })
        .expect(201);

      expect(response.body).toHaveProperty('applicationId');
      expect(response.body.status).toBe('submitted');
    });

    it('should return 400 for missing firstName', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          lastName: 'Doe',
          email: 'john@example.com'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 for missing lastName', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          email: 'john@example.com'
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should accept custom product type', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          productType: 'savings'
        })
        .expect(201);

      expect(response.body).toHaveProperty('applicationId');
    });
  });

  describe('GET /admin/applications', () => {
    it('should return all applications', async () => {
      // Create test applications
      await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      await request(app)
        .post('/applications')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com'
        });

      const response = await request(app)
        .get('/admin/applications')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('firstName');
      expect(response.body[0]).toHaveProperty('email');
    });

    it('should return empty array when no applications exist', async () => {
      const response = await request(app)
        .get('/admin/applications')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /admin/applications/:id', () => {
    it('should return application by id', async () => {
      const createResponse = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const id = createResponse.body.applicationId;

      const response = await request(app)
        .get(`/admin/applications/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app)
        .get('/admin/applications/99999')
        .expect(404);
    });
  });

  describe('PUT /admin/applications/:id/status', () => {
    it('should update application status', async () => {
      const createResponse = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const id = createResponse.body.applicationId;

      const response = await request(app)
        .put(`/admin/applications/${id}/status`)
        .send({ status: 'approved' })
        .expect(200);

      expect(response.body.status).toBe('approved');
    });

    it('should return 400 for missing status', async () => {
      const createResponse = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const id = createResponse.body.applicationId;

      await request(app)
        .put(`/admin/applications/${id}/status`)
        .send({})
        .expect(400);
    });

    it('should return 400 for invalid status', async () => {
      const createResponse = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const id = createResponse.body.applicationId;

      const response = await request(app)
        .put(`/admin/applications/${id}/status`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body.error).toBe('Invalid status');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
