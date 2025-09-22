import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  mandatoryString: z.string(),
  optionalBoolean: z.boolean().nullable().optional(),
});

export type Item = z.infer<typeof ItemSchema>;

export const GetItemsSchema = z.object({
  data: z.object({
    getItems: z.array(ItemSchema),
  }),
});

export const GetItemSchema = z.object({
  data: z.object({
    getItem: ItemSchema.nullable(),
  }),
});

export type GraphQLError = {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};