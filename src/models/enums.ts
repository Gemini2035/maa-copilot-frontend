import { OpRatingLevel } from './operation'
import { Operation } from 'models/operation'

export const OpRatingLevelString: Record<OpRatingLevel, string> = {
  [OpRatingLevel.OverwhelminglyPositive]: '好评如潮',
  [OpRatingLevel.VeryPositive]: '特别好评',
  [OpRatingLevel.Positive]: '好评',
  [OpRatingLevel.MostlyPositive]: '多半好评',
  [OpRatingLevel.Mixed]: '褒贬不一',
  [OpRatingLevel.MostlyNegative]: '多半差评',
  [OpRatingLevel.Negative]: '差评',
  [OpRatingLevel.VeryNegative]: '特别差评',
  [OpRatingLevel.OverwhelminglyNegative]: '差评如潮',
}

export const opRatingLevelString = (operation: Operation) => {
  if (operation.isNotEnoughRating) return '还没有足够的评分'
  return OpRatingLevelString[operation.ratingLevel]
}
