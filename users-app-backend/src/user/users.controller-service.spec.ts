import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { CognitoUsersService } from './cognito-users.service';
import { UsersControllerService } from './users-controller.service';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersControllerService', () => {
  const cognitoUsersService: CognitoUsersService =
    createMock<CognitoUsersService>();
  const usersService: UsersService = createMock<UsersService>();
  const prismaService: PrismaService = createMock<PrismaService>();

  const usersControllerService: UsersControllerService =
    new UsersControllerService(
      prismaService,
      usersService,
      cognitoUsersService,
    );

  const mockUserDto: UserDto = {
    id: 234,
    username: 'test-user',
    password: 'Test-password!',
    name: 'Test User',
    email: 'test@example.com',
    isAdmin: true,
    phoneNumber: '+12873467888',
  };

  const findUniqueUserMock = jest.fn();

  prismaService.user.findUnique =
    findUniqueUserMock.mockReturnValueOnce(mockUserDto);

  describe('getMe', () => {
    it('should return the authenticated user', async () => {
      //GIVEN
      jest.spyOn(usersService, 'getMe').mockResolvedValue(mockUserDto);

      //WHEN
      const result = await usersControllerService.getMe(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(usersService.getMe).toBeCalledTimes(1);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      //GIVEN
      const mockUsers: User[] = [
        {
          id: 234,
          username: 'test-user',
          name: 'Test User',
          email: 'test@example.com',
          isAdmin: true,
          phoneNumber: '+12873467888',
        },
        {
          id: 234,
          username: 'test-user2',
          name: 'Test User2',
          email: 'test2@example.com',
          isAdmin: false,
          phoneNumber: '+12873467888',
        },
      ];
      jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(mockUsers);

      //WHEN
      const result = await usersControllerService.getAllUsers();

      //THEN
      expect(result).toBeTruthy();
      expect(usersService.getAllUsers).toBeCalledTimes(1);
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      //GIVEN
      jest
        .spyOn(usersService, 'signUp')
        .mockImplementationOnce(async (userDto): Promise<User> => {
          return {
            id: 234,
            username: userDto.username,
            name: userDto.name,
            email: userDto.email,
            isAdmin: userDto.isAdmin,
            phoneNumber: userDto.phoneNumber,
          };
        });
      jest
        .spyOn(cognitoUsersService, 'signUp')
        .mockImplementation(async (): Promise<void> => {
          await Promise.resolve();
        });

      //WHEN
      const result = await usersControllerService.signUp(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(usersService.signUp).toBeCalledTimes(1);
      expect(cognitoUsersService.signUp).toBeCalledTimes(1);
    });
  });

  describe('editUser', () => {
    it('should edit user', async () => {
      //GIVEN
      const updatedUser: User = {
        id: 234,
        username: 'test-user',
        name: 'Test User edited',
        email: 'test-edit@example.com',
        isAdmin: true,
        phoneNumber: '+12873467888',
      };

      jest
        .spyOn(usersService, 'editUser')
        .mockImplementationOnce(async (): Promise<User> => {
          return updatedUser;
        });
      jest
        .spyOn(cognitoUsersService, 'editUser')
        .mockImplementationOnce(async (): Promise<void> => {
          await Promise.resolve();
        });

      //WHEN
      const result = await usersControllerService.editUser(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(prismaService.user.findUnique).toBeCalledTimes(1);
      expect(usersService.editUser).toBeCalledTimes(1);
      expect(cognitoUsersService.editUser).toBeCalledTimes(1);
    });
    it("should return a NotFoundException if the user isn't found in the database", async () => {
      // GIVEN
      const notRealUser = mockUserDto;
      notRealUser.username = '';

      // WHEN
      const result = usersControllerService.editUser(notRealUser);
      // THEN
      await expect(result).rejects.toThrowError(NotFoundException);
      expect(prismaService.user.findUnique).toBeCalledTimes(1);
      expect(usersService.editUser).toBeCalledTimes(0);
      expect(cognitoUsersService.editUser).toBeCalledTimes(0);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      //GIVEN
      const deletedUsername = 'test-user';
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(mockUserDto);
      jest
        .spyOn(cognitoUsersService, 'deleteUser')
        .mockImplementationOnce(async (): Promise<void> => {
          return Promise.resolve();
        });

      //WHEN
      const deletedUser =
        await usersControllerService.deleteUser(deletedUsername);

      //THEN
      expect(deletedUser).toBeTruthy();
      expect(usersService.deleteUser).toBeCalledTimes(1);
      expect(cognitoUsersService.deleteUser).toBeCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
