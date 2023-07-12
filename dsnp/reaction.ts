import { FrequencyParquetSchema } from "../types/frequency.js";

const reaction: FrequencyParquetSchema = [
  {
    name: "announcementType",
    column_type: {
      INTEGER: {
        bit_width: 32,
        sign: true,
      },
    },
    compression: "GZIP",
    bloom_filter: false,
  },
  {
    name: "emoji",
    column_type: "STRING",
    compression: "GZIP",
    bloom_filter: true,
  },
  {
    name: "apply",
    column_type: {
      INTEGER: {
        bit_width: 8,
        sign: false,
      },
    },
    compression: "GZIP",
    bloom_filter: false,
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
    name: "inReplyTo",
    column_type: "STRING",
    compression: "GZIP",
    bloom_filter: true,
  },
];

export default reaction;
