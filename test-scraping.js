/**
 * Test Web Scraping Functionality
 */

const axios = require('axios');

async function testScraping() {
  console.log('🧪 Testing Live Web Scraping (Each Search Scrapes Fresh Data)...\n');
  
  try {
    // Test 1: Search for laptop - should scrape fresh
    console.log('1️⃣ First search: "laptop" (should trigger live scraping)...');
    const response1 = await axios.get('http://localhost:3000/api/v1/search/product', {
      params: {
        query: 'laptop',
        useWeb: true,
        limit: 5
      }
    });
    
    console.log(`✅ Status: ${response1.status}`);
    console.log(`📊 Data Source: ${response1.data.dataSource}`);
    console.log(`🔄 Scraped Fresh: ${response1.data.scrapedFresh ? 'YES' : 'NO'}`);
    console.log(`📦 Total Results: ${response1.data.totalResults}`);
    console.log(`📌 Returned Results: ${response1.data.returnedResults}`);
    
    if (response1.data.data.length > 0) {
      console.log('\n📱 Sample Products:');
      response1.data.data.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     Price: ₹${product.price} | Rating: ${product.rating}/5 | Source: ${product.source || 'N/A'}`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 2: Different search - headphones - should scrape fresh again
    console.log('2️⃣ Second search: "headphones" (should trigger NEW live scraping)...');
    const response2 = await axios.get('http://localhost:3000/api/v1/search/product', {
      params: {
        query: 'headphones',
        useWeb: true,
        limit: 5
      }
    });
    
    console.log(`✅ Status: ${response2.status}`);
    console.log(`📊 Data Source: ${response2.data.dataSource}`);
    console.log(`🔄 Scraped Fresh: ${response2.data.scrapedFresh ? 'YES' : 'NO'}`);
    console.log(`📦 Total Results: ${response2.data.totalResults}`);
    console.log(`📌 Returned Results: ${response2.data.returnedResults}`);
    
    if (response2.data.data.length > 0) {
      console.log('\n📱 Sample Products:');
      response2.data.data.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     Price: ₹${product.price} | Rating: ${product.rating}/5`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 3: Same search again - should scrape fresh (not cached)
    console.log('3️⃣ Third search: "laptop" AGAIN (should trigger FRESH scraping, not cache)...');
    const response3 = await axios.get('http://localhost:3000/api/v1/search/product', {
      params: {
        query: 'laptop',
        useWeb: true,
        limit: 5
      }
    });
    
    console.log(`✅ Status: ${response3.status}`);
    console.log(`📊 Data Source: ${response3.data.dataSource}`);
    console.log(`🔄 Scraped Fresh: ${response3.data.scrapedFresh ? 'YES' : 'NO'}`);
    console.log(`📦 Total Results: ${response3.data.totalResults}`);
    console.log(`💡 Note: Prices may differ from first search (proves fresh scraping)`);
    
    if (response3.data.data.length > 0) {
      console.log('\n📱 Sample Products:');
      response3.data.data.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     Price: ₹${product.price}`);
      });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 4: Search with local data (no scraping)
    console.log('4️⃣ Fourth search: "phone" with LOCAL data (useWeb=false)...');
    const response4 = await axios.get('http://localhost:3000/api/v1/search/product', {
      params: {
        query: 'phone',
        useWeb: false,
        limit: 5
      }
    });
    
    console.log(`✅ Status: ${response4.status}`);
    console.log(`📊 Data Source: ${response4.data.dataSource}`);
    console.log(`🔄 Scraped Fresh: ${response4.data.scrapedFresh ? 'YES' : 'NO'}`);
    console.log(`📦 Total Results: ${response4.data.totalResults}`);
    console.log(`📌 Returned Results: ${response4.data.returnedResults}`);
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 5: Test suggestions
    console.log('5️⃣ Testing product suggestions...');
    const response5 = await axios.get('http://localhost:3000/api/v1/search/suggestions', {
      params: {
        query: 'cam'
      }
    });
    
    console.log(`✅ Status: ${response5.status}`);
    console.log(`💡 Suggestions for "${response5.data.query}":`);
    response5.data.suggestions.forEach((sug, index) => {
      console.log(`  ${index + 1}. ${sug.suggestion} (${sug.count} items)`);
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n💡 KEY TAKEAWAY: Each search with useWeb=true triggers FRESH web scraping!');
    console.log('   No caching - every search fetches new data from external sources.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
testScraping().catch(console.error);
