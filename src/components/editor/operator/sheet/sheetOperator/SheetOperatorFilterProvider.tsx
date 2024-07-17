import { useAtomValue } from 'jotai'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { OperatorInfo as ModelsOperator, OPERATORS } from 'models/operator'
import { favOperatorAtom } from 'store/useFavOperators'

import { useSheet } from '../SheetProvider'
import { defaultProfFilter } from './ProfClassification'
import { defaultPagination } from './ShowMore'

type OperatorInfo = ModelsOperator

export enum DEFAULTPROFID {
  ALL = 'allProf',
  FAV = 'favProf',
  OTHERS = 'othersProf',
}

export enum DEFAULTSUBPROFID {
  ALL = 'allSubProf',
  SELECTED = 'selectedProf',
}

export interface ProfFilter {
  selectedProf: [string, string]
}

export interface RarityFilter {
  selectedRarity: number[]
  reverse: boolean
}

export interface PaginationFilter {
  size: number
  current: number
}

interface OperatorFilterProviderProp {
  children: ReactNode
}

type UseState<T> = [T, Dispatch<SetStateAction<T>>]

type OperatorFilterProviderData = {
  usePaginationFilterState: UseState<PaginationFilter>
  useProfFilterState: UseState<ProfFilter>
  // useRarityFilterState: UseState<RarityFilter>
  operatorFiltered: {
    data: OperatorInfo[]
    meta: {
      dataTotal: number
    }
  }
}

const OperatorFilterContext = createContext<OperatorFilterProviderData>(
  {} as OperatorFilterProviderData,
)

export const OperatorFilterProvider: FC<OperatorFilterProviderProp> = ({
  children,
}) => {
  const [paginationFilter, setPaginationFilter] =
    useState<PaginationFilter>(defaultPagination)
  const [profFilter, setProfFilter] = useState<ProfFilter>(defaultProfFilter)

  return (
    <OperatorFilterContext.Provider
      value={{
        usePaginationFilterState: [paginationFilter, setPaginationFilter],
        useProfFilterState: [profFilter, setProfFilter],
        // useRarityFilterState: []
        operatorFiltered: useOperatorFiltered(profFilter, paginationFilter),
      }}
    >
      {children}
    </OperatorFilterContext.Provider>
  )
}

export const useOperatorFilterProvider = () => useContext(OperatorFilterContext)

const generateCustomizedOperInfo = (name: string): OperatorInfo => ({
  id: 'customized-' + name,
  name,
  prof: 'TOKEN',
  subProf: 'customized',
  alias: 'customized-operator',
  rarity: 0,
  alt_name: 'custormized operator named' + name,
})

const useOperatorFiltered = (
  profFilter: ProfFilter,
  paginationFilter: PaginationFilter,
) => {
  // Priority: prof > sub prof > rarity/rarityReverse
  // filterResult init and prof filter about
  const filterResult = useProfFilterHandle(profFilter)
  //   rarity about

  const dataTotal = filterResult.length
  //   pagination about

  //   filterResult
  //   console.log(filterResult)
  return {
    // return data after being paginated
    data: paginationFilterHandle(paginationFilter, filterResult),
    meta: {
      dataTotal,
    },
  }
}

const useProfFilterHandle = (
  profFilter: ProfFilter = {
    selectedProf: [DEFAULTPROFID.ALL, DEFAULTSUBPROFID.ALL],
  },
) => {
  const {
    selectedProf: [prof, subProf],
  } = profFilter
  const { existedOperators } = useSheet()

  const favOperators = useAtomValue(favOperatorAtom)
  const customizedOperatorsInfo = useMemo<OperatorInfo[]>(
    () =>
      existedOperators
        .map(({ name }) =>
          OPERATORS.find(({ name: OPERName }) => OPERName === name)
            ? undefined
            : generateCustomizedOperInfo(name),
        )
        .filter((item) => !!item),
    [existedOperators],
  )
  const favOperatorsInfo = useMemo<OperatorInfo[]>(
    () =>
      favOperators.map(
        ({ name }) =>
          OPERATORS.find(({ name: OPERName }) => OPERName === name) ||
          generateCustomizedOperInfo(name),
      ),
    [favOperators],
  )

  let operatorsFilteredByProf: OperatorInfo[] = []
  const OPERATORSWITHINCUSTOMIZED = [...OPERATORS, ...customizedOperatorsInfo]
  switch (prof) {
    case DEFAULTPROFID.ALL: {
      operatorsFilteredByProf = OPERATORSWITHINCUSTOMIZED
      break
    }
    case DEFAULTPROFID.FAV: {
      operatorsFilteredByProf = favOperatorsInfo
      break
    }
    case DEFAULTPROFID.OTHERS: {
      operatorsFilteredByProf = OPERATORSWITHINCUSTOMIZED.filter(
        ({ prof }) => prof === 'TOKEN',
      )
      break
    }

    default: {
      operatorsFilteredByProf = OPERATORSWITHINCUSTOMIZED.filter(
        ({ prof: OPERProf }) => OPERProf === prof,
      )
      break
    }
  }

  switch (subProf) {
    case DEFAULTSUBPROFID.ALL: {
      return operatorsFilteredByProf
    }
    case DEFAULTSUBPROFID.SELECTED: {
      return operatorsFilteredByProf.filter(
        ({ name }) =>
          !!existedOperators.find(
            ({ name: existedName }) => existedName === name,
          ),
      )
    }
    default: {
      return operatorsFilteredByProf.filter(
        ({ subProf: operatorSubProf }) => operatorSubProf === subProf,
      )
    }
  }
}

const paginationFilterHandle = (
  { current, size }: PaginationFilter,
  originData: OperatorInfo[] = OPERATORS,
) => originData.slice(0, current * size)