import {Cart, Production, ProductionStockChange} from './dto';
import {TaskOption} from 'fp-ts/TaskOption';

export interface DbFunctions {
  insertProduction<C>(productionItem: Omit<Production<C>, 'id'>): TaskOption<Production<C>>;
  listAllProductions(limit: number, offset: number): TaskOption<Production<unknown>[]>;
  findProductionById<C>(id: number): TaskOption<Production<C>>;
  findProductionByExactName(exactName: string): TaskOption<Production<unknown>[]>;
  findProductionByFuseName(fuseName: string, limit: number, offset: number): TaskOption<Production<unknown>[]>;
  findProductionByLabelContains(labels: string[], limit: number, offset: number): TaskOption<Production<unknown>[]>;
  updateProductionStock(id: number, stock: number, lockedStock: number): TaskOption<void>;
  updateProduction<C>(id: number, productionItem: Omit<Production<C>, 'id'>): TaskOption<Production<C>>;
  deleteProduction(id: number): TaskOption<void>;
  productionStockChangeByBatch(changes: readonly ProductionStockChange[]): TaskOption<void>
}

export interface MainFunctions {
  addCreateOrderEventListener: (callback: (cart: Cart) => TaskOption<void>) => (cart: Cart) => TaskOption<void>;
  addOrderFulfilledEventListener: (callback: (cart: Cart) => TaskOption<void>) => (cart: Cart) => TaskOption<void>;
  addOrderCanceledEventListener: (callback: (cart: Cart) => TaskOption<void>) => (cart: Cart) => TaskOption<void>;
}