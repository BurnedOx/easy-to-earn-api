import { IsNumber, IsString, Min } from "class-validator";

export class SendEPinDTO {
    @IsString()
    sendTo: string;

    @IsNumber()
    @Min(1)
    total: number;
}