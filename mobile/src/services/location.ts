import * as Location from 'expo-location';

export interface LocationCoords {
    latitude: number;
    longitude: number;
}

export interface LocationData {
    coords: LocationCoords;
    address?: string;
}

export const locationService = {
    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    },

    async getCurrentLocation(): Promise<LocationData | null> {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                throw new Error('Location permission not granted');
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            return {
                coords: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            return null;
        }
    },

    async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
        try {
            const addresses = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (addresses && addresses.length > 0) {
                const address = addresses[0];
                return `${address.street || ''} ${address.city || ''}, ${address.region || ''} ${address.country || ''}`.trim();
            }

            return null;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    },

    async getLocationWithAddress(): Promise<LocationData | null> {
        try {
            const location = await this.getCurrentLocation();
            if (!location) {
                return null;
            }

            const address = await this.reverseGeocode(
                location.coords.latitude,
                location.coords.longitude
            );

            return {
                ...location,
                address: address || undefined,
            };
        } catch (error) {
            console.error('Error getting location with address:', error);
            return null;
        }
    },

    calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        // Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    },

    toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    },
};
