// Dynamically import PrismaClient from the generated CommonJS module
const prismaModule = await import('./node_modules/.prisma/client/index.js')
export const { PrismaClient } = prismaModule

// Re-export all other exports
export * from './node_modules/.prisma/client/index.js'
