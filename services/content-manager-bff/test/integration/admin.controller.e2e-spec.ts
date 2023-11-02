import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AdministratorController } from '../../../content-manager-bff/src/admin/admin.controller';
import { AdministratorClient } from '../../../content-manager-bff/src/admin/admin.client';

describe('AdministratorController (e2e)', () => {
  let app: INestApplication;

  // Mock the AdministratorClient
  const administratorClient = {
    register: jest.fn(),
    getDocumentsInReview: jest.fn(),
    assignReviewer: jest.fn(),
    initiate: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdministratorController],
      providers: [
        {
          provide: AdministratorClient,
          useValue: administratorClient,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/admin/create/user (POST)', async () => {
    // Mock the register method of AdministratorClient
    administratorClient.register.mockResolvedValue({ message: 'User created successfully' });

    const userDTO = {
      name: 'John Doe',
      username: 'john_doe',
      password: 'password123',
      emailAddress: 'sofoalbert123@gmail.com',
      userType: 'CONTENT_CREATOR',
    };

    const response = await request(app.getHttpServer())
      .post('/admin/create/user')
      .send(userDTO)
      .expect(201);

    expect(response.body).toEqual({ message: 'User created successfully' });
  });

  it('/admin/documents/pending (GET)', async () => {
    // Mock the getDocumentsInReview method of AdministratorClient
    administratorClient.getDocumentsInReview.mockResolvedValue([{ document: 'example' }]);

    const response = await request(app.getHttpServer())
      .get('/admin/documents/pending')
      .expect(200);

    expect(response.body).toEqual([{ document: 'example' }]);
  });

  it('/admin/assign/review (POST)', async () => {
    // Mock the assignReviewer method of AdministratorClient
    administratorClient.assignReviewer.mockResolvedValue({ message: 'Assignment successful' });

    const contentDTO = {
      documentId: 10,
      userId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/admin/assign/review')
      .send(contentDTO)
      .expect(200);

    expect(response.body).toEqual({ message: 'Assignment successful' });
  });

  it('/admin/initiate/review (POST)', async () => {
    // Mock the initiate method of AdministratorClient
    administratorClient.initiate.mockResolvedValue({ message: 'Review initiated successfully' });

    const documentId = 10;

    const response = await request(app.getHttpServer())
      .post(`/admin/initiate/review?documentId=${documentId}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'Review initiated successfully' });
  });
});
