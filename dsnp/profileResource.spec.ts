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
      cid: Buffer.from("01551220a948904f2f0f479b8f8197694b30184b0d2ed1c1cd2a1ec0fb85d299a192a447", "hex"),
      length: 300,
    };
    const buf = parsed.toBuffer(obj);
    expect(buf).toHaveLength(40);
    const output = parsed.fromBuffer(buf);
    expect(output).toMatchObject(obj);
  });
});
