import { db } from '@/db';
import { trips } from '@/db/schema';

async function main() {
    const sampleTrips = [
        {
            userId: 'user_sample_001',
            title: 'Southeast Asia Adventure 2024',
            description: 'A month-long journey through Thailand, Vietnam, and Indonesia exploring temples, beaches, and local cuisine',
            startDate: '2024-06-15',
            endDate: '2024-07-15',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(trips).values(sampleTrips);
    
    console.log('✅ Trips seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});