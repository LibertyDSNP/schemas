import { ParquetModel } from "../types/frequency";

const broadcast: ParquetModel = [
  {
    name: "announcementType",
    column_type: {
      INTEGER: {
        bit_width: 16,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: false,
  },
  {
    name: "contentHash",
    column_type: "BYTE_ARRAY",
    compression: "GZIP",
    bloom_filter: true,
  },
  {
    name: "fromId",
    column_type: {
      INTEGER: {
        bit_width: 64,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: true,
  },
  {
    name: "url",
    column_type: "STRING",
    compression: "GZIP",
    bloom_filter: false,
  },
];

export default broadcast;
