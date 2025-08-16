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

## 🏆 Specialized Business Tool: `get_productos_mas_vendidos`

### Overview
Generate rankings of best-selling products or services within a specified date period, based on customer invoice line items. This tool performs comprehensive data aggregation:
1. **Date Range Query**: Find all invoices within the specified period
2. **Line Item Aggregation**: Group invoice lines by product (referencia or descripcion)
3. **Sales Analysis**: Sum quantities and revenue for each product
4. **Ranking Generation**: Sort by quantity sold or total revenue

### Parameters
- **`fecha_desde`** (required): Start date of analysis period (YYYY-MM-DD)
- **`fecha_hasta`** (required): End date of analysis period (YYYY-MM-DD)
- **`limit`** (optional): Maximum products in ranking (1-1000, default: 50)
- **`offset`** (optional): Skip products for pagination (default: 0)
- **`order`** (optional): Sort order - "cantidad_total:desc" or "total_facturado:desc" (default: "cantidad_total:desc")

---

## 📈 Usage Examples

### 1. Monthly Best Sellers by Quantity
**Scenario**: Find top 10 products sold in January 2024 by units sold

```typescript
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-01-31",
  limit: 10,
  order: "cantidad_total:desc"
})
```

**Expected Response**:
```json
{
  "period": { "fecha_desde": "2024-01-01", "fecha_hasta": "2024-01-31" },
  "meta": { "total": 45, "limit": 10, "offset": 0, "hasMore": true },
  "data": [
    {
      "referencia": "HOST001",
      "descripcion": "Hosting Básico 1GB",
      "cantidad_total": 28,
      "total_facturado": 1400.00
    },
    {
      "referencia": "DOM001", 
      "descripcion": "Dominio .com",
      "cantidad_total": 15,
      "total_facturado": 375.00
    },
    {
      "referencia": null,
      "descripcion": "Consultoría SEO Personalizada",
      "cantidad_total": 8,
      "total_facturado": 2400.00
    }
  ]
}
```

### 2. Revenue-Based Ranking
**Scenario**: Find products that generated most revenue in Q1 2024

```typescript
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-03-31",
  order: "total_facturado:desc",
  limit: 15
})
```

**Use Case**: Revenue analysis, high-value product identification, pricing strategy

### 3. Annual Product Performance
**Scenario**: Complete yearly analysis of all products sold

```typescript
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  order: "cantidad_total:desc",
  limit: 100
})
```

**Use Case**: Annual reports, inventory planning, product discontinuation decisions

### 4. Seasonal Analysis (Summer Period)
**Scenario**: Analyze summer sales performance (June-August)

```typescript
get_productos_mas_vendidos({
  fecha_desde: "2024-06-01",
  fecha_hasta: "2024-08-31",
  order: "total_facturado:desc",
  limit: 20
})
```

**Use Case**: Seasonal trend analysis, marketing campaign planning

### 5. Weekly Performance with Pagination
**Scenario**: Detailed weekly analysis with pagination through results

```typescript
// First page - top performers
get_productos_mas_vendidos({
  fecha_desde: "2024-01-15",
  fecha_hasta: "2024-01-21",
  limit: 5,
  offset: 0,
  order: "cantidad_total:desc"
})

// Second page - next tier
get_productos_mas_vendidos({
  fecha_desde: "2024-01-15", 
  fecha_hasta: "2024-01-21",
  limit: 5,
  offset: 5,
  order: "cantidad_total:desc"
})
```

**Use Case**: Short-term performance tracking, promotional campaign analysis

### 6. Product Discovery (Low-Volume High-Value)
**Scenario**: Find products with lower sales volume but high revenue per unit

```typescript
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  order: "total_facturado:desc",
  limit: 50
})
```

**Use Case**: Premium product analysis, profit margin optimization

---

## 📊 Advanced Analysis Examples

### Monthly Comparison
```typescript
// January analysis
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-01-31",
  order: "cantidad_total:desc"
})

// February analysis  
get_productos_mas_vendidos({
  fecha_desde: "2024-02-01",
  fecha_hasta: "2024-02-29",
  order: "cantidad_total:desc"
})
```

### Product Category Analysis
```typescript
// Focus on specific time period for trend analysis
get_productos_mas_vendidos({
  fecha_desde: "2024-03-01",
  fecha_hasta: "2024-03-31",
  order: "total_facturado:desc",
  limit: 25
})
```

---

## 🔍 Data Interpretation Guide

### Understanding the Response

**Product Grouping Logic**:
- Products with `referencia` are grouped by their product code
- Services without `referencia` are grouped by `descripcion`
- This handles both catalog products and custom services

**Metrics Explained**:
- **`cantidad_total`**: Total units sold (sum of all line item quantities)
- **`total_facturado`**: Total revenue generated (sum of all line item totals)
- **Average price per unit**: `total_facturado / cantidad_total`

