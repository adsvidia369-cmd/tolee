import { MarketplaceView } from '@/components/MarketplaceView';
import { getListings } from '@/actions/marketplace';

export default async function MarketplacePage() {
  const res = await getListings();
  const dbListings = res.success ? res.listings : [];

  // If no listings in DB, provide some dummy local listings based on the guide's Real Estate focus
  let initialListings = dbListings;

  if (initialListings.length === 0) {
    initialListings = [
      {
        id: 'mock-1',
        title: '2BHK Flat for Sale Near Station',
        price: 15000000,
        currency: 'INR',
        locationText: 'Ghatkopar East, Mumbai',
        category: 'Property',
        condition: 'like_new',
        images: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
        description: 'Spacious 2BHK flat with modern amenities. 5 mins walk from the station.',
        seller: { name: 'Rahul Sharma' }
      },
      {
        id: 'mock-2',
        title: 'Honda City 2020 Top Model',
        price: 850000,
        currency: 'INR',
        locationText: 'Andheri West, Mumbai',
        category: 'Vehicles',
        condition: 'used',
        images: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80',
        description: 'Single owner, well maintained, fully insured.',
        seller: { name: 'Amit Kumar' }
      },
      {
        id: 'mock-3',
        title: 'Premium Office Chair',
        price: 4500,
        currency: 'INR',
        locationText: 'Bandra, Mumbai',
        category: 'Electronics', // Can be furniture but Electronics/Services are current mock categories
        condition: 'new',
        images: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80',
        description: 'Ergonomic office chair with lumbar support. Brand new in box.',
        seller: { name: 'Priya Desai' }
      }
    ];
  }

  return <MarketplaceView initialListings={initialListings} />;
}
