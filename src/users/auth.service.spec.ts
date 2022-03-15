import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      //because authservice for signup/signin uses the create and find methods of UsersService:
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User; //as User -> because the User has 3 aditional functions
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, //if anyone asks for UserService
          useValue: fakeUsersService, //give them this
        },
      ],
    }).compile();

    //cause our DI container to create an instance of AuthService with all the dependencies already initialized
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'testpw');

    expect(user.password).not.toEqual('testpw');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is already in use', async (done) => {
    await service.signup('asdf@asdf.com', 'dasdoa');
    //try-catch because Jest doesn't always work well with asynchronous code
    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (err) {
      done();
    }
  });

  it('throws if signin is called with an unused email', async (done) => {
    try {
      //try to find a user that doesn't exist with this email
      await service.signin('dsadrer1esdaa@gmail.com', 'dsaddaxzcsa');
    } catch (err) {
      //it should throw an error because the user does not exist
      done();
    }
  });

  it('throws if invalid password provided on signin', async (done) => {
    await service.signup('dasida213@test.com', 'password');

    try {
      await service.signin('dasida213@test.com', 'passwordtofail');
    } catch (err) {
      done();
    }
  });

  it('returns a users if correct password is provided', async () => {
    await service.signup('testuser@testuser.com', 'testuser');

    const user = await service.signin('testuser@testuser.com', 'testuser');
    expect(user).toBeDefined();
  });
});
