# MCP FacturaScripts

TypeScript ESM project for a Model Context Protocol (MCP) server that integrates with FacturaScripts.

## Project Structure

- `src/index.ts` - Main MCP server entry point
- `src/env.ts` - Environment validation using Zod
- `src/facturascripts/client.ts` - Axios-based FacturaScripts API client
- `src/resources/clientes.ts` - MCP resource for clients data

## Configuration

Environment variables (see `.env.example`):
- `FS_BASE_URL` - Base URL of your FacturaScripts instance
- `FS_API_VERSION` - API version (default: 3)
- `FS_API_TOKEN` - API authentication token

## Available Scripts

- `npm run dev` - Run development server with tsx
- `npm run build` - Build TypeScript to dist/
- `npm run start` - Run built server

## MCP Resources

- `facturascripts://clientes?limit={limit}&offset={offset}` - Paginated clients list

Returns JSON format:
```json
{
  "meta": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  },
  "data": [...]
}
```