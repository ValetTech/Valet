import React, { useState } from 'react';
import { Listing } from '../types';
import { LocationMarkerIcon } from './Icons';

interface MapViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  hoveredListingId?: string | null;
}

const SF_BOUNDS = {
  minLat: 37.74,
  maxLat: 37.81,
  minLng: -122.48,
  maxLng: -122.38,
};

const projectCoordinates = (lat: number, lng: number) => {
  const latRange = SF_BOUNDS.maxLat - SF_BOUNDS.minLat;
  const lngRange = SF_BOUNDS.maxLng - SF_BOUNDS.minLng;
  
  const top = 100 - ((lat - SF_BOUNDS.minLat) / latRange) * 100;
  const left = ((lng - SF_BOUNDS.minLng) / lngRange) * 100;

  return {
    top: `${Math.max(0, Math.min(100, top))}%`,
    left: `${Math.max(0, Math.min(100, left))}%`,
  };
};


const MapView: React.FC<MapViewProps> = ({ listings, onSelectListing, hoveredListingId }) => {
    const [activePin, setActivePin] = useState<string | null>(null);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-full bg-slate-800 rounded-lg shadow-inner overflow-hidden border border-slate-700">
             <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://www.google.com/maps/vt/data=Ay5GW8o4lA-3-33GjopP7Nf4Y-u-5C-zIjbW8yVMaAAToUaW0jeQnF0YgGgT8lV8zS8U1Y01gP5tH8u8hI_kE6P5-0v4PjQep4M0BVe_750yU45kX_HwQ3_g0HwUys25K-zB2F04jFhC4fH1oK-C1gHrV2xT-gV12gI3vA')"}}></div>
            {listings.map(listing => {
                const { top, left } = projectCoordinates(listing.location.latitude, listing.location.longitude);
                const isActive = activePin === listing.id || hoveredListingId === listing.id;

                return (
                    <div 
                        key={listing.id} 
                        className="absolute transform -translate-x-1/2 -translate-y-full"
                        style={{ top, left, zIndex: isActive ? 10 : 1 }}
                        onMouseEnter={() => setActivePin(listing.id)}
                        onMouseLeave={() => setActivePin(null)}
                    >
                        {isActive && (
                            <div className="absolute bottom-full mb-2 w-48 bg-slate-800 border border-slate-600 p-2 rounded-lg shadow-lg text-xs transform -translate-x-1/2 left-1/2">
                                <p className="font-bold text-white">{listing.address}</p>
                                <p className="text-slate-300">${listing.rate}/{listing.rateType}</p>
                                 <button onClick={() => onSelectListing(listing)} className="text-purple-400 font-semibold mt-1 w-full text-left">Reserve</button>
                            </div>
                        )}
                        <LocationMarkerIcon 
                            className={`h-8 w-8 cursor-pointer transition-all duration-200 ${isActive ? 'text-purple-500 scale-125 drop-shadow-lg' : 'text-red-500'}`}
                            onClick={() => onSelectListing(listing)}
                         />
                    </div>
                );
            })}
        </div>
    );
}

export default MapView;
