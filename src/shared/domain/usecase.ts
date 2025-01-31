export interface IUseCase<Dto, Result> {
  execute(data: Dto): Promise<Result>;
}
