export type TLcovDataItem = {
  found: number
  hit: number
  details: {
    hit: number
    line: number
  }[]
}

export type TLcovData = {
  lines: TLcovDataItem
  functions: TLcovDataItem
  branches: TLcovDataItem
  title: string
  file: string
}

export type TGroupedFilesLcovData = {
  file: string
  lines: number[]
}

export type TGroupedLinesLcovData = {
  file: string
  lines: (number | number[])[]
}
