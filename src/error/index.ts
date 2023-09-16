interface IErrorData<T = IDefaultMetaData> {
  code: string;
  message: string;
  metadata?: T;
}
interface IDefaultMetaData {
  id: string;
}

export class BaseError<MetaData> extends Error {
  data: IErrorData<MetaData>;

  constructor(data: IErrorData<MetaData>) {
    super(data.message);
    this.data = data;
  }
}