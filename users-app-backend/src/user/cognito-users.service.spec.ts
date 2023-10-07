import { BadRequestException } from '@nestjs/common';
import { CognitoUsersService } from './cognito-users.service';
import { UserDto } from './dto/user.dto';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';

describe('CognitoUsersService', () => {
  const configService: ConfigService = createMock<ConfigService>();
  const cognitoUsersService: CognitoUsersService = new CognitoUsersService(
    configService,
  );

  const mockUserDto: UserDto = {
    id: 234,
    username: 'Test User',
    name: 'test-user',
    email: 'test-email@email.com',
    password: 'Password123!',
    phoneNumber: '+12873764823',
    isAdmin: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('awsSignUp', () => {
    it('should sign up a new user', async () => {
      // GIVEN

      const cognitoIdentityProvider = Object.getPrototypeOf(
        new CognitoIdentityProviderClient({
          region: configService.get<string>('AWS_REGION'),
        }),
      );
      jest
        .spyOn(cognitoIdentityProvider, 'send')
        .mockReturnValue({ User: { Username: mockUserDto.username } });

      // WHEN
      await cognitoUsersService.signUp(mockUserDto);

      // THEN
      expect(cognitoIdentityProvider.send).toBeCalled();
    });

    it('should throw BadRequestException when no username is returned', async () => {
      // GIVEN
      const cognitoIdentityProvider = Object.getPrototypeOf(
        new CognitoIdentityProviderClient({
          region: configService.get<string>('AWS_REGION'),
        }),
      );
      jest.spyOn(cognitoIdentityProvider, 'send').mockReturnValue({
        userObj: mockUserDto,
      });

      // WHEN
      const result = async (): Promise<void> => {
        await cognitoUsersService.signUp(mockUserDto);
      };

      // THEN
      await expect(result).rejects.toThrow(BadRequestException);
      expect(cognitoIdentityProvider.send).toBeCalled();
    });
  });

  describe('editUser', () => {
    it('should update a user in the SSO', async () => {
      // GIVEN
      const cognitoIdentityProvider = Object.getPrototypeOf(
        new CognitoIdentityProviderClient({
          region: configService.get<string>('AWS_REGION'),
        }),
      );

      jest.spyOn(cognitoIdentityProvider, 'send').mockReturnValue({
        mockUserDto,
      });

      // WHEN
      await cognitoUsersService.editUser(mockUserDto);

      // THEN
      expect(cognitoIdentityProvider.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user in the sso', async () => {
      // GIVEN
      const username = 'test-user';

      const cognitoIdentityProvider = Object.getPrototypeOf(
        new CognitoIdentityProviderClient({
          region: configService.get<string>('AWS_REGION'),
        }),
      );
      jest
        .spyOn(cognitoIdentityProvider, 'send')
        .mockReturnValue({ User: { Username: username } });

      // WHEN
      await cognitoUsersService.deleteUser(username);

      // THEN
      expect(cognitoIdentityProvider.send).toHaveBeenCalledTimes(1);
    });
  });
});
