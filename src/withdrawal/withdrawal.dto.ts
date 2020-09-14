import { IsNumber, Min, Max, IsDivisibleBy } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(300)
    @IsDivisibleBy(300)
    withdrawAmount: number;
}