import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // --- USERS ---
    const users = [
        { id: 'u1', name: 'Diretor de Marketing', email: 'brand@store.com', role: 'brand', avatarUrl: 'https://ui-avatars.com/api/?name=Brand' },
        { id: 'u2', name: 'Creator Lifestyle', email: 'creator@yt.com', role: 'community', avatarUrl: 'https://ui-avatars.com/api/?name=Creator' },
        { id: 'u3', name: 'Admin', email: 'admin@sponstube.com', role: 'staff' }
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { id: u.id },
            update: {},
            create: u,
        });
    }

    // --- BRAND PROFILES ---
    const brands = [
        {
            id: 'b1', userId: 'u1',
            companyName: 'Urban Kicks', industry: 'E-commerce', size: 'sme',
            objectiveTags: ['conversion', 'sales'], toneOfVoice: 'Descolado',
            city: 'São Paulo', country: 'Brasil', description: 'Streetwear exclusivo.'
        },
        // Mocking other brands mapped to same user or new users if needed, 
        // for simplicity linking b1 to u1. b2 and b3 will be skipped or need new users.
        // Let's create users for them dynamically if we want full fidelity.
    ];

    // Create user for b2
    const uB2 = await prisma.user.upsert({
        where: { email: 'gamerfuel@brand.com' },
        update: {},
        create: { id: 'u_b2', name: 'GamerFuel Rep', email: 'gamerfuel@brand.com', role: 'brand' }
    });

    const uB3 = await prisma.user.upsert({
        where: { email: 'finwise@brand.com' },
        update: {},
        create: { id: 'u_b3', name: 'FinWise CEO', email: 'finwise@brand.com', role: 'brand' }
    });

    const allBrands = [
        ...brands,
        {
            id: 'b2', userId: uB2.id,
            companyName: 'GamerFuel', industry: 'Beverage', size: 'enterprise',
            objectiveTags: ['awareness'], toneOfVoice: 'Aggressive',
            city: 'LA', country: 'USA', description: 'Energy drinks for gamers.'
        },
        {
            id: 'b3', userId: uB3.id,
            companyName: 'FinWise', industry: 'Fintech', size: 'startup',
            objectiveTags: ['install'], toneOfVoice: 'Smart',
            city: 'SP', country: 'Brasil', description: 'Finance app.'
        }
    ];

    for (const b of allBrands) {
        await prisma.brandProfile.upsert({
            where: { id: b.id },
            update: {},
            create: b
        });
    }

    // --- COMMUNITIES (Creators) ---
    // Linking c1 to u2
    const communities = [
        {
            id: 'c1', userId: 'u2',
            name: 'Bella Makeup', slug: 'bella-makeup', description: 'Makeup tutorials.',
            platforms: ['long_form'], size: 850000, engagementRate: 9.2,
            tags: ['Beauty'], verificationStatus: 'verified', city: 'RJ', country: 'BR'
        }
    ];

    for (const c of communities) {
        await prisma.community.upsert({
            where: { id: c.id },
            update: {},
            create: c
        });
    }

    // --- CAMPAIGNS ---
    const campaigns = [
        {
            id: 'cmp_applied_1', brandId: 'b1',
            name: 'Lançamento Jordan', status: 'applied', brief: 'Review detalhado.',
            budgetTotal: 1500
        },
        {
            id: 'cmp_approved_1', brandId: 'b3',
            name: 'FinWise Dicas', status: 'approved', brief: 'Video about debt.',
            budgetTotal: 3000
        },
        {
            id: 'cmp_running_1', brandId: 'b2',
            name: 'GamerFuel Marathon', status: 'running', brief: 'Drink output stream.',
            budgetTotal: 5000
        }
    ];

    for (const cmp of campaigns) {
        await prisma.campaign.upsert({
            where: { id: cmp.id },
            update: {},
            create: cmp
        });
    }

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
