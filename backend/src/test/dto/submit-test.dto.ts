import { IsEnum, IsJSON, IsNotEmpty } from 'class-validator';
import { TestType } from '@prisma/client';

export class SubmitTestDto {
  @IsEnum(TestType)
  type: TestType;

  @IsNotEmpty()
  answers: any; // массив ответов по индексу, например: ["да", "нет", "да", ...]
}
