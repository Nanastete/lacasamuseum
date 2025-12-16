// src/context/DataContext.jsx - VERSION AVEC DEBUG
import { createContext, useContext, useState, useEffect } from 'react';
import { roomsDetailed } from '../data/roomsData';
import { 
  getRooms,
  getEnrichedRooms,
  getConfig, 
  getAccessories,
  clearCache 
} from '../services/dataManager';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  // Immediate data (hardcoded fallback) - NO loading state
  const [rooms, setRooms] = useState(roomsDetailed);
  const [accessories, setAccessories] = useState([]);
  const [config, setConfig] = useState({
    whatsappNumber: '59170675985',
    currency: 'USD',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    bookingRates: 9.6 // Default fallback
  });
  
  // Loading states - only for updates
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [dataSource, setDataSource] = useState('fallback');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const loadData = async (checkIn = new Date(), checkOut = null, silent = false) => {
    if (!silent) {
      console.log('📊 Loading data progressively...');
    }
    
    try {
      // Fetch all data in parallel
      const [roomsData, configData, accessoriesData] = await Promise.all([
        getEnrichedRooms(checkIn, checkOut),
        getConfig(),
        getAccessories()
      ]);

      // DEBUG: Log what we received
      console.log('🔍 DEBUG - Config loaded:', configData);
      console.log('🔍 DEBUG - bookingRates value:', configData?.bookingRates);
      console.log('🔍 DEBUG - bookingRates type:', typeof configData?.bookingRates);

      // Only update if we got valid data from Sheets
      if (roomsData && roomsData.length > 0) {
        setRooms(roomsData);
        setDataSource('sheets');
        console.log('✅ Updated with Google Sheets data');
      } else {
        setDataSource('fallback');
        console.log('📦 Using hardcoded fallback data');
      }

      // Update config if available
      if (configData && configData.whatsappNumber) {
        console.log('✅ Updating config state with:', configData);
        setConfig(configData);
      } else {
        console.log('⚠️ Config data incomplete, keeping default');
      }

      // Update accessories if available
      if (accessoriesData) {
        setAccessories(accessoriesData);
      }

      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setDataSource('fallback');
    } finally {
      setIsInitialLoad(false);
    }
  };

  const refreshData = async (checkIn = new Date(), checkOut = null) => {
    clearCache();
    await loadData(checkIn, checkOut);
  };

  useEffect(() => {
    // Initial load in background
    loadData(new Date(), null, true);

    // Auto-refresh every 5 minutes (silent updates)
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing data (silent)...');
      loadData(new Date(), null, true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // DEBUG: Log when config changes
  useEffect(() => {
    console.log('🔄 Config state updated:', config);
    console.log('   bookingRates:', config.bookingRates, typeof config.bookingRates);
  }, [config]);

  return (
    <DataContext.Provider
      value={{
        rooms,
        accessories,
        config,
        isLoading: false,
        isInitialLoad,
        dataSource,
        lastUpdateTime,
        refreshData,
        loadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}