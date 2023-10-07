import { UsersController } from './users.controller';
import { User } from './user.model';
import { UserDto } from './dto/user.dto';
import { createMock } from '@golevelup/ts-jest';
import { UsersControllerService } from './users-controller.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  const usersControllerService: UsersControllerService =
    createMock<UsersControllerService>();
  const usersController: UsersController = new UsersController(
    usersControllerService,
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

  describe('getMe', () => {
    it('should return the authenticated user', async () => {
      //GIVEN
      jest
        .spyOn(usersControllerService, 'getMe')
        .mockImplementationOnce(async (): Promise<User> => {
          return mockUserDto;
        });

      //WHEN
      const result = await usersController.getMe(mockUserDto);

      //THEN
      expect(result).toBeTruthy();
      expect(usersControllerService.getMe).toBeCalledTimes(1);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      // GIVEN
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
          id: 235,
          username: 'test-user2',
          name: 'Test User2',
          email: 'test2@example.com',
          isAdmin: false,
          phoneNumber: '+12873467888',
        },
      ];

      jest
        .spyOn(usersControllerService, 'getAllUsers')
        .mockResolvedValueOnce(mockUsers);

      // WHEN
      const result = await usersController.getAllUsers();

      // THEN
      // This is what is typically done in the mapper:
      expect(result[0].id).toBe(234);
      expect(result[0].username).toBe('test-user');
      expect(result[0].name).toBe('Test User');
      expect(result[0].email).toBe('test@example.com');
      expect(result[0].isAdmin).toBe(true);
      expect(result[0].phoneNumber).toBe('+12873467888');
      expect(usersControllerService.getAllUsers).toBeCalledTimes(1);
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      // GIVEN
      jest
        .spyOn(usersControllerService, 'signUp')
        .mockImplementationOnce(async (): Promise<User> => {
          return mockUserDto;
        });

      // WHEN
      const result = await usersController.signUp(mockUserDto);

      // THEN
      expect(result).toBeTruthy();
      expect(usersControllerService.signUp).toBeCalledTimes(1);
    });
  });

  describe('editUserInfo', () => {
    it('should edit user', async () => {
      // GIVEN
      const updatedUser: User = {
        id: 234,
        username: 'test-user-edited',
        name: 'Test User edited',
        email: 'test-edit@example.com',
        isAdmin: true,
        phoneNumber: '+12873467888',
      };

      jest
        .spyOn(usersControllerService, 'editUser')
        .mockImplementationOnce(async (): Promise<User> => {
          return {
            id: updatedUser.id,
            username: updatedUser.username,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            phoneNumber: updatedUser.phoneNumber,
          };
        });

      // WHEN
      const result = await usersController.editUser(mockUserDto);

      // THEN
      expect(result).toBeTruthy();
      expect(usersControllerService.editUser).toBeCalledTimes(1);
    });
    it('should throw NotFoundException if no user information is passed', async () => {
      //GIVEN
      jest
        .spyOn(usersControllerService, 'editUser')
        .mockImplementationOnce(async () => null);

      //WHEN
      const result = usersController.editUser(null);

      //THEN
      await expect(result).rejects.toThrowError(NotFoundException);
      expect(usersControllerService.editUser).toBeCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      //GIVEN
      const expectedDeletedUser = { ...mockUserDto };
      jest
        .spyOn(usersControllerService, 'deleteUser')
        .mockResolvedValue(expectedDeletedUser);

      //WHEN
      const deletedUser = await usersController.deleteUser('test-user');

      //THEN
      expect(deletedUser).toBeTruthy();
      expect(usersControllerService.deleteUser).toBeCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
