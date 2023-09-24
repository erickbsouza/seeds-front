import { CHEMICAL_DAMAGE, FUNGUS, HIGH_VIGOR, ITdDataTableColumn, PHYSYCAL_DAMAGE, WRINKLED } from "@shared";

export const COLUMNS: ITdDataTableColumn[] = [
    { name: "high_vigor", label: HIGH_VIGOR },
    { name: "chemical_damage", label: CHEMICAL_DAMAGE },
    { name: "fungus", label: FUNGUS },
    { name: "physical_damage", label: PHYSYCAL_DAMAGE },
    { name: "wrinkled", label: WRINKLED },
    { name: "seeds_total", label: "Total" }
];