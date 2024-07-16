import { Divider, H4, H5 } from '@blueprintjs/core'

import clsx from 'clsx'
import {
  Dispatch,
  FC,
  ImgHTMLAttributes,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { PROFESSIONS } from 'models/operator'

import {
  DEFAULTPROFID,
  DEFAULTSUBPROFID,
  ProfFilter as ProfFilterOuter,
} from './OperatorFilter'

const formattedProfessions = [
  {
    id: DEFAULTPROFID.ALL,
    name: '全部',
    sub: [],
  },
  {
    id: DEFAULTPROFID.FAV,
    name: '收藏',
    sub: [],
  },
  ...PROFESSIONS,
  {
    id: DEFAULTPROFID.OTHERS,
    name: '其它',
    sub: [],
  },
]

type ProfFilter = ProfFilterOuter

export interface ProfClassificationProp {
  profFilter: ProfFilter
  setProfFilter: Dispatch<SetStateAction<ProfFilter>>
}

export const ProfClassification: FC<ProfClassificationProp> = ({
  profFilter: { selectedProf },
  setProfFilter,
}) => {
  const subProfs = useMemo(() => {
    return [
      { id: DEFAULTSUBPROFID.ALL, name: '全部' },
      { id: DEFAULTSUBPROFID.SELECTED, name: '已选择' },
      ...(formattedProfessions.find(({ id }) => id === selectedProf[0])?.sub ||
        []),
    ]
  }, [selectedProf])

  //   const ActionList = (
  //     <div className="absolute bottom-0">
  //       <Popover2
  //         content={
  //           <RaritySelector
  //             {...{
  //               operatorRarity,
  //               setOperatorRarity,
  //               rarityReverse,
  //               setRarityReverse,
  //             }}
  //           />
  //         }
  //       >
  //         <Button minimal icon="filter-list" />
  //       </Popover2>
  //       <Button
  //         minimal
  //         icon="circle"
  //         disabled={
  //           !operatorsGroupedBySubProf.some(({ name }) =>
  //             checkOperatorSelected(name),
  //           )
  //         }
  //         title={`取消选择全部${existedOperators.length}位干员`}
  //         onClick={cancelAll}
  //       />
  //       <Button
  //         minimal
  //         icon="selection"
  //         title={`全选${operatorsGroupedBySubProf.length}位干员`}
  //         disabled={operatorsGroupedBySubProf.every(({ name }) =>
  //           checkOperatorSelected(name),
  //         )}
  //         onClick={selectAll}
  //       />
  //       <Button
  //         minimal
  //         icon="symbol-triangle-up"
  //         disabled={!backToTop}
  //         title={backToTop ? '回到顶部' : undefined}
  //         onClick={resetPaginationState}
  //       />
  //     </div>
  //   )

  return (
    <div className="flex flex-row-reverse h-screen sticky top-0 relative">
      <ul className="h-full flex flex-col w-6 sm:w-12">
        {formattedProfessions.map(({ id, name }) => (
          <ProfIcon
            key={id}
            profId={id}
            name={name}
            selected={selectedProf.includes(id)}
            onProfClick={() => {
              console.log('111', id)
              setProfFilter((prev) => ({
                ...prev,
                selectedProf: [id, DEFAULTSUBPROFID.ALL],
              }))
            }}
          />
        ))}
      </ul>
      <Divider className="mr-0" />
      <div className="h-full flex flex-col justify-center items-end absolute right-full sm:relative sm:left-0">
        <ul>
          {subProfs.map(({ id, name }) => (
            <li key={id}>
              <H4
                className={clsx(
                  'truncate cursor-pointer my-3 opacity-50 hover:underline hover:opacity-90',
                  selectedProf.includes(id) && '!opacity-100 underline',
                  name.length > 3 && '!text-base',
                )}
                onClick={() =>
                  setProfFilter(({ selectedProf, ...rest }) => ({
                    selectedProf: [selectedProf[0], id],
                    ...rest,
                  }))
                }
              >
                {name}
              </H4>
            </li>
          ))}
        </ul>
        {/* {ActionList} */}
      </div>
    </div>
  )
}

interface ProfIconProp extends ImgHTMLAttributes<HTMLImageElement> {
  name: string
  profId: string
  selected: boolean
  onProfClick: () => void
}

const ProfIcon: FC<ProfIconProp> = ({
  name,
  profId,
  selected,
  onProfClick,
  ...restImgProps
}) => {
  const [imgError, setImgError] = useState(false)

  return (
    <li
      className="grow cursor-pointer relative flex justify-center items-center"
      title={name}
      role="presentation"
      onClick={onProfClick}
    >
      {imgError ? (
        <H5 className="!text-xs sm:!text-base truncate">{name}</H5>
      ) : (
        <img
          {...restImgProps}
          className="invert dark:invert-0"
          src={'/assets/prof-icons/' + profId + '.png'}
          alt=""
          onError={() => setImgError(true)}
          title={name}
        />
      )}
      {selected && (
        <div className="h-full w-1 bg-black dark:bg-white absolute top-0 right-full rounded" />
      )}
    </li>
  )
}