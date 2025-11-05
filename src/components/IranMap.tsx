import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building2 } from 'lucide-react';
import { iranProvinces, Province, City, searchCities } from '@/data/iranData';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IranMapProps {
  onLocationSelect?: (province: Province, city: City) => void;
  initialProvince?: string;
  initialCity?: string;
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

const IranMap: React.FC<IranMapProps> = ({ 
  onLocationSelect, 
  initialProvince, 
  initialCity 
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince || '');
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([32.4279, 53.6880]); // Center of Iran
  const [mapZoom, setMapZoom] = useState<number>(6);

  const currentProvince = iranProvinces.find(p => p.id === selectedProvince);
  const currentCity = currentProvince?.cities.find(c => c.id === selectedCity);

  // Handle province selection
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedCity(''); // Reset city when province changes
    
    const province = iranProvinces.find(p => p.id === provinceId);
    if (province) {
      setMapCenter(province.coordinates);
      setMapZoom(8);
    }
  };

  // Handle city selection
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    
    const province = iranProvinces.find(p => p.id === selectedProvince);
    const city = province?.cities.find(c => c.id === cityId);
    
    if (city) {
      setMapCenter(city.coordinates);
      setMapZoom(12);
      
      // Call the callback if provided
      if (onLocationSelect && province) {
        onLocationSelect(province, city);
      }
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = searchCities(query);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (city: City) => {
    const province = iranProvinces.find(p => 
      p.cities.some(c => c.id === city.id)
    );
    
    if (province) {
      setSelectedProvince(province.id);
      setSelectedCity(city.id);
      setMapCenter(city.coordinates);
      setMapZoom(12);
      setSearchQuery('');
      setSearchResults([]);
      
      if (onLocationSelect) {
        onLocationSelect(province, city);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-4">
      {/* Controls Panel */}
      <div className="w-full xl:w-80 space-y-4 order-2 xl:order-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              انتخاب موقعیت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجوی شهر..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-input rounded-md bg-background text-sm"
                dir="rtl"
              />
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSearchResultSelect(city)}
                      className="w-full px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground text-sm border-b border-border last:border-b-0"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Province Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">استان</label>
              <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب استان" />
                </SelectTrigger>
                <SelectContent>
                  {iranProvinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Selection */}
            {currentProvince && (
              <div>
                <label className="text-sm font-medium mb-2 block">شهر</label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب شهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentProvince.cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Selected Location Info */}
            {currentProvince && currentCity && (
              <div className="p-3 bg-accent rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">موقعیت انتخاب شده:</span>
                </div>
                <div className="space-y-1">
                  <Badge variant="secondary">{currentProvince.name}</Badge>
                  <Badge variant="outline">{currentCity.name}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats - Hidden on mobile */}
        <Card className="hidden md:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">آمار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">تعداد استان‌ها</div>
                <div className="font-semibold">{iranProvinces.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">تعداد شهرها</div>
                <div className="font-semibold">
                  {iranProvinces.reduce((sum, p) => sum + p.cities.length, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[400px] xl:min-h-[500px] order-1 xl:order-2">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%', minHeight: '400px' }}
              className="rounded-md z-0"
              zoomControl={true}
              scrollWheelZoom={true}
              touchZoom={true}
              doubleClickZoom={true}
              dragging={true}
            >
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Province Markers */}
              {iranProvinces.map((province) => (
                <Marker
                  key={province.id}
                  position={province.coordinates}
                  opacity={selectedProvince === province.id ? 1 : 0.6}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">{province.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {province.cities.length} شهر
                      </p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleProvinceChange(province.id)}
                      >
                        انتخاب استان
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* City Markers (only show if province is selected) */}
              {currentProvince && currentProvince.cities.map((city) => (
                <Marker
                  key={city.id}
                  position={city.coordinates}
                  opacity={selectedCity === city.id ? 1 : 0.4}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentProvince.name}
                      </p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => handleCityChange(city.id)}
                      >
                        انتخاب شهر
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IranMap;
