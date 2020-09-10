import { Resource } from './rs';

type Pagination = Record<'page' | 'size', number>;

type Status = 'DORMANT' | 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';

interface Entity {
  id?: number;
  status?: Status;
  display?: string;
  [key: string]: any;
}

interface Enum {
  name: string;
  display: string;
  ordinal: number;
  [key: string]: any;
}

type PredicateType =
  | 'EQUAL'
  | 'LIKE'
  | 'OR'
  | 'AND'
  | 'IS_NULL'
  | 'IS_NOT_NULL';

interface Predicate {
  type: PredicateType;
  params?: { [key: string]: any };
  restrictions?: Predicate[];
}

interface Sorting {
  column: string;
  desc: boolean;
}

interface Request {
  id?: number;
  status?: Status;
  name?: string;
  entity?: Entity;
  mdl: string;
  pageNumber?: number;
  pageSize?: number;
  where?: Predicate[];
  orderBy?: Sorting[];
}

type Links = Record<'self' | 'first' | 'prev' | 'next' | 'last', string>;

type Meta = Record<
  'pageNumber' | 'pageSize' | 'lastPageNumber' | 'totalCount',
  number
>;

interface PagedResponse<T extends {} = { [key: string]: any }> {
  data: T[];
  links: Links;
  meta: Meta;
}

interface Violation {
  message: string;
  propertyPath: string;
  rootBeanClass: string;
  constraint: string;
}

class Crud {
  private resource: Resource;
  constructor(resource: Resource) {
    this.resource = resource;
  }
  persist(mdl: string, entity: Entity): Promise<Entity> {
    return this.resource('persist')({
      mdl,
      entity,
    });
  }
  delete<K>(mdl: string, id: K): Promise<void> {
    return this.resource('delete')({
      mdl,
      id,
    });
  }
  find(
    req: Pick<Request, 'mdl' | 'id' | 'name' | 'status' | 'where'>
  ): Promise<Entity> {
    return this.resource('find')(req);
  }
  select(
    req: Pick<
      Request,
      | 'mdl'
      | 'id'
      | 'name'
      | 'status'
      | 'where'
      | 'orderBy'
      | 'pageNumber'
      | 'pageSize'
    >
  ): Promise<PagedResponse<Entity>> {
    return this.resource('select')({
      ...req,
    });
  }
  invokeState<K, V extends string>(
    mdl: string,
    id: K,
    status: V
  ): Promise<void> {
    return this.resource('invokestate')({
      mdl,
      id,
      status,
    });
  }
  validate(mdl: string, entity: Entity): Promise<Array<Violation>> {
    return this.resource('validate')({
      mdl,
      entity,
    });
  }
  enumerate(mdl: string): Promise<Array<Enum>> {
    return this.resource('enum')(mdl);
  }
}

export {
  Pagination,
  Entity,
  Enum,
  PredicateType,
  Predicate,
  Sorting,
  Request,
  Links,
  Meta,
  PagedResponse,
  Violation,
  Crud,
};
