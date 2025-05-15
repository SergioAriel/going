import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import { Addresses } from "@/interfaces";
import { updateUser } from "@/lib/ServerActions/users";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const AddressesTab = () => {
  const { userData, setUserData } = useUser()
  const { handleAlert } = useAlert()
  const [address, setAddress] = useState<Addresses>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEditAddress, setSelectedEditAddress] = useState<number | null>(null);

  const handleUser = async (indexAddress: number | null) => {
    const fundName = userData?.addresses.find((savedAddress) => savedAddress.name === address.name);
    if (fundName) {
      handleAlert({
        message: "Address name already exists",
        isError: true
      })
    }
    if (Object.values(address).every((field: string) => address[field as keyof typeof address] !== "")) {
      handleAlert({
        message: "Please fill all fields",
        isError: true
      })
      return;
    }

    const updateUserData: Addresses[] = indexAddress ?
      (userData?.addresses || []).map((savedAddress, index) => {
        if (indexAddress === index) {
          return {
            ...savedAddress,
            ...address
          }
        }
        return savedAddress;
      }
      )
      :
      [...(userData?.addresses || []), address]

    const resUpdateUser = await updateUser({
      ...userData,
      addresses: updateUserData
    })

    if (resUpdateUser.status) {
      setUserData((prev) => {
        return {
          ...prev,
          addresses: updateUserData
        }
      });
      setAddress({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        phone: ""
      });
      setIsEditing(false);
      setSelectedEditAddress(null);
      handleAlert({
        message: "Address updated successfully",
        isError: false
      })
    } else {
      handleAlert({
        message: "Failed to update address",
        isError: true
      })
    }
  };

  const handleDeleteAddress = async (indexAddress: number) => {
    const resUpdateUser = await updateUser({
      ...userData,
      addresses: userData.addresses.filter((_, index) => index !== indexAddress)
    })

    if (resUpdateUser.status) {
      setUserData((prev) => {
        return {
          ...prev,
          addresses: prev.addresses.filter((_, index) => index !== indexAddress)
        }
      });
      handleAlert({
        message: "Address deleted successfully",
        isError: false
      })
    } else {
      handleAlert({
        message: "Failed to delete address",
        isError: true
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Addresses</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setIsEditing(true);
              setAddress({
                name: "",
                address: "",
                city: "",
                state: "",
                country: "",
                zip: "",
                phone: ""
              });
            }}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors">
            + Add Address
          </button>
        </div>

        {
          isEditing ?
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div
                className="relative w-min mb-4"
              >
                <input
                  onChange={(e) => {

                    setAddress({ ...address, name: e.target.value })
                  }}
                  type="text"
                  placeholder="Address Name"
                  className="text-lg font-medium text-gray-900 dark:text-white"
                  value={address.name}
                  required
                  autoFocus
                  autoComplete="none"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">

                  <PencilIcon className="w-4 h-4 " />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  placeholder="address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="Zip Code"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  placeholder="Country"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setAddress({
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      country: "",
                      zip: "",
                      phone: ""
                    });
                  }}
                  className="px-6 py-2 text-primary-dark rounded-lg font-medium transition-colors mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUser(selectedEditAddress)}
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
            :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                userData?.addresses?.map((address, indexAddress) => (
                  <div key={address.name as string} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="text-gray-900 dark:text-white font-medium">{address.name}</div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setSelectedEditAddress(indexAddress);
                            setAddress(address);
                          }
                          }
                          className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(indexAddress)}
                          className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-600 dark:text-gray-400">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.zip}</p>
                      <p>{address.country}</p>
                      <p>Tel: {address.phone}</p>
                    </div>
                  </div>
                ))
              }
            </div>
        }

      </div>
    </div>
  );
};