import { PartialType } from '@nestjs/mapped-types';
import { RegisterItemDto } from './register-item.dto';

export class UpdateProductItemDto extends PartialType(RegisterItemDto) {}
