import graphChangeSchema from "./graphChange";
import avro from "avro-js";

describe("Graph Change Schema", () => {
  it("Is Avro", () => {
    const parsed = avro.parse(graphChangeSchema);
    expect(parsed).toBeDefined();
  });
});
