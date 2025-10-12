import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 'user_sample_001',
            name: 'Alex Chen',
            email: 'alex.chen@example.com',
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ User seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});