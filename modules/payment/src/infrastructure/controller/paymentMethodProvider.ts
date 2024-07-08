import {DatabaseAccessor} from '@yggdrasil-template/base';
import {MethodProviderDbFunctions} from '../../application/functions';
import * as M from '../models/paymentMethodProvider';

export function getMethodProviderDbFunctions(db: DatabaseAccessor): MethodProviderDbFunctions {
  return {
    insertMethodProvider(providerType: string, account: string) {
      return M.insertPaymentMethodProvider(db(), providerType, account);
    },
    setMethodProviderEnabled(id: number, enabled: boolean) {
      return M.setEnabled(db(), id, enabled);
    },
    updateMethodProviderAccount(id: number, account: string) {
      return M.updateAccount(db(), id, account);
    },
    findMethodProviderById(id: number) {
      return M.findById(db(), id);
    },
    getAllEnabledMethodProviders() {
      return M.getAllEnabled(db());
    },
    getAllEnabledMethodProvidersByType(providerType: string) {
      return M.getAllEnabledByProviderType(db(), providerType);
    },
    deleteMethodProvider(id: number) {
      return M.deleteById(db(), id);
    },
  }
}