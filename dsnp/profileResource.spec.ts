import profileResourceSchema from "./profileResource.js";
import avro from "avro-js";

describe("Profile Resource Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(profileResourceSchema);
    expect(parsed).toBeDefined();
  });
});
