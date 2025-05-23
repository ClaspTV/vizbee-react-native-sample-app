import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
    AUTH_TOKEN: '@vizbee_auth_token',
    REG_CODE: '@vizbee_reg_code',
    HOME_SSO_TESTCASE: '@vizbee_home_sso_testcase'
} as const;

const LOG_TAG = 'Storage';

export const Storage = {
    getAuthToken: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to get auth token:`, error);
            return null;
        }
    },

    setAuthToken: async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to save auth token:`, error);
            throw error;
        }
    },

    getRegCode: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(StorageKeys.REG_CODE);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to get reg code:`, error);
            return null;
        }
    },

    setRegCode: async (regCode: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(StorageKeys.REG_CODE, regCode);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to save reg code:`, error);
            throw error;
        }
    },

    getHomeSSOTestcase: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(StorageKeys.HOME_SSO_TESTCASE);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to get HOME_SSO testcase:`, error);
            return null;
        }
    },

    setHomeSSOTestcase: async (testcase: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(StorageKeys.HOME_SSO_TESTCASE, testcase);
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to save HOME_SSO testcase:`, error);
            throw error;
        }
    },

    getItem: async (key: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    },
    
    setItem: async(key: string, value: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
        }
    },

    clearAll: async (): Promise<void> => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error(`${LOG_TAG}: Failed to clear storage:`, error);
            throw error;
        }
    }
};