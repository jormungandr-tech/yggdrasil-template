import {DatabaseAccessor} from "@yggdrasil-template/base"
import {DbFunctions} from '../../application/functions';
import * as M from '../models/production'

export function getDbFunctions(db: DatabaseAccessor): DbFunctions {
  return {
    insertProduction: (productionItem) => M.insertProduction(db(), productionItem),
    findProductionById: (id) => M.findProductionById(db(), id),
    findProductionByExactName: (exactName) => M.findProductionByExactName(db(), exactName),
    findProductionByFuseName: (fuseName, limit, offset) => M.findProductionByFuseName(db(), fuseName, limit, offset),
    findProductionByLabelContains: (labels, limit, offset) => M.findProductionByLabelContains(db(), labels, limit, offset),
    updateProductionStock: (id, stock, lockedStock) => M.updateProductionStock(db(), id, stock, lockedStock),
    updateProduction: (id, productionItem) => M.updateProduction(db(), id, productionItem),
    deleteProduction: (id) => M.deleteProductionById(db(), id),
    productionStockChangeByBatch: (changes) => M.productionStockChangeByBatch(db(), changes)
  }
}