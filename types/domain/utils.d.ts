/**
 * @example type CurrentContract = Override<CurrentContractDto, { contractId: string }>;
 */
type Override<T, R> = Omit<T, keyof R> & R;
