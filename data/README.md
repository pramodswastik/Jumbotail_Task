# Product Data

This directory contains product catalog information and statistics.

## Files

- **CatalogStats.js** - Statistics and metadata about the generated catalog
- **ProductDataGenerator.js** - Generator for creating 1000+ products

## Catalog Overview

### Categories (6)

- Mobile Phones (120 products)
- Laptops (33 products)
- Headphones (27 products)
- Phone Accessories (60 products)
- Tablets (18 products)
- Smart Watches (20 products)

**Total: 278+ Products**

### Brands (20+)

- Apple, Samsung, Xiaomi
- Dell, Lenovo, HP, ASUS
- Sony, JBL, Bose, Sennheiser
- Spigen, ANKER, Belkin, OtterBox
- And more...

## Data Generation

Products are generated with:

- Realistic pricing (₹999 - ₹249,999)
- Random but realistic ratings (3.5 - 5.0)
- Varied stock levels
- Sales history
- Return rates and complaint counts
- Rich metadata (storage, RAM, colors, etc.)

## Usage

The data is automatically initialized when the server starts via `DataInitializer.js`.
