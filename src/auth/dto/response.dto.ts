import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
