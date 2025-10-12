import { db } from '@/db';
import { contentCalendar } from '@/db/schema';

async function main() {
    const sampleContentCalendar = [
        {
            tripId: 1,
            destinationId: 1,
            platformId: 1,
            scheduledDate: '2024-06-19',
            caption: 'Golden spires reaching for the sky at the Grand Palace 🏛️✨ The intricate details and rich history here are absolutely breathtaking. Every corner tells a story of Thai royalty and tradition.',
            tone: 'inspirational',
            locationSuggestion: 'Grand Palace, Bangkok',
            hashtags: '#wanderlust #Bangkok #Thailand #TravelAsia #GrandPalace #TempleHopping #CulturalTravel #ExploreThailand',
            status: 'scheduled',
        },
        {
            tripId: 1,
            destinationId: 1,
            platformId: 2,
            scheduledDate: '2024-06-20',
            caption: 'POV: You just discovered the best pad thai of your life on a random Bangkok street corner 🍜🔥 Cost? $2. Taste? PRICELESS. This is why street food > fancy restaurants',
            tone: 'casual',
            locationSuggestion: 'Yaowarat Road, Chinatown',
            hashtags: '#StreetFood #BangkokFood #Foodie #ThaiFood #TravelEats #FoodTok',
            status: 'scheduled',
        },
        {
            tripId: 1,
            destinationId: 2,
            platformId: 1,
            scheduledDate: '2024-06-29',
            caption: 'Is this real life or did I walk into a postcard? 🏞️ Ha Long Bay exceeded every expectation. Pro tip: Book the sunrise cruise – you won't regret waking up early for THIS view.',
            tone: 'professional',
            locationSuggestion: 'Ha Long Bay, Vietnam',
            hashtags: '#HalongBay #Vietnam #TravelVietnam #BucketList #NatureLovers #TravelPhotography #SunriseViews',
            status: 'scheduled',
        },
        {
            tripId: 1,
            destinationId: 3,
            platformId: 1,
            scheduledDate: '2024-07-09',
            caption: 'When nature does the landscaping 🌾💚 These Tegalalang rice terraces are giving me all the zen vibes. Honestly thinking about extending my trip just to wake up to this view every morning.',
            tone: 'casual',
            locationSuggestion: 'Tegalalang Rice Terraces, Ubud',
            hashtags: '#Bali #Ubud #RiceTerraces #BaliLife #NaturePhotography #TravelIndonesia #SustainableTravel',
            status: 'draft',
        },
        {
            tripId: 1,
            destinationId: 3,
            platformId: 4,
            scheduledDate: '2024-07-10',
            caption: 'Plot twist: I can now make better nasi goreng than my local Indonesian restaurant 👨‍🍳😂 Today's cooking class was equal parts educational and hilarious. Shoutout to our instructor for not laughing too hard at my knife skills!',
            tone: 'humorous',
            locationSuggestion: 'Paon Bali Cooking Class, Ubud',
            hashtags: '#BaliCookingClass #TravelExperiences #FoodieTravel #LearnAndTravel #BaliActivities #CulinaryTravel',
            status: 'draft',
        },
    ];

    await db.insert(contentCalendar).values(sampleContentCalendar);
    
    console.log('✅ Content calendar seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});