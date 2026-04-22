import { z } from "zod";

export type JsonSchemaObject<TInput extends z.ZodTypeAny> =
  z.core.ZodStandardJSONSchemaPayload<TInput>;

export function toJsonSchema<TInput extends z.ZodTypeAny>(
  value: TInput,
): JsonSchemaObject<TInput> {
  return z.toJSONSchema(value) as JsonSchemaObject<TInput>;
}
