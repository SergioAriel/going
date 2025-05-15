'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

type Currency = {
	symbol: string,
	name: string,
	price: number,
}

interface CurrenciesContextType {
	listCurrencies: Currency[];
	userCurrency: {
		currency: string;
		price: number;
	}
}

const CurrenciesContext = createContext<CurrenciesContextType | undefined>(undefined)

export const CurrenciesProvider = ({ children }: { children: React.ReactNode }) => {
	const { userData } = useUser();
	const [listCurrencies, setCurrencies] = useState([])
	const [userCurrency, setUserCurrency] = useState({
		currency: userData.settings.currency,
		price: 0
	});

	useEffect(() => {
		(async () => {
			const response = await fetch(`/api/cryptocurrencies`);
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			console.log(data);

			setCurrencies(data);
			setUserCurrency({
				currency: userData.settings.currency,
				price: data.find((currency: Currency) => currency.symbol === userData.settings.currency)?.price || 0
			});
		})()
	}, [userData.settings.currency]);

	return (
		<CurrenciesContext.Provider value={{ listCurrencies, userCurrency }}>
			{children}
		</CurrenciesContext.Provider>
	);
}

export const useCurrencies = () => {
	const context = useContext(CurrenciesContext);
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}