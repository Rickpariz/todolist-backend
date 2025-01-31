export interface IMapper<I, O> {
  mapOne: (data: I) => O;
  mapMany: (data: I[]) => O[];
}
