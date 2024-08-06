import { Button } from '@blueprintjs/core'

import { FC } from 'react'

import {
  defaultPagination,
  useOperatorFilterProvider,
} from '../SheetOperatorFilterProvider'

export interface OperatorBackToTopProp {}

export const OperatorBackToTop: FC<OperatorBackToTopProp> = () => {
  const {
    usePaginationFilterState: [{ current }, setPaginationFilter],
  } = useOperatorFilterProvider()

  return (
    <Button
      minimal
      icon="symbol-triangle-up"
      disabled={current < 3}
      title="回到顶部"
      onClick={() => setPaginationFilter(defaultPagination)}
    />
  )
}
