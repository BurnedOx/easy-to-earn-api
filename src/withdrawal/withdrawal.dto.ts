import { IsNumber, Min, Max, IsDivisibleBy } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(200)
    @IsDivisibleBy(200)
    withdrawAmount: number;
}