export default {
  namespace: "org.dsnp",
  name: "ProfileResource",
  type: "record",
  doc: "Profile-linked resource",
  fields: [
    {
      name: "type",
      type: "int",
      doc: "Type of resource",
    },
    {
      name: "cid",
      type: "string",
      doc: "Content IDentifier of resource",
    },
    {
      name: "length",
      type: "int",
      doc: "Length of document in bytes",
    },
  ],
};
