declare namespace promise_d_exports {
  export { allSettled, sleep, sleepReject };
}
declare function allSettled(promises: Promise<any>[]): Promise<PromiseSettledResult<any>[]>;
declare function sleep(ms: number): Promise<void>;
declare function sleepReject(ms: number, msg?: string): Promise<void>;
//#endregion
export { allSettled, promise_d_exports, sleep, sleepReject };