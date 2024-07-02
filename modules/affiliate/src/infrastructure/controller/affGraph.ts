import * as M from '../models/affGraph';
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {AffGraphDbFunctions} from '../../application/functions';

export function getGraphDbFunctions(db: DatabaseAccessor): AffGraphDbFunctions {
  return {
    insertAffiliateRelation: (from, to, reward, rate) => M.insertAffiliateRelation(db(), from, to, reward, rate),
    findAffiliateRelationById: (id) => M.findAffiliateRelationById(db(), id),
    findAffiliateRelationByFrom: (from) => M.findAffiliateRelationByFrom(db(), from),
    findAffiliateRelationByTo: (to) => M.findAffiliateRelationByTo(db(), to),
  };
}