import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
