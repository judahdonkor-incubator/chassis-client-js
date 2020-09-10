import { Crud } from './crud';
import { Exchange } from './xchg';
import { Resource, Rs } from './rs';

class Chassis {
  rs: Rs;
  crud: Crud;
  xchg: Exchange;
  constructor(resource: Resource) {
    this.rs = new Rs(resource);
    this.crud = new Crud(resource);
    this.xchg = new Exchange(resource);
  }
}

export default (resource: Resource) => new Chassis(resource);

export { Rs, Crud, Exchange, Chassis };
