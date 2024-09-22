import { IsEnum, IsString, Matches } from 'class-validator';
import { UserRole } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({ required: true, enum: UserRole })
  @IsEnum(UserRole, {
    message: `Role must be either: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}
