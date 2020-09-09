import { Crud } from './crud';
import { Exchanger } from './xchg';

type Rs = {
  (op: string, ...svc: string[]): <R = void, T = undefined>(
    body?: T
  ) => Promise<R>;
};

type ValueType =
  | 'COLLECTION'
  | 'OBJECT'
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'VOID'
  | 'SELF'
  | 'RECURRENT'
  | 'MAP'
  | 'ENUM';

interface Annotation {
  type: string;
  params: { [s: string]: any };
}

interface Properties {
  [s: string]: Schema;
}

interface Schema {
  mdl: string;
  type: ValueType;
  title: string;
  validations: Array<Annotation>;
  uis: Array<Annotation>;
  properties: Properties;
  element?: Schema;
  key?: Schema;
  value?: Schema;
}

type OpSchema = Record<'svc' | 'op', string> &
  Record<'parameter' | 'returnType', Schema>;

type SchemaReq =
  | string
  | {
      op: string;
      svc: string | string[];
    };

class Chassis {
  rs: Rs;
  crud: Crud;
  xchg: Exchanger;
  constructor(rs: Rs) {
    this.rs = rs;
    this.crud = new Crud(rs);
    this.xchg = new Exchanger(rs);
  }
  schema<T extends SchemaReq>(
    req: T
  ): Promise<T extends string ? Schema : OpSchema> {
    if (typeof req == 'string') {
      return this.rs('schema')({
        mdl: req,
      });
    } else {
      const param: any = Object.assign({}, req);
      if (param.svc) {
        if (typeof param.svc == 'string') {
          param.svc = [param.svc];
        }
      }
      return this.rs('schema')(param);
    }
  }
}

export { Rs, Chassis };
