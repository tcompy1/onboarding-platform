const Application = require('../../src/models/Applications');
const pool = require('../../src/config/database');

describe('Application Model', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('create', () => {
    it('should create a new application with required fields', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const application = await Application.create(data);

      expect(application).toHaveProperty('id');
      expect(application.firstName).toBe('John');
      expect(application.lastName).toBe('Doe');
      expect(application.email).toBe('john@example.com');
      expect(application.status).toBe('submitted');
      expect(application.productType).toBe('checking');
    });

    it('should use custom product type if provided', async () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        productType: 'savings'
      };

      const application = await Application.create(data);
      expect(application.productType).toBe('savings');
    });
  });

  describe('findAll', () => {
    it('should return all applications ordered by creation date', async () => {
      await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });
      await Application.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      });

      const applications = await Application.findAll();
      expect(applications).toHaveLength(2);
      expect(applications[0].firstName).toBe('Jane'); // Most recent first
    });

    it('should return empty array when no applications exist', async () => {
      const applications = await Application.findAll();
      expect(applications).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return application by id', async () => {
      const created = await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });

      const found = await Application.findById(created.id);
      expect(found.id).toBe(created.id);
      expect(found.email).toBe('john@example.com');
    });

    it('should return undefined for non-existent id', async () => {
      const found = await Application.findById(99999);
      expect(found).toBeUndefined();
    });
  });

  describe('updateStatus', () => {
    it('should update application status', async () => {
      const created = await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });

      const updated = await Application.updateStatus(created.id, 'approved');
      expect(updated.status).toBe('approved');
    });
  });
});
