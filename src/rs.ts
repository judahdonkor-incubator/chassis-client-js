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

type Resource = {
  (op: string, ...svc: string[]): <R = void, T = undefined>(
    body?: T
  ) => Promise<R>;
};

type ReportFormat =
  | 'txt'
  | 'json'
  | 'xml'
  | 'html'
  | 'rtf'
  | 'csv'
  | 'odt'
  | 'ods'
  | 'docx'
  | 'pptx'
  | 'pdf'
  | 'xlsx'
  | 'xls';

interface ReportParams {
  id: string;
  format?: ReportFormat;
  params?: { [key in string]: string };
  att?: boolean;
  origin?: string;
}

class Rs {
  of: Resource;
  constructor(resource: Resource) {
    this.of = resource;
  }
  schema<T extends SchemaReq>(
    req: T
  ): Promise<T extends string ? Schema : OpSchema> {
    if (typeof req == 'string') {
      return this.of('schema')({
        mdl: req,
      });
    } else {
      const param: any = Object.assign({}, req);
      if (param.svc) {
        if (typeof param.svc == 'string') {
          param.svc = [param.svc];
        }
      }
      return this.of('schema')(param);
    }
  }
  report(param: ReportParams) {
    return `${param.origin || window.location.origin}/rs/rpt/${
      param.id
    }/${param.format || 'pdf'}${param.att ? '/att' : ''}${
      Object.keys(param.params || {}).length > 0
        ? `?${Object.entries(param.params || {})
            .map(e => `${e[0]}=${e[1]}`)
            .join('&')}`
        : ''
    }`;
  }
  stash(
    id: string,
    att: boolean = false,
    origin: string = window.location.origin
  ) {
    return `${origin}/rs/stash/${id}${att ? '/att' : ''}`;
  }
}

export {
  ValueType,
  Annotation,
  OpSchema,
  Properties,
  Resource,
  Rs,
  Schema,
  SchemaReq,
};
