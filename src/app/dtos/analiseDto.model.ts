import { BenefitedDto } from "./benefitedDto.model";
import { AnalysisResultsDto } from "./resultadoAnaliseDto.model";

export interface AnaliseDto {
    id: number;
    responsible: string;
    date_analyse: Date;
    comments: string;
    benefited: BenefitedDto;
    analysis_results: AnalysisResultsDto[];
}