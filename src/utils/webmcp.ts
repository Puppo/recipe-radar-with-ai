import type { ZodSchemaObject } from "@mcp-b/react-webmcp";
import { z } from "zod";

export function toJsonSchema<TInput extends z.ZodTypeAny>(
  value: TInput,
): ZodSchemaObject {
  return z.toJSONSchema(value) as ZodSchemaObject;
}
