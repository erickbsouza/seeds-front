import { AnaliseDto } from "./analiseDto.model";

export interface BenefitedDto {
    id: number;
    name: string;
    contact: Date;
    email: string;
    analyses: AnaliseDto[];
}