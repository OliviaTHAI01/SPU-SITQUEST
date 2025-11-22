const fetch = require('node-fetch');

async function testPerformance() {
    console.log('🚀 Testing API Performance...\n');

    // Test 1: Full data with images
    console.log('Test 1: Full data (with images)');
    let start = Date.now();
    let response = await fetch('http://localhost:3000/api/activities');
    let data = await response.json();
    let duration = Date.now() - start;
    let size = JSON.stringify(data).length;
    console.log(`  ⏱️  Time: ${duration}ms`);
    console.log(`  📦 Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  📊 Activities: ${data.length}`);

    // Test 2: Without images (optimized)
    console.log('\nTest 2: Optimized (without images)');
    start = Date.now();
    response = await fetch('http://localhost:3000/api/activities?excludeImages=true');
    data = await response.json();
    duration = Date.now() - start;
    size = JSON.stringify(data).length;
    console.log(`  ⏱️  Time: ${duration}ms`);
    console.log(`  📦 Size: ${(size / 1024).toFixed(2)} KB`);
    console.log(`  📊 Activities: ${data.length}`);

    console.log('\n✅ Performance test complete!');
    console.log('💡 Tip: Use ?excludeImages=true for list views to load faster');
}

testPerformance();
