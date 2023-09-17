import { AnaliseDto } from "./analiseDto.model";

export interface AnalysisResultsDto {
    id: number;
    chemical_damage: number;
    fungus: number;
    high_vigor: number;
    physical_damage: number;
    seeds_total: number;
    wrinkled: number;
    analyse: AnaliseDto;
}