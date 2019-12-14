import { IsDefined, Length } from 'class-validator';

export class AddCategoryDto {
  @IsDefined({ message: 'Name is required' })
  @Length(3, 50, { message: 'Category name must have 3 to 50 characters' })
  name: string;
  
}

export class UpdateCategoryDto {
  @IsDefined({ message: 'Please provide category' })
  id: number;
  name: string;
}
