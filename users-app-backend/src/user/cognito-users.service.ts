import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoUsersService {
  private readonly userPoolId: string;
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private config: ConfigService) {
    const userPoolId = 'us-east-2_sK5yucGiP';
    if (!userPoolId) {
      throw new Error(
        'Could not find COGNITO_USER_POOL_ID in the environment variables.',
      );
    }
    this.userPoolId = userPoolId;
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.config.get<string>('AWS_REGION'),
    });
  }

  async signUp(userDto: UserDto): Promise<void> {
    let { username, name, password, email } = userDto;

    const input: AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'email',
          Value: email,
        },
      ],
    };
    const command = new AdminCreateUserCommand(input);
    let response: AdminCreateUserCommandOutput | undefined;

    const setPwdCmd = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Permanent: true,
      Password: password,
    });

    try {
      response = await this.cognitoClient.send(command);
      await this.cognitoClient.send(setPwdCmd);
    } catch (error) {
      console.log(error);
      if (error.name === 'UsernameExistsException') {
        throw new BadRequestException({
          errorCode: 'USERNAME_UNAVAILABLE',
          message: 'The username already exists in the SSO database',
        });
      }
    }
    if (response?.User?.Username !== username) {
      throw new BadRequestException({
        errorCode: 'SSO_USER_CREATE_FAILURE',
        message: 'The user was not properly created in the SSO database',
      });
    }
  }

  async editUser(userDto: UserDto): Promise<void> {
    let { username, name, email } = userDto;
    await this.updateCognitoUser(username, email, name);
  }

  async updateCognitoUser(
    username: string,
    email: string,
    name: string,
  ): Promise<void> {
    const updateUserCmd = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'name',
          Value: name,
        },
      ],
    });
    await this.cognitoClient.send(updateUserCmd);
  }

  async deleteUser(username: string): Promise<void> {
    const deleteCmd = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    await this.cognitoClient.send(deleteCmd);
  }
}
