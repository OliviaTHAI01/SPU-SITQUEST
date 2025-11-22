const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('Testing /api/activities endpoint...\n');

        const response = await fetch('http://localhost:3000/api/activities');
        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Total activities:', data.length);

        if (data.length > 0) {
            console.log('\nFirst activity:');
            console.log('- Title:', data[0].title);
            console.log('- Description:', data[0].desc ? data[0].desc.substring(0, 100) + '...' : 'N/A');
            console.log('- Hours:', data[0].hours);
            console.log('- Slots:', data[0].slots);
            console.log('- Date:', data[0].date);
            console.log('- Time:', data[0].time);
            console.log('- Location:', data[0].location);
            console.log('- Tags:', data[0].tags);
            console.log('- Image URL:', data[0].imgUrl ? `${data[0].imgUrl.substring(0, 50)}...` : 'N/A');
            console.log('- Form Link:', data[0].formLink);
            console.log('- Archived:', data[0].isArchived);
            console.log('- Created At:', data[0].createdAt);

            console.log('\nAll fields present:');
            const fields = ['title', 'desc', 'imgUrl', 'formLink', 'tags', 'hours', 'slots', 'date', 'time', 'location', 'lat', 'lng', 'isArchived', 'archivedDate', 'createdAt', 'updatedAt'];
            fields.forEach(field => {
                const exists = data[0].hasOwnProperty(field);
                console.log(`  ${field}: ${exists ? '✓' : '✗'}`);
            });
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
