import { NextResponse } from 'next/server';
import type { z } from 'zod';
import { idParamSchema } from './schemas';

export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown,
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join('; ');
    return {
      success: false,
      response: NextResponse.json({ error: message }, { status: 400 }),
    };
  }
  return { success: true, data: result.data };
}

export function parseId(
  id: string,
): { success: true; data: number } | { success: false; response: NextResponse } {
  return parseBody(idParamSchema, id);
}
