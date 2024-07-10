import {DbFunctions, MainFunctions} from '../application/functions';
import {Cart, CartItem, ProductionStockChange} from '../application/dto';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import {pipe} from 'fp-ts/function';

function addCreateOrderEventListener(dbf: DbFunctions, callback: (cart: Cart) => TO.TaskOption<void>): (cart: Cart) => TO.TaskOption<void> {
  return (cart: Cart): TO.TaskOption<void> => {
    const items = RA.fromArray(cart.items)
    return pipe(
      items,
      RA.map<CartItem<unknown>, ProductionStockChange>((cartItem) => ({
        id: cartItem.production.id,
        stock: -cartItem.amount,
        lockedStock: cartItem.amount
      })),
      dbf.productionStockChangeByBatch,
      TO.flatMap(() => callback(cart))
    )
  }
}

function addOrderFulfilledEventListener(dbf: DbFunctions, callback: (cart: Cart) => TO.TaskOption<void>): (cart: Cart) => TO.TaskOption<void> {
  return (cart: Cart): TO.TaskOption<void> => {
    const items = RA.fromArray(cart.items)
    return pipe(
      items,
      RA.map<CartItem<unknown>, ProductionStockChange>((cartItem) => ({
        id: cartItem.production.id,
        stock: 0,
        lockedStock: -cartItem.amount
      })),
      dbf.productionStockChangeByBatch,
      TO.flatMap(() => callback(cart))
    )
  }
}

function addOrderCanceledEventListener(dbf: DbFunctions, callback: (cart: Cart) => TO.TaskOption<void>): (cart: Cart) => TO.TaskOption<void> {
  return (cart: Cart): TO.TaskOption<void> => {
    const items = RA.fromArray(cart.items)
    return pipe(
      items,
      RA.map<CartItem<unknown>, ProductionStockChange>((cartItem) => ({
        id: cartItem.production.id,
        stock: cartItem.amount,
        lockedStock: -cartItem.amount
      })),
      dbf.productionStockChangeByBatch,
      TO.flatMap(() => callback(cart))
    )
  }
}

export function getMainFunctions(dbf: DbFunctions): MainFunctions {
  return {
    addCreateOrderEventListener: (callback) => addCreateOrderEventListener(dbf, callback),
    addOrderFulfilledEventListener: (callback) => addOrderFulfilledEventListener(dbf, callback),
    addOrderCanceledEventListener: (callback) => addOrderCanceledEventListener(dbf, callback)
  }
}