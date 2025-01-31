export interface IExternal<Input, Output> {
  call(data: Input): Promise<Output>;
}
