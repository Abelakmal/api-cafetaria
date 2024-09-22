import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    example: 'asdwkqnfodqfqfqfioq',
  })
  access_token: string;
}
