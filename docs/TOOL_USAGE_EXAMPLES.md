# Tool Usage Examples - MCP FacturaScripts

This document provides comprehensive usage examples for specialized business tools, helping AI assistants understand how to use them effectively.

## 🎯 Specialized Business Tool: `get_facturas_cliente_por_cifnif`

### Overview
Search for customer invoices by CIF/NIF (Spanish tax identification number). This tool performs a two-step operation:
1. **Find Customer**: Search for customer by CIF/NIF
2. **Get Invoices**: Retrieve filtered invoices for that customer

### Parameters
- **`cifnif`** (required): Customer's tax ID (CIF/NIF)
- **`filter`** (optional): Additional filters for invoices
- **`limit`** (optional): Maximum records (1-1000, default: 50)
- **`offset`** (optional): Skip records for pagination (default: 0)
- **`order`** (optional): Sort order (e.g., "fecha:desc")

---

## 📋 Usage Examples

### 1. Basic Search
**Scenario**: Find all invoices for a customer with CIF "12345678A"

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "12345678A"
})
```

**Expected Response**:
```json
{
  "clientInfo": {
    "cifnif": "12345678A",
    "codcliente": "CLI001",
    "nombre": "Empresa Ejemplo S.L."
  },
  "invoices": {
    "meta": { "total": 15, "limit": 50, "offset": 0, "hasMore": false },
    "data": [
      {
        "codigo": "FAC001",
        "numero": "F-2024-001",
        "codcliente": "CLI001",
        "fecha": "2024-01-15",
        "total": 1250.75,
        "pagada": false
      }
    ]
  }
}
```

### 2. Date Range Filtering
**Scenario**: Find invoices from 2024 for a specific customer

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "87654321B",
  filter: "fecha_gte:2024-01-01,fecha_lte:2024-12-31",
  order: "fecha:desc"
})
```

**Use Case**: Annual invoice review, tax preparation, audit trails

### 3. Amount-Based Filtering
**Scenario**: Find high-value unpaid invoices (>500€)

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "11111111C",
  filter: "total_gt:500.00,pagada:false",
  order: "total:desc",
  limit: 20
})
```

**Use Case**: Collections management, credit control, outstanding payments

### 4. Recent Invoices with Pagination
**Scenario**: Get latest 10 invoices for a customer

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "22222222D",
  filter: "fecha_gte:2024-01-01",
  order: "fecha:desc",
  limit: 10,
  offset: 0
})
```

**Use Case**: Customer service inquiries, recent transaction history

### 5. Complex Multi-Filter Query
**Scenario**: Find medium-value paid invoices from Q1 2024

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "33333333E",
  filter: "fecha_gte:2024-01-01,fecha_lte:2024-03-31,total_gt:100.00,total_lt:1000.00,pagada:true",
  order: "fecha:asc"
})
```

**Use Case**: Financial analysis, revenue tracking, payment pattern analysis

### 6. Status-Based Filtering
**Scenario**: Find all pending (unpaid) invoices

```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "44444444F",
  filter: "pagada:false,activo:1",
  order: "vencimiento:asc"
})
```

**Use Case**: Accounts receivable, overdue invoice tracking

---

## 🔍 Advanced Filter Examples

### Date Filters
- **`fecha_gte:2024-01-01`** - Invoices from January 1, 2024 onwards
- **`fecha_lt:2024-12-31`** - Invoices before December 31, 2024
- **`vencimiento_lte:2024-01-15`** - Due date on or before January 15, 2024

### Amount Filters
- **`total_gt:1000.00`** - Invoices greater than 1,000€
- **`total_gte:500.00,total_lte:2000.00`** - Invoices between 500€ and 2,000€
- **`totaliva_gt:100.00`** - Tax amount greater than 100€

### Status Filters
- **`pagada:true`** - Only paid invoices
- **`pagada:false`** - Only unpaid invoices
- **`activo:1`** - Only active invoices

### Text Search Filters
- **`observaciones_like:urgent`** - Invoices with "urgent" in observations
- **`numero_like:2024`** - Invoice numbers containing "2024"

### Sorting Options
- **`fecha:desc`** - Newest first
- **`total:asc`** - Lowest amount first
- **`vencimiento:asc`** - Earliest due date first
- **`numero:desc`** - Reverse invoice number order

---

## ⚠️ Error Scenarios

### 1. Customer Not Found
```typescript
get_facturas_cliente_por_cifnif({
  cifnif: "NONEXISTENT"
})
```

**Response**:
```json
{
  "error": "Client not found",
  "message": "No se encontró ningún cliente con CIF/NIF: NONEXISTENT",
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

### 2. Invalid Client Code
**Scenario**: Customer found but has invalid/missing client code

**Response**:
```json
{
  "error": "Client code not found", 
  "message": "El cliente encontrado no tiene código de cliente válido",
  "clientData": { /* customer data */ },
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

### 3. API Connection Error
**Response**:
```json
{
  "error": "Failed to fetch invoices by CIF/NIF",
  "message": "Connection timeout",
  "cifnif": "12345678A",
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

---

## 🎯 Business Use Cases

### Customer Service
```typescript
// "Can you show me my recent invoices?"
get_facturas_cliente_por_cifnif({
  cifnif: "customer_cif_here",
  filter: "fecha_gte:2024-01-01",
  order: "fecha:desc",
  limit: 10
})
```

### Collections Management
```typescript
// Find overdue invoices
get_facturas_cliente_por_cifnif({
  cifnif: "customer_cif_here",
  filter: "pagada:false,vencimiento_lt:2024-01-01",
  order: "vencimiento:asc"
})
```

### Financial Analysis
```typescript
// Quarterly revenue from specific customer
get_facturas_cliente_por_cifnif({
  cifnif: "customer_cif_here",
  filter: "fecha_gte:2024-01-01,fecha_lte:2024-03-31,pagada:true",
  order: "fecha:asc"
})
```

### Audit & Compliance
```typescript
// All transactions for audit period
get_facturas_cliente_por_cifnif({
  cifnif: "customer_cif_here",
  filter: "fecha_gte:2024-01-01,fecha_lte:2024-12-31",
  order: "fecha:asc",
  limit: 1000
})
```

---

## 💡 Tips for AI Assistants

### 1. **Parameter Validation**
- Always validate CIF/NIF format before calling
- Use appropriate date formats (YYYY-MM-DD)
- Check numeric values for amounts

### 2. **Error Handling**
- Check for "Client not found" errors
- Handle API timeouts gracefully  
- Provide meaningful error messages to users

### 3. **Performance Optimization**
- Use pagination for large result sets
- Apply filters to reduce response size
- Sort by relevant fields for user context

### 4. **User Experience**
- Explain what you're searching for
- Summarize results meaningfully
- Offer to refine search if too many/few results

### 5. **Data Privacy**
- Be mindful of sensitive financial data
- Don't log or store invoice details unnecessarily
- Respect user privacy and data protection regulations

---

## 🔄 Pagination Example

For customers with many invoices, use pagination:

```typescript
// Page 1 (first 25 invoices)
get_facturas_cliente_por_cifnif({
  cifnif: "12345678A",
  limit: 25,
  offset: 0,
  order: "fecha:desc"
})

// Page 2 (next 25 invoices) 
get_facturas_cliente_por_cifnif({
  cifnif: "12345678A", 
  limit: 25,
  offset: 25,
  order: "fecha:desc"
})
```

Check `hasMore` in the response to determine if there are additional pages.

---

*This documentation helps AI assistants understand the tool's capabilities and use it effectively for various business scenarios.*