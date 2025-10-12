import { db } from '@/db';
import { trendingTags } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleTrendingTags = [
        {
            tagName: '#wanderlust',
            usageCount: 15420000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#travelgram',
            usageCount: 12300000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#adventure',
            usageCount: 9800000,
            category: 'adventure',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#travelphotography',
            usageCount: 8500000,
            category: 'photography',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#instatravel',
            usageCount: 7200000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#explore',
            usageCount: 6900000,
            category: 'adventure',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#beautifuldestinations',
            usageCount: 6500000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#traveltheworld',
            usageCount: 5800000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#bucketlist',
            usageCount: 5200000,
            category: 'inspiration',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#vacation',
            usageCount: 4800000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#beachlife',
            usageCount: 4500000,
            category: 'beach',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#mountains',
            usageCount: 4200000,
            category: 'mountain',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#digitalnomad',
            usageCount: 3800000,
            category: 'lifestyle',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#backpacking',
            usageCount: 3500000,
            category: 'adventure',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#solotravel',
            usageCount: 3200000,
            category: 'travel',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#luxurytravel',
            usageCount: 2900000,
            category: 'luxury',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#foodie',
            usageCount: 2700000,
            category: 'food',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#sunset',
            usageCount: 2500000,
            category: 'photography',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#cityscape',
            usageCount: 2200000,
            category: 'city',
            lastUpdated: currentTimestamp,
        },
        {
            tagName: '#roadtrip',
            usageCount: 2000000,
            category: 'adventure',
            lastUpdated: currentTimestamp,
        },
    ];

    await db.insert(trendingTags).values(sampleTrendingTags);
    
    console.log('✅ Trending tags seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});