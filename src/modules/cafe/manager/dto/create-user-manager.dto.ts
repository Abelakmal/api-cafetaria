import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateUserManager {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Password must contain only letters and numbers',
  })
  password: string;
}
