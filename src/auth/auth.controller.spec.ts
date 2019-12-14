import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '../entities/user_roles.entity';
import { until } from '../utils/helpers';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { User } from '../entities/users.entity';
import { AuthModule } from './auth.module';
import { HttpStatus } from '@nestjs/common';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;

  const response = {
    send: (body?: any) => {},
    status: (code: number) => response,
    cookie: str => void 0,
    json: (res: Object) => void 0,
  };
  class MockedJwtService {
    sign({ user }) {
      return 'sldkfjlaskdflskd';
    }
  }

  let admin = {
    name: 'surya',
    email: 'surya@email.com',
    id: 1,
    createdAt: 'laskdl',
    updatedAt: '9345903478',
    password: '$2a$10$7Xu43ah0tTShM5Ftu9PfJOiRJRxh.C/yWTNKnUbqWK24US1nfnlf6',
    userRoles: Array(1).fill(
      (function() {
        const user = new UserRole();
        user.id = 1;
        user.title = 'ADMIN';
        return user;
      })(),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useClass: MockedJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); //clears all mocks and spyon
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('authorizes admin with correct email & pwd', async done => {
    const jsonSpy = jest.spyOn(response, 'json');

    jest
      .spyOn(authService, 'getUserByEmail')
      .mockImplementation(() => Promise.resolve(admin));
    await until(
      controller.authorizeAdmin(
        { email: 'surya@email.com', pwd: '123456' },
        response,
      ),
    );

    expect(jsonSpy).toHaveBeenCalledWith({ success: true });
    done();
    jsonSpy.mockClear(); //another way to clear mock and spy
  });

  it('sends error on user with given email not present', async done => {
    const jsonSpy = jest.spyOn(response, 'json');

    jest
      .spyOn(authService, 'getUserByEmail')
      .mockImplementation(() => Promise.reject({ name: 'EntityNotFound' }));
    const [err] = await until(
      controller.authorizeAdmin(
        { email: 'surya@email.com', pwd: '123456' },
        response,
      ),
    );

    expect(jsonSpy).not.toHaveBeenCalled();
    expect(err).toBeDefined();
    expect(err.status).toBe(HttpStatus.NOT_FOUND);
    expect(err.response.message).toBe('No User found with given email.');
    done();
  });

  it('sends error on user with given password not match', async done => {
    const jsonSpy = jest.spyOn(response, 'json');

    jest
      .spyOn(authService, 'getUserByEmail')
      .mockImplementation(() => Promise.resolve(admin));
    const [err] = await until(
      controller.authorizeAdmin(
        { email: 'surya@email.com', pwd: '12345' },
        response,
      ),
    );

    expect(jsonSpy).not.toHaveBeenCalled();
    expect(err).toBeDefined();
    expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(err.response.message).toBe('Password doesnot match');
    done();
  });

  it('sends error on  password comparison throws error', async done => {
    const jsonSpy = jest.spyOn(response, 'json');

    jest
      .spyOn(authService, 'getUserByEmail')
      .mockImplementation(() => Promise.resolve(admin));

    jest
      .spyOn(authService, 'compareWithHash')
      .mockImplementation(() => Promise.reject('compare error:)'));
    const [err] = await until(
      controller.authorizeAdmin(
        { email: 'jaysuryahyd@email.com', pwd: '123456' },
        response,
      ),
    );

    expect(jsonSpy).not.toHaveBeenCalled();
    expect(err).toBeDefined();
    expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(err.response.message).toBe('An Error Occured while authentication');
    done();
  });

  it('sends error on  db error on user', async done => {
    const jsonSpy = jest.spyOn(response, 'json');

    jest
      .spyOn(authService, 'getUserByEmail')
      .mockImplementation(() => Promise.reject({})); //reject with something, but not undefined, since `if(err)` is checked to throw errors

    const [err] = await until(
      controller.authorizeAdmin(
        { email: 'jaysuryahyd@email.com', pwd: '123456' },
        response,
      ),
    );

    expect(jsonSpy).not.toHaveBeenCalled();
    expect(err).toBeDefined();
    expect(err.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(err.response.message).toBe('An error occured while authentication.');
    done();
  });
});
