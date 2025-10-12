import { db } from '@/db';
import { destinations } from '@/db/schema';

async function main() {
    const sampleDestinations = [
        {
            tripId: 1,
            name: 'Bangkok',
            country: 'Thailand',
            latitude: 13.7563,
            longitude: 100.5018,
            visitDate: '2024-06-18',
            notes: 'Exploring Grand Palace, street food tours, and floating markets',
        },
        {
            tripId: 1,
            name: 'Hanoi',
            country: 'Vietnam',
            latitude: 21.0285,
            longitude: 105.8542,
            visitDate: '2024-06-28',
            notes: 'Old Quarter exploration, Ha Long Bay day trip, traditional water puppet show',
        },
        {
            tripId: 1,
            name: 'Ubud',
            country: 'Indonesia',
            latitude: -8.5069,
            longitude: 115.2625,
            visitDate: '2024-07-08',
            notes: 'Rice terrace trekking, monkey forest visit, traditional Balinese cooking class',
        }
    ];

    await db.insert(destinations).values(sampleDestinations);
    
    console.log('✅ Destinations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});