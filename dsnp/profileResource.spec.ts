import profileResourceSchema from "./profileResource.js";
import avro from "avro-js";

describe("Profile Resource Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(profileResourceSchema);
    expect(parsed).toBeDefined();
  });

  it("Can buffer and unbuffer", () => {
    const parsed = avro.parse(profileResourceSchema);
    const obj = {
      type: 1,
      cid: "bafkreifjjcie6lypi6ny7amxnfftagclbuxndqonfipmb64f2km2devei4",
      length: 300,
    };
    const buf = parsed.toBuffer(obj);
    expect(buf).toHaveLength(63);
    const output = parsed.fromBuffer(buf);
    expect(output).toMatchObject(obj);
  });
});
