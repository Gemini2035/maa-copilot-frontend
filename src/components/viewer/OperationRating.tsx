import { Icon, IconSize } from '@blueprintjs/core'
import { Popover2InteractionKind, Tooltip2 } from '@blueprintjs/popover2'

import clsx from 'clsx'
import { FC } from 'react'
import Rating from 'react-rating'

import { Operation } from 'models/operation'
import { ratingLevelToString } from 'models/rating'

type PickedOperation = Pick<
  Operation,
  'notEnoughRating' | 'ratingRatio' | 'ratingLevel' | 'like' | 'dislike'
>

const GetLevelDescription = (operation: PickedOperation) => {
  return `有${Math.round(
    (operation.like / (operation.like + operation.dislike)) * 100,
  )}%的人对本作业点了个赞（${operation.like}/${
    operation.like + operation.dislike
  }）`
}

export const OperationRating: FC<{
  operation: PickedOperation
  layout?: 'horizontal' | 'vertical'
  className?: string
}> = ({ operation, layout = 'vertical', className }) => {
  return (
    <div
      className={clsx(
        'flex',
        layout === 'horizontal' && 'flex-row-reverse',
        layout === 'vertical' && 'flex-col',
        className,
      )}
    >
      {!operation.notEnoughRating && (
        <Rating
          initialRating={operation.ratingRatio * 5}
          fullSymbol={
            <Icon
              size={
                layout === 'horizontal' ? IconSize.STANDARD : IconSize.LARGE
              }
              icon="star"
              className="text-yellow-500"
            />
          }
          placeholderSymbol={
            <Icon
              size={
                layout === 'horizontal' ? IconSize.STANDARD : IconSize.LARGE
              }
              icon="star"
              className="text-yellow-500"
            />
          }
          emptySymbol={
            <Icon
              size={
                layout === 'horizontal' ? IconSize.STANDARD : IconSize.LARGE
              }
              icon="star-empty"
              className="text-zinc-600"
            />
          }
          readonly
        />
      )}
      <div
        className={clsx(
          'text-sm text-zinc-500',
          layout === 'horizontal' && !operation.notEnoughRating && 'mr-1.5',
        )}
      >
        <Tooltip2
          className="!inline-block !mt-0"
          interactionKind={Popover2InteractionKind.HOVER}
          content={GetLevelDescription(operation)}
          position="bottom-left"
        >
          {operation.notEnoughRating
            ? layout === 'vertical'
              ? '还没有足够的评分'
              : '评分不足'
            : ratingLevelToString(operation.ratingLevel)}
        </Tooltip2>
      </div>
    </div>
  )
}
