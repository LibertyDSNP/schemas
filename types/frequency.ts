// Last updated 2022-07-25
export type ParquetModel = Array<ParquetColumn>;

export type FrequencyParquetType = ParquetBaseType | ParquetStringType | ParquetNumericType | ParquetTemporalType;

interface ParquetColumn {
  name: string;
  column_type: FrequencyParquetType;
  compression: ColumnCompressionCodec;
  bloom_filter: boolean;
}

type ColumnCompressionCodec = "UNCOMPRESSED" | "SNAPPY" | "GZIP" | "LZO" | "BROTLI" | "ZSTD" | "LZ4RAW";

type ParquetBaseType = "BOOLEAN" | "INT32" | "INT64" | "FLOAT" | "DOUBLE" | "BYTE_ARRAY" | "FIXED_LENGTH_BYTE_ARRAY";

type ParquetStringType = "STRING" | "UUID";

type ParquetNumericType = ParquetInteger | ParquetDecimal;

type ParquetInteger = {
  INTEGER: {
    bit_width: number;
    sign: boolean;
  };
};

type ParquetDecimal = {
  DECIMAL: {
    scale: number;
    precision: number;
  };
};

type ParquetTemporalType = "DATE" | "INTERVAL" | ParquetTime | ParquetTimestamp;

type ParquetTime = {
  TIME: {
    is_adjusted_to_utc: boolean;
    unit: ParquetTimeUnit;
  };
};

type ParquetTimestamp = {
  TIMESTAMP: {
    is_adjusted_to_utc: boolean;
    unit: ParquetTimeUnit;
  };
};

type ParquetTimeUnit = "MILLIS" | "MICROS" | "NANOS";
