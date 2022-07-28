import { ParquetSchema } from "@dsnp/parquetjs";
import { FrequencyParquetType, ParquetModel } from "../types/frequency";

type BloomFilterColumn = { column: string };

const convertColumnType = (columnType: FrequencyParquetType): string => {
  if (typeof columnType === "string") {
    switch (columnType) {
      case "STRING":
        return "UTF8";
      default:
        return columnType;
    }
  }
  if ("INTEGER" in columnType) {
    // ParquetJs uses the old format still
    return `${columnType.INTEGER.sign ? "" : "U"}INT_${columnType.INTEGER.bit_width}`;
  }
  throw new Error("Not currently supported in transformation");
};

export const transformToParquetjs = (frequencySchema: ParquetModel): [ParquetSchema, BloomFilterColumn[]] => {
  const schema = Object.fromEntries(
    frequencySchema.map((column) => {
      return [
        column.name,
        {
          type: convertColumnType(column.column_type),
          compression: column.compression,
          statistics: false,
        },
      ];
    })
  );
  const bloomFilters = frequencySchema.map((x) => (x.bloom_filter ? { column: x.name } : null)).filter((x) => !!x);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return [new ParquetSchema(schema as any), bloomFilters];
};
