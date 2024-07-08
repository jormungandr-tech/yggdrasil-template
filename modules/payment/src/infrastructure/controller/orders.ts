import * as M from '../models/orders';
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {OrderDbFunctions} from '../../application/functions';

export function getOrderDbFunctions(db: DatabaseAccessor): OrderDbFunctions {
  return {
    insertOrder: (userId, amount, productName, content) => M.insertOrder(db(), userId, amount, productName, content),
    findOrderByOrderId: orderId => M.findOrderByOrderId(db(), orderId),
    findOrderByUserId: userId => M.findOrderByUserId(db(), userId),
    updateOrderStatus: (orderId, status) => M.updateOrderStatus(db(), orderId, status),
    fakeDeleteOrder: orderId => M.fakeDeleteOrder(db(), orderId),
    deleteOrder: orderId => M.deleteOrderByOrderId(db(), orderId)
  }
}