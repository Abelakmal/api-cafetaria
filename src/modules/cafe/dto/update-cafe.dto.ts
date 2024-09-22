import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCafeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^\+62\d{9,13}$/, {
    message: 'Phone number must start with +62 and contain 9 to 13 digits',
  })
  @IsOptional()
  phoneNumber: string;
}
