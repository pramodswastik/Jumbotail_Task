# Developer Guide - Getting Started

Quick reference for developers working on this project.

## 🚀 Quick Start (5 minutes)

```bash
# 1. Clone project
cd d:\Desktop\Jumbotail_Task

# 2. Install backend
npm install

# 3. Install frontend
cd frontend && npm install && cd ..

# 4. Terminal 1: Start backend
npm start

# 5. Terminal 2: Start frontend
cd frontend && npm run dev
```

Open http://localhost:5173 in browser

---

## 📚 Project Structure

```
Jumbotail_Task/
├── server.js                    # Express server entry point
├── models/Product.js            # Product data model
├── models/ProductStore.js       # In-memory database
├── services/RankingService.js   # Search ranking algorithms
├── routes/searchRoutes.js       # Search API endpoints
├── middleware/ValidationMiddleware.js # Input validation
├── utils/searchUtils.js         # Search utilities
├── frontend/App.jsx             # React main component
└── docs/                        # Documentation
```

---

## 🔧 Common Tasks

### Add a New API Endpoint

1. **Create route handler**

```javascript
// routes/productRoutes.js
app.post("/api/v1/custom", (req, res) => {
  // Implementation
  res.json({ success: true });
});
```

2. **Add validation** (if needed)

```javascript
// middleware/ValidationMiddleware.js
function validateCustomInput(data) {
  if (!data.name) throw new Error("Name required");
  // More validation
}
```

3. **Test it**

```bash
curl -X POST http://localhost:3000/api/v1/custom
```

### Modify Search Algorithm

1. **Edit RankingService.js**

```javascript
// Change factor weights
const FACTORS = {
  relevance: 0.4, // 40%
  popularity: 0.25, // 25%
  quality: 0.2, // 20%
  value: 0.1, // 10%
  recency: 0.05, // 5%
};
```

2. **Test with various queries**

```bash
curl "http://localhost:3000/api/v1/search/product?query=budget%20laptop"
```

### Add Product Categories

1. **Update ProductDataGenerator.js**

```javascript
const categories = [
  "Mobile Phones",
  "Laptops",
  "Gaming Consoles", // Add new
];
```

2. **Restart server to load new data**

### Modify Frontend UI

1. **Edit App.jsx** for logic
2. **Edit App.css** for styling
3. Changes auto-reload with Vite

---

## 🧪 Testing

### Manual API Testing

```bash
# Search products
curl "http://localhost:3000/api/v1/search/product?query=iPhone&limit=5"

# Get product by ID
curl "http://localhost:3000/api/v1/product/1"

# Get statistics
curl "http://localhost:3000/api/v1/search/stats"
```

### Test in Frontend

1. Open http://localhost:5173
2. Try search: "sasta iPhone"
3. Check browser console (F12) for errors
4. Check network tab for API calls

### Using Postman

1. Import API endpoints from API_DOCUMENTATION.md
2. Set up environment variables
3. Run test collections

---

## 📊 Code Statistics

| Component | Lines    | Status         |
| --------- | -------- | -------------- |
| Backend   | 2,500+   | ✅ Done        |
| Frontend  | 1,200+   | ✅ Done        |
| Tests     | 14 cases | ✅ Done        |
| Docs      | 500+     | 🔄 In Progress |

---

## 🔍 Debugging

### Backend Logging

```bash
# Enable verbose logging
$env:DEBUG = "app:*"
npm start

# Check logs in production
tail -f logs/app.log
```

### Frontend Debugging

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Check for JavaScript errors
4. Go to Network tab
5. Check API response status and data

### Common Errors

**"Cannot find module"**

- Solution: `npm install`

**"Port 3000 already in use"**

- Solution: Kill process on port 3000

**"CORS error in frontend"**

- Solution: Check backend CORS config

---

## 📚 Key Files Reference

### Models

- `Product.js` - Entity definition with methods
- `ProductStore.js` - Database operations

### Services

- `ProductService.js` - Business logic
- `RankingService.js` - Ranking algorithms
- `ProductDataGenerator.js` - Data generation

### Routes

- `productRoutes.js` - Product CRUD APIs
- `searchRoutes.js` - Search and stats APIs

### Utilities

- `searchUtils.js` - Helper functions for search

### Frontend

- `App.jsx` - Main React component
- `App.css` - Styling

---

## 🚀 Performance Tips

1. **Search is slow?**
   - Check if products loaded: curl /search/stats
   - Monitor memory usage
   - Check for blocking operations

2. **Frontend is laggy?**
   - Check network tab (API slow?)
   - Check React rendering (DevTools Profiler)
   - Clear browser cache

3. **High memory usage?**
   - Increase Node heap: `node --max-old-space-size=4096`
   - Implement caching
   - Profile with Chrome DevTools

---

## 🔗 Useful Commands

```bash
# Start backend
npm start

# Start frontend
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Run tests
npm test

# Check code quality
npm run lint

# Format code
npm run format

# View git log
git log --oneline -10

# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add -A && git commit -m "Feature: description"

# Push to GitHub
git push origin main
```

---

## 📖 Documentation Files

- **README.md** - Project overview
- **API_DOCUMENTATION.md** - Complete API reference
- **PROGRESS.md** - Phase-by-phase progress
- **DEPLOYMENT.md** - Deployment guide
- **ARCHITECTURE.md** - System design
- **PHASE7_8_TESTING.md** - Test examples
- **This file** - Developer quick reference

---

## 🆘 Getting Help

1. **Check existing docs** - Usually has answers
2. **Search GitHub issues** - Others might have same problem
3. **Check test examples** - PHASE7_8_TESTING.md has 14 examples
4. **Review code comments** - Well-documented code
5. **Check console logs** - Enable DEBUG for verbose output

---

## 💡 Development Best Practices

1. **Always write code on a feature branch**
2. **Test before committing**
3. **Write clear commit messages**
4. **Keep components small and focused**
5. **Use meaningful variable names**
6. **Add comments for complex logic**
7. **Test edge cases**
8. **Document new features**

---

## 🎯 Next Steps

1. Explore the codebase structure
2. Run backend and frontend locally
3. Test APIs using provided examples
4. Modify something and see changes
5. Read full documentation for details

**Happy coding! 🚀**
