import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      sku: a.string().required(),
      category: a.string(),
      price: a.float().required(),
      stock: a.integer().required(),
      minStock: a.integer().required(),
    })
    .authorization((allow) => [allow.owner()]),

  StockMovement: a
    .model({
      productName: a.string().required(),
      type: a.enum(["entrada", "salida"]),
      quantity: a.integer().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});