import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateCafeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'start with +62',
  })
  @IsString()
  @Matches(/^\+62\d{9,13}$/, {
    message: 'Phone number must start with +62 and contain 9 to 13 digits',
  })
  phoneNumber: string;
}
