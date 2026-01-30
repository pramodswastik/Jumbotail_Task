# E-Commerce Search Engine - React Frontend

Modern, responsive React frontend for the E-Commerce Search Engine microservice.

## Features

- **Intelligent Search Interface**: Search with natural language queries
- **Advanced Filtering**: Sort by relevance, price, rating, popularity
- **Ranking Visualization**: See detailed score breakdown for each product
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time API Integration**: Connected to Node.js backend
- **Catalog Statistics**: View comprehensive inventory statistics

## Tech Stack

- React 18
- Vite (Fast build tool)
- CSS3 (Grid, Flexbox, Gradients)
- Fetch API (for HTTP requests)

## Project Structure

```
frontend/
├── App.jsx           # Main App component with search and stats
├── App.css           # Comprehensive styling
├── main.jsx          # React entry point
├── index.html        # HTML template
├── vite.config.js    # Vite configuration with proxy
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

Note: Backend API must be running on `http://localhost:3000`

## Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Integration

The frontend communicates with the backend API at:

- Base URL: `http://localhost:3000/api/v1`

### Endpoints Used:

#### Search Products

```
GET /search/product?query=...&limit=20&algorithm=comprehensive&diversify=true
```

**Query Parameters:**

- `query` (string): Search query
- `limit` (number): Number of results (1-100)
- `sortBy` (string): relevance|price|rating|sales
- `order` (string): asc|desc
- `diversify` (boolean): Prevent brand monopoly
- `algorithm` (string): comprehensive|bm25

**Response:**

```json
{
  "success": true,
  "totalResults": 10,
  "data": [
    {
      "productId": "PROD_123",
      "title": "iPhone 14 Pro",
      "description": "Premium smartphone",
      "rating": 4.5,
      "price": 79999,
      "mrp": 99999,
      "discountPercentage": 20,
      "stock": 45,
      "brand": "Apple",
      "category": "Mobile Phones",
      "score": 85.5,
      "ranking": {
        "relevance": 90,
        "quality": 85,
        "popularity": 80,
        "value": 75,
        "recency": 70
      },
      "metadata": {
        "storage": "256GB",
        "color": "Space Black"
      }
    }
  ]
}
```

#### Catalog Statistics

```
GET /search/stats
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "totalProducts": 278,
    "totalCategories": 6,
    "totalBrands": 25,
    "avgRating": 4.2,
    "inStockProducts": 265,
    "totalValue": 2500000000,
    "categories": ["Mobile Phones", "Laptops", ...],
    "brands": ["Apple", "Samsung", ...]
  }
}
```

## Components

### App Component

Main component handling:

- Search form with filters
- Results display with ranking breakdown
- Catalog statistics view
- Tab navigation between search and stats

**Key Functions:**

- `handleSearch()`: Perform product search with filters
- `fetchStats()`: Fetch catalog statistics

**State:**

- `searchQuery`: Current search input
- `results`: Array of search results
- `loading`: Search loading state
- `filters`: Search and sort options
- `stats`: Catalog statistics

### ScoreBar Component

Displays individual ranking factor scores:

- Label (Relevance, Quality, Popularity, Value, Recency)
- Visual bar showing percentage (0-100)
- Numeric score value

## Search Query Examples

The frontend works with various query types:

1. **Budget Queries**
   - "sasta iPhone" (cheap iPhone)
   - "under 30k laptop"
   - "budget-friendly headphones"

2. **Premium Queries**
   - "premium laptop"
   - "best smartphone"
   - "flagship phone"

3. **Spelling Mistakes**
   - "ifone" → "iPhone"
   - "samsang" → "Samsung"
   - "appel" → "Apple"

4. **Latest Products**
   - "latest iPhone"
   - "newest laptop"
   - "recent release"

5. **Attribute-based**
   - "5G mobile"
   - "16GB RAM laptop"
   - "noise cancelling earbuds"

## Performance

- **Search Response Time**: < 500ms
- **Page Load Time**: < 2 seconds
- **API Calls**: Asynchronous with loading indicators
- **Optimization**: Lazy loading results, efficient re-rendering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Configuration

### Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

The proxy allows frontend requests to `/api/*` to be forwarded to `http://localhost:3000/api/*`

## Styling

### CSS Features

- **Grid Layout**: Responsive product grid that adapts from 1-4 columns
- **Gradients**: Purple gradient header and buttons for modern look
- **Hover Effects**: Cards lift on hover with enhanced shadows
- **Score Visualization**: Colorful gradient bars for ranking scores
- **Mobile Responsive**: Breakpoints at 768px and 480px

### Color Scheme

- **Primary**: #667eea (Purple blue)
- **Secondary**: #764ba2 (Dark purple)
- **Success**: #51cf66 (Green)
- **Error**: #ff6b6b (Red)
- **Neutral**: #f5f5f5 to #333 (Gray scale)

## Future Enhancements

- [ ] Pagination for large result sets
- [ ] Advanced filters (brand, color, storage, etc.)
- [ ] Product comparison feature
- [ ] Save favorites/wishlist
- [ ] User ratings and reviews
- [ ] Related products suggestions
- [ ] Dark mode toggle
- [ ] Search history and autocomplete
- [ ] Share product links
- [ ] Product images gallery
- [ ] Detailed specifications tab
- [ ] Real-time stock updates

## Troubleshooting

### API Connection Issues

If you see "Error performing search" messages:

1. Ensure backend is running on `http://localhost:3000`
2. Check backend logs for errors
3. Verify CORS is enabled in backend
4. Check browser console for network errors

### Build Issues

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install

# Clear Vite cache
rm -r dist .vite
npm run build
```

## Development Tips

1. **Hot Module Replacement**: Changes to `.jsx` files auto-reload
2. **Console Logs**: Check browser DevTools for debugging
3. **Network Tab**: Monitor API calls in DevTools Network tab
4. **React DevTools**: Install React DevTools browser extension

## License

MIT

## Contributing

Contributions welcome! Please ensure code follows the existing style and structure.
