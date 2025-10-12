import { db } from '@/db';
import { locationDatabase } from '@/db/schema';

async function main() {
    const sampleLocations = [
        {
            name: 'Paris',
            country: 'France',
            category: 'cultural',
            description: 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and charming cafes along the Seine',
            bestTimeToVisit: 'April to June, September to October',
            trendingScore: 95,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Bali',
            country: 'Indonesia',
            category: 'beach',
            description: 'Tropical paradise with stunning beaches, ancient temples, lush rice terraces, and vibrant culture',
            bestTimeToVisit: 'April to October (dry season)',
            trendingScore: 92,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Tokyo',
            country: 'Japan',
            category: 'city',
            description: 'Ultra-modern metropolis blending cutting-edge technology with traditional temples and world-class cuisine',
            bestTimeToVisit: 'March to May (cherry blossoms), October to November',
            trendingScore: 88,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'New York',
            country: 'USA',
            category: 'city',
            description: 'The city that never sleeps, featuring iconic landmarks like Times Square, Central Park, and the Statue of Liberty',
            bestTimeToVisit: 'April to June, September to November',
            trendingScore: 85,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Dubai',
            country: 'UAE',
            category: 'city',
            description: 'Futuristic desert oasis with record-breaking skyscrapers, luxury shopping, and Arabian adventures',
            bestTimeToVisit: 'November to March',
            trendingScore: 90,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(locationDatabase).values(sampleLocations);
    
    console.log('✅ Location database seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});