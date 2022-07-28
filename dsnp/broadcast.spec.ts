import fs from "fs";
import { ParquetWriter } from "@dsnp/parquetjs";
import { transformToParquetjs } from "../helpers/parquet";
import broadcastSchema from "./broadcast";
import * as generators from "@dsnp/test-generators";
import { ParquetModel } from "../types/frequency";

describe("Broadcast Spec", () => {
  it("can build a parquet file", async () => {
    await expect(async () => {
      const [schema, bloom] = transformToParquetjs(broadcastSchema);
      await ParquetWriter.openStream(
        schema,
        {
          write: jest.fn(),
          end: jest.fn(),
        },
        { bloomFilters: bloom }
      );
    }).not.toThrow();
  });

  it("Compressing all columns is best", async () => {
    const defaultSize = await generateParquetTestFileSize(broadcastSchema, 100);

    for (const idx in broadcastSchema) {
      const testSchema = [...broadcastSchema];
      testSchema[idx].compression = "UNCOMPRESSED";
      const uncompressedSize = await generateParquetTestFileSize(testSchema, 100);
      expect(defaultSize).toBeLessThan(uncompressedSize);
    }
  });
});

const generateParquetTestFileSize = async (rawSchema: ParquetModel, count: number): Promise<number> => {
  const [schema, bloom] = transformToParquetjs(rawSchema);
  const path = "./test-broadcast-size.parquet";
  const writer = await ParquetWriter.openFile(schema, path, { bloomFilters: bloom });

  for (let i = 0; i < count; i++) {
    await writer.appendRow({
      announcementType: 2,
      contentHash: generators.generateHash(),
      fromId: generators.randInt(10000000),
      url: `https://www.imadapp.com/data/posts/${generators.generateHash()}`,
    });
  }
  await writer.close();
  const size = fs.statSync(path).size;
  fs.rmSync(path);
  return size;
};
