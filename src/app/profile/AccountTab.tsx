import { useUser } from "@/context/UserContext";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";

export const AccountTab = () => {
  const { ready, authenticated, user, linkGoogle } = usePrivy();
  const { userData, setUserData } = useUser();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
      <form className="space-y-6">
        <div
          className="flex flex-col gap-8 items-center rounded-lg p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(ready && authenticated) ? (e) => {

            e.preventDefault();
            const file = e.dataTransfer.files;
            if (file) {
              setUserData((prev) => ({
                ...prev,
                avatar: URL.createObjectURL(file[0]),
              }));
            }
          }
            : undefined
          }
        >
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={userData?.avatar || "/logo.png"}
              alt={userData?.name || "User Avatar"}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              Drag and drop images or
            </p>
            <label
              htmlFor="imageUpload"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Upload images
            </label>
            <input
              id="imageUpload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUserData((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(file),
                  }));
                }
              }}
              type="file"
              multiple
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={userData?.name}
              onChange={(e) => setUserData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={userData?.email}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              defaultValue={userData?.location}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              defaultValue={userData?.bio}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

        </div>

        {/* button login google */}
        {
          !user?.google &&
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-2 bg-white text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              onClick={linkGoogle}
            >
              <span>Sign in with Google</span>
            </button>
          </div>
        }
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                placeholder="Enter your website URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="x" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                X
              </label>
              <input
                type="url"
                id="x"
                placeholder="Enter your X profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                placeholder="Enter your Facebook profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                placeholder="Enter your Instagram profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telegram
              </label>
              <input
                type="url"
                id="telegram"
                placeholder="Enter your Telegram profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};