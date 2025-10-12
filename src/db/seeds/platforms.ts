import { db } from '@/db';
import { platforms } from '@/db/schema';

async function main() {
    const samplePlatforms = [
        {
            tripId: 1,
            platformName: 'Instagram',
            isSelected: true,
        },
        {
            tripId: 1,
            platformName: 'TikTok',
            isSelected: true,
        },
        {
            tripId: 1,
            platformName: 'YouTube',
            isSelected: false,
        },
        {
            tripId: 1,
            platformName: 'Blog',
            isSelected: true,
        }
    ];

    await db.insert(platforms).values(samplePlatforms);
    
    console.log('✅ Platforms seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});