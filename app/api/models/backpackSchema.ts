import { z } from 'zod';

// Validation schema for backpack data
export const backpackSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  brand: z.string().min(3, { message: "Brand must be at least 3 characters" }),
  material: z.string().min(3, { message: "Material must be at least 3 characters" }),
  weight: z.number().positive({ message: "Weight must be a positive number" }),
  color: z.string().optional(),
});

// Type derived from the schema
export type BackpackSchemaType = z.infer<typeof backpackSchema>;

// Partial schema for updates (all fields optional)
export const backpackUpdateSchema = backpackSchema.partial(); 