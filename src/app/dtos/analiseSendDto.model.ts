import { FileInput } from "ngx-material-file-input";

export interface AnaliseSendDto {
    id?: number;
    responsible: string | null;
    date_analyse: Date | null;
    comments: string | null;
    benefited_id: number | null;
    images?: string[] | null;
}