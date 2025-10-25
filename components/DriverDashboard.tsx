import React, { useState, useEffect } from 'react';
import { Listing, Reservation, UserRole } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { findNearbyParking } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ReservationModal from './ReservationModal';
import MapView from './MapView';
import { ListIcon, MapIcon } from './Icons';

interface DriverDashboardProps {
  listings: Listing[];
  onReserve: (reservation: Omit<Reservation, 'id' | 'driverId'>) => void;
  onJoinWaitlist: () => void;
}

const ListingCard: React.FC<{ 
    listing: Listing; 
    onSelect: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ listing, onSelect, onMouseEnter, onMouseLeave }) => (
    <div 
        className="bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700 hover:border-purple-500 transition-all duration-200 flex flex-col cursor-pointer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onSelect}
    >
        <p className="font-semibold text-lg text-white">{listing.address}</p>
        <p className="text-sm text-slate-400 mt-1 flex-grow h-10 overflow-hidden">{listing.description}</p>
        <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-purple-400">${listing.rate}<span className="text-sm font-normal text-slate-400">/{listing.rateType}</span></span>
            <button onClick={onSelect} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-sm hover:opacity-90 transition-opacity">
                Reserve
            </button>
        </div>
    </div>
);


const DriverDashboard: React.FC<DriverDashboardProps> = ({ listings, onReserve, onJoinWaitlist }) => {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [geminiSummary, setGeminiSummary] = useState('');
  const [geminiLocations, setGeminiLocations] = useState<{title: string; uri: string}[]>([]);
  const [showGeminiSuggestions, setShowGeminiSuggestions] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  useEffect(() => {
    setSearchResults(listings);
  }, [listings]);

  const handleSearch = async () => {
    if (!location) {
      setError('Could not get your location. Please enable location services.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeminiSummary('');
    setGeminiLocations([]);
    setShowGeminiSuggestions(false);

    try {
      const result = await findNearbyParking(location, "parking near me");
      setGeminiSummary(result.summary);
      setGeminiLocations(result.locations);
      setSearchResults(listings); 
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const renderListings = (isMobile: boolean = false) => (
    loading ? (
        <div className="py-8"><LoadingSpinner /></div>
    ) : searchResults.length > 0 ? (
        <div className={`grid grid-cols-1 ${isMobile ? 'md:grid-cols-2' : 'md:grid-cols-1 xl:grid-cols-2'} gap-6`}>
            {searchResults.map(listing => (
            <ListingCard 
                key={listing.id} 
                listing={listing} 
                onSelect={() => setSelectedListing(listing)} 
                onMouseEnter={() => setHoveredListingId(listing.id)}
                onMouseLeave={() => setHoveredListingId(null)}
            />
            ))}
        </div>
    ) : (
      !loading && (
        <div className="text-center py-8">
            <p className="text-slate-400 mb-4">No parking spots found. Try a different search.</p>
            <button 
                onClick={onJoinWaitlist}
                className="px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-sm hover:opacity-90"
            >
                Join Waitlist
            </button>
        </div>
      )
    )
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white">Find Parking Now</h2>
        <div className="mt-3 flex gap-3">
          <input 
            type="text" 
            placeholder="e.g., parking near Downtown" 
            className="flex-grow px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <button 
            onClick={handleSearch} 
            disabled={geoLoading || loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {geoLoading ? 'Getting Location...' : loading ? <LoadingSpinner /> : 'Search Nearby'}
          </button>
        </div>
        {geoError && <p className="text-red-400 text-sm mt-2">{geoError}</p>}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {geminiLocations.length > 0 && !showGeminiSuggestions && (
          <div className="text-center">
              <button onClick={() => setShowGeminiSuggestions(true)} className="px-4 py-2 text-sm font-medium text-purple-300 bg-purple-900 bg-opacity-50 rounded-md hover:bg-opacity-75">
                  Show AI Suggestions
              </button>
          </div>
      )}

      {showGeminiSuggestions && (
        <div className="bg-slate-800 border-l-4 border-purple-500 text-slate-300 p-4 rounded-r-lg" role="alert">
            <p className="font-bold mb-2 text-purple-400">Gemini Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
                {geminiLocations.map((loc, index) => (
                  <li key={index}>
                    <a href={loc.uri} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300">
                      {loc.title}
                    </a>
                  </li>
                ))}
            </ul>
            {geminiSummary && <p className="mt-2 text-sm">{geminiSummary}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white">Available Spots</h3>
              <div className="flex lg:hidden items-center bg-slate-700 rounded-full p-1">
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-slate-900 shadow-md' : 'hover:bg-slate-600'}`}>
                      <ListIcon className="h-5 w-5 text-gray-300" />
                  </button>
                  <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-full ${viewMode === 'map' ? 'bg-slate-900 shadow-md' : 'hover:bg-slate-600'}`}>
                      <MapIcon className="h-5 w-5 text-gray-300" />
                  </button>
              </div>
          </div>
          
          {/* List for Mobile */}
          <div className="lg:hidden">
            {viewMode === 'list' && renderListings(true)}
          </div>
          {/* Map for Mobile */}
          {viewMode === 'map' && (
            <div className="lg:hidden">
                <MapView listings={searchResults} onSelectListing={setSelectedListing} hoveredListingId={hoveredListingId}/>
            </div>
          )}

          {/* List for Desktop */}
          <div className="hidden lg:block space-y-4">
            {renderListings()}
          </div>
        </div>

        {/* Map for Desktop */}
        <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-120px)]">
                <MapView listings={searchResults} onSelectListing={setSelectedListing} hoveredListingId={hoveredListingId}/>
            </div>
        </div>
      </div>


      {selectedListing && (
        <ReservationModal 
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            onReserve={(res) => {
                onReserve(res);
                setSelectedListing(null);
            }}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
