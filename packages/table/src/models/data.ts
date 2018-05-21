export type DataMode = 'csv' | 'tsv' | 'markdown';
export interface ParsedData {
  data: any[][]|string;
  meta: {
    isHTML: boolean;
    is2DArray: boolean;
  }
}
