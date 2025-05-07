import { AxiosResponse } from "axios";


export type GenerateApiFunction<T, R> = (data?: T) => Promise<AxiosResponse<R>>;