import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Transaction {
    date: string;
    name: string;
    narration: string;
    amount: number;
}
export interface backendInterface {
    addTransaction(date: string, name: string, amount: number, narration: string): Promise<bigint>;
    deleteTransaction(id: bigint): Promise<void>;
    getAllTransactions(): Promise<Array<Transaction>>;
}