**Sorting Options**:
- **`cantidad_total:desc`**: Best sellers by volume (most units sold)
- **`total_facturado:desc`**: Top revenue generators (highest income)
- **`cantidad_total:asc`**: Least popular products
- **`total_facturado:asc`**: Lowest revenue products

---

## ⚠️ Error Scenarios

### 1. No Invoices in Period
```typescript
get_productos_mas_vendidos({
  fecha_desde: "2030-01-01",
  fecha_hasta: "2030-01-31"
})
```

**Response**:
```json
{
  "message": "No se encontraron facturas en el período especificado",
  "period": { "fecha_desde": "2030-01-01", "fecha_hasta": "2030-01-31" },
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

### 2. Invalid Invoice IDs
**Scenario**: Invoices found but contain invalid ID references

**Response**:
```json
{
  "message": "No se encontraron IDs de facturas válidos",
  "period": { "fecha_desde": "2024-01-01", "fecha_hasta": "2024-01-31" },
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

### 3. API Connection Error
**Response**:
```json
{
  "error": "Failed to fetch productos más vendidos",
  "message": "Connection timeout",
  "period": { "fecha_desde": "2024-01-01", "fecha_hasta": "2024-01-31" },
  "meta": { "total": 0, "limit": 50, "offset": 0, "hasMore": false },
  "data": []
}
```

---

## 🎯 Business Use Cases

### Inventory Management
```typescript
// Identify fast-moving products for restock planning
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-03-31",
  order: "cantidad_total:desc",
  limit: 20
})
```

### Marketing Strategy
```typescript
// Find top revenue products for promotional focus
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  order: "total_facturado:desc",
  limit: 10
})
```

### Performance Monitoring
```typescript
// Weekly performance tracking
get_productos_mas_vendidos({
  fecha_desde: "2024-01-08",
  fecha_hasta: "2024-01-14",
  order: "cantidad_total:desc"
})
```

### Product Lifecycle Analysis
```typescript
// Quarterly analysis for product decisions
get_productos_mas_vendidos({
  fecha_desde: "2024-04-01",
  fecha_hasta: "2024-06-30",
  order: "total_facturado:desc",
  limit: 50
})
```

### Seasonal Planning
```typescript
// Holiday season analysis (November-December)
get_productos_mas_vendidos({
  fecha_desde: "2024-11-01",
  fecha_hasta: "2024-12-31",
  order: "cantidad_total:desc",
  limit: 30
})
```

---

## 💡 Tips for AI Assistants

### 1. **Date Range Selection**
- Use meaningful business periods (months, quarters, years)
- Consider seasonal variations in product sales
- Validate date formats (YYYY-MM-DD) before calling

### 2. **Sort Order Strategy**
- Use `cantidad_total:desc` for volume-based analysis
- Use `total_facturado:desc` for revenue-focused insights
- Consider business context when choosing sort order

### 3. **Result Interpretation**
- Explain the difference between volume and revenue rankings
- Highlight products that appear in both top lists
- Identify products with high revenue-per-unit ratios

### 4. **Pagination Best Practices**
- Start with reasonable limits (10-25 for summaries)
- Use pagination for detailed analysis
- Check `hasMore` to determine if additional data exists

### 5. **Business Context**
- Relate findings to business seasons and cycles
- Consider external factors (promotions, market changes)
- Suggest actionable insights based on the data

### 6. **Data Quality**
- Handle products without `referencia` appropriately
- Explain grouping logic to users when relevant
- Note when services vs products are being analyzed

---

## 🔄 Pagination Example for Large Datasets

For businesses with extensive product catalogs:

```typescript
// Page 1 (top 20 products)
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  limit: 20,
  offset: 0,
  order: "cantidad_total:desc"
})

// Page 2 (next 20 products)
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  limit: 20,
  offset: 20,
  order: "cantidad_total:desc"
})

// Page 3 (next 20 products)  
get_productos_mas_vendidos({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  limit: 20,
  offset: 40,
  order: "cantidad_total:desc"
})
```

---

## 💰 Specialized Business Tool: `get_clientes_top_facturacion`

### Overview
Generate customer billing rankings by total invoiced amount within a specified date range. This tool helps identify top-performing customers for sales analysis, account management prioritization, and revenue insights.

### Multi-Step Process
1. **Filter Invoices**: Get invoices within date range
2. **Apply Payment Filter**: Optionally filter by payment status
3. **Group & Calculate**: Group by customer and calculate totals
4. **Lookup Customer Details**: Fetch customer information (name, CIF/NIF)
5. **Sort & Paginate**: Order by billing amount and apply pagination

### Parameters
- **`fecha_desde`** (required): Start date (YYYY-MM-DD format)
- **`fecha_hasta`** (required): End date (YYYY-MM-DD format)  
- **`solo_pagadas`** (optional): Include only paid invoices (default: false)
- **`limit`** (optional): Maximum customers to return (1-1000, default: 100)
- **`offset`** (optional): Skip customers for pagination (default: 0)

---

## 📊 Usage Examples

### 1. Top Customers This Quarter
**Scenario**: Get top 10 customers by total billing for Q3 2024

```typescript
get_clientes_top_facturacion({
  fecha_desde: "2024-07-01",
  fecha_hasta: "2024-09-30",
  limit: 10
})
```

**Expected Response**:
```json
{
  "periodo": {
    "fecha_desde": "2024-07-01",
    "fecha_hasta": "2024-09-30", 
    "solo_pagadas": false
  },
  "meta": { "total": 45, "limit": 10, "offset": 0, "hasMore": true },
  "data": [
    {
      "codcliente": "CLI001",
      "nombre": "Empresa ABC S.L.",
      "cifnif": "A12345678",
      "total_facturado": 15750.80,
      "numero_facturas": 12
    },
    {
      "codcliente": "CLI025", 
      "nombre": "Corporación XYZ",
      "cifnif": "B87654321",
      "total_facturado": 12430.50,
      "numero_facturas": 8
    }
  ]
}
```

### 2. Top Paid Customers
**Scenario**: Find customers with highest paid invoice amounts this year

```typescript
get_clientes_top_facturacion({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  solo_pagadas: true,
  limit: 20
})
```

### 3. Account Management Analysis
**Scenario**: Get complete customer ranking for monthly review

```typescript
get_clientes_top_facturacion({
  fecha_desde: "2024-08-01",
  fecha_hasta: "2024-08-31",
  limit: 50,
  offset: 0
})
```

### 4. Revenue Validation
**Scenario**: Cross-check revenue from top 5 customers

```typescript
get_clientes_top_facturacion({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-06-30",
  limit: 5
})
```

### 5. Sales Performance Review
**Scenario**: Quarterly analysis with pagination

```typescript
// Get first page of top customers
get_clientes_top_facturacion({
  fecha_desde: "2024-04-01",
  fecha_hasta: "2024-06-30",
  limit: 25,
  offset: 0
})

// Get second page
get_clientes_top_facturacion({
  fecha_desde: "2024-04-01", 
  fecha_hasta: "2024-06-30",
  limit: 25,
  offset: 25
})
```

---

## 📈 Business Use Cases

### Sales Team Management
- **Priority Account Identification**: Focus on high-value customers
- **Territory Performance**: Analyze regional customer rankings
- **Sales Rep Evaluation**: Track customer billing by sales representative

### Financial Analysis  
- **Revenue Concentration**: Identify dependency on top customers
- **Cash Flow Analysis**: Compare paid vs. unpaid customer rankings
- **Budget Planning**: Historical customer performance for forecasting

### Customer Relationship Management
- **VIP Customer Programs**: Identify candidates for premium services
- **Customer Retention**: Monitor changes in customer rankings over time
- **Account Growth Opportunities**: Spot potential for upselling

### Strategic Decision Making
- **Market Segmentation**: Understand customer value distribution
- **Resource Allocation**: Focus support on high-value accounts  
- **Risk Management**: Monitor customer concentration risk

---

## 🔧 Advanced Filtering Examples

### Date Range Combinations
```typescript
// Last 30 days
get_clientes_top_facturacion({
  fecha_desde: "2024-08-01",
  fecha_hasta: "2024-08-31"
})

// Year-to-date
get_clientes_top_facturacion({
  fecha_desde: "2024-01-01", 
  fecha_hasta: "2024-08-31"
})

// Specific quarter
get_clientes_top_facturacion({
  fecha_desde: "2024-04-01",
  fecha_hasta: "2024-06-30"
})
```

### Payment Status Analysis
```typescript
// Only customers with paid invoices
get_clientes_top_facturacion({
  fecha_desde: "2024-07-01",
  fecha_hasta: "2024-07-31",
  solo_pagadas: true
})

// All invoices (default - includes paid and unpaid)
get_clientes_top_facturacion({
  fecha_desde: "2024-07-01",
  fecha_hasta: "2024-07-31",
  solo_pagadas: false
})
```

### Pagination for Large Results
```typescript
// First 100 customers
get_clientes_top_facturacion({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31",
  limit: 100,
  offset: 0
})

// Next 100 customers  
get_clientes_top_facturacion({
  fecha_desde: "2024-01-01",
  fecha_hasta: "2024-12-31", 
  limit: 100,
  offset: 100
})
```

---

*This documentation helps AI assistants understand all specialized business tools' capabilities and use them effectively for comprehensive business analysis scenarios.*