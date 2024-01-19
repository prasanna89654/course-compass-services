import { InputType, PartialType } from '@nestjs/graphql';
import { AddMobileNumberInput } from './add-mobile-number-input';

@InputType()
export class UpdateMobileNumberInput extends PartialType(AddMobileNumberInput) {
}
