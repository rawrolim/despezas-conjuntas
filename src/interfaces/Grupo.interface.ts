import Despesa from "./Despesa.interface";

export default interface Grupo {
    createdAt?: string;
    id?: string;
    name: string;
    users: string[];
    despesas: Despesa[];
}