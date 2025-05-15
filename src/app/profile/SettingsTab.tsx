import { useUser } from "@/context/UserContext";
import { updateUser } from "@/lib/ServerActions/users";

export const SettingsTab = () => {
  const { userData, setUserData, handlerTheme } = useUser();

  const handleSettings = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    setUserData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        [name]: value,
      },
    }));
  };


  const handleSaveSettings = async () => {
    // Save settings to the database or perform any necessary actions
    updateUser({
      _id: userData._id,
      settings: {
        ...userData.settings,
      },
    })
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language Preferences</h3>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform Language
            </label>
            <select
              id="language"
              onChange={handleSettings}
              value={userData.settings.lenguage}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div> */}

        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferred Currency</h3>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency for displaying prices
            </label>
            <select
              id="currency"
              name="currency"
              onChange={handleSettings}
              value={userData.settings.currency}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="USD">USD - United States Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="ARS">ARS - Argentinian Peso</option>
              <option value="SOL">SOL - Solana</option>
            </select>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
          <div className="flex items-center space-x-4">
            <button onClick={() => handlerTheme("light")} className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-white border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Light</span>
            </button>
            <button onClick={() => handlerTheme("dark")} className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Dark</span>
            </button>
            <button onClick={() => handlerTheme("system")} className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">System</span>
            </button>
          </div>
        </div>

        {/* <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Active Sessions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your connected devices</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                View Sessions
              </button>
            </div>
          </div>
        </div> */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};