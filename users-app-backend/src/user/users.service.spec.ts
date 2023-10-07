import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
  const prismaService: PrismaService = createMock<PrismaService>();
  const usersService: UsersService = new UsersService(prismaService);

  const mockUserDto: UserDto = {
    id: 234,
    username: 'test-user',
    password: 'TestPassword123!',
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    isAdmin: false,
  };

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      //GIVEN
      prismaService.user.findMany = jest
        .fn()
        .mockReturnValueOnce([mockUserDto, mockUserDto, mockUserDto]);
      //WHEN
      const result = await usersService.getAllUsers();

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.findMany).toBeCalledTimes(1);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return it', async () => {
      //GIVEN
      prismaService.user.create = jest.fn().mockReturnValueOnce(mockUserDto);

      //WHEN
      const result = await usersService.signUp(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.create).toBeCalledTimes(1);
    });
  });

  describe('getMe', () => {
    it('should retrieve user', async () => {
      //GIVEN
      prismaService.user.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockUserDto);

      //WHEN
      const result = await usersService.getMe(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.findUnique).toBeCalledTimes(1);
    });
  });

  describe('editUser', () => {
    it('should edit user', async () => {
      //GIVEN
      prismaService.user.update = jest.fn().mockReturnValueOnce(mockUserDto);

      //WHEN
      const result = await usersService.editUser(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.update).toBeCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      //GIVEN
      prismaService.user.delete = jest.fn().mockReturnValueOnce(mockUserDto);

      //WHEN
      const result = await usersService.deleteUser(mockUserDto.username);

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.delete).toBeCalledTimes(1);
    });
  });

  // Add similar test cases for toggleUserAdmin, editUser, and deleteUser methods

  afterEach(() => {
    jest.clearAllMocks();
  });
});
