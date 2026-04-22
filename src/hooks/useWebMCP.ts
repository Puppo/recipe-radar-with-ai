import type { DependencyList } from "react";
import { useEffect } from "react";
import type { z } from "zod";
import { toJsonSchema, type JsonSchemaObject } from "../utils/webmcp";

interface ModelContextClient {
  requestUserInteraction(callback: () => Promise<unknown>): Promise<unknown>;
}

interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

type InferInputArgs<T> = T extends z.ZodTypeAny
  ? z.infer<T>
  : Record<string, unknown>;
type InferOutputResult<T> = T extends z.ZodTypeAny ? z.infer<T> : unknown;

export interface WebMCPTool<
  TInputSchema extends z.ZodTypeAny | undefined = undefined,
  TOutputSchema extends z.ZodTypeAny | undefined = undefined,
> {
  name: string;
  description: string;
  inputSchema?: TInputSchema;
  outputSchema?: TOutputSchema;
  annotations?: ToolAnnotations;
  execute: (
    args: InferInputArgs<TInputSchema>,
    client: ModelContextClient,
  ) =>
    | InferOutputResult<TOutputSchema>
    | Promise<InferOutputResult<TOutputSchema>>;
}

interface NativeTool {
  name: string;
  description: string;
  inputSchema?: JsonSchemaObject;
  outputSchema?: JsonSchemaObject;
  annotations?: ToolAnnotations;
  execute: (
    args: Record<string, unknown>,
    client: ModelContextClient,
  ) => unknown;
}

type RegisterToolWithSignal = (
  tool: NativeTool,
  options?: { signal: AbortSignal },
) => void;

export function useWebMCP<
  TInputSchema extends z.ZodTypeAny | undefined = undefined,
  TOutputSchema extends z.ZodTypeAny | undefined = undefined,
>(
  tool: WebMCPTool<TInputSchema, TOutputSchema>,
  deps: DependencyList = [],
): void {
  useEffect(() => {
    const modelContext = navigator.modelContext;
    if (!modelContext) {
      console.warn(
        `[useWebMCP] navigator.modelContext is unavailable; tool "${tool.name}" was not registered.`,
      );
      return;
    }

    const controller = new AbortController();
    const registerTool = modelContext.registerTool.bind(
      modelContext,
    ) as RegisterToolWithSignal;

    const nativeTool: NativeTool = {
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
        ? toJsonSchema(tool.inputSchema)
        : undefined,
      outputSchema: tool.outputSchema
        ? toJsonSchema(tool.outputSchema)
        : undefined,
      annotations: tool.annotations,
      execute: tool.execute as NativeTool["execute"],
    };

    try {
      registerTool(nativeTool, { signal: controller.signal });
      console.log(`[useWebMCP] Registered tool "${tool.name}" successfully.`);
    } catch (error) {
      console.error(
        `[useWebMCP] Failed to register tool "${tool.name}":`,
        error,
      );
      return;
    }

    return () => {
      try {
        modelContext.unregisterTool?.(tool.name);
      } catch {
        // Older runtimes may throw if the tool was already cleaned up; ignore.
      }
      controller.abort();
      console.log(`[useWebMCP] Unregistered tool "${tool.name}".`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
