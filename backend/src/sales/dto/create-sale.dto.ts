/* eslint-disable prettier/prettier */
import { 
  IsArray, 
  ValidateNested, 
  ArrayMinSize,
  IsString,
  IsNumber,
  Min,
  IsNotEmpty  
} from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}