import { AnaliseDto } from "./analiseDto.model";

export interface AnalysisResultsDto {
    id: number;
    chemical_damge: Number;
    fungus: Number;
    high_vigor: Number;
    physical_damage: Number;
    seeds_total: Number;
    wrinkled: Number;
    analyse: AnaliseDto;
}