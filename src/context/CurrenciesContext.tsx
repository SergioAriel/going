'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { getCurrencies } from "@/lib/ServerActions/cryptocurrencies";
import { Currency } from "@/interfaces";


interface CurrenciesContextType {
	listCryptoCurrencies: Currency[];
	userCurrency: {
		currency: string;
		price: number;
	}
}

const CurrenciesContext = createContext<CurrenciesContextType | undefined>(undefined)

export const CurrenciesProvider = ({ children }: { children: React.ReactNode }) => {
	const { userData } = useUser();
	const [listCryptoCurrencies, setCurrencies] = useState<Currency[]>([])
	const [userCurrency, setUserCurrency] = useState({
		currency: userData.settings.currency,
		price: 0
	});

	useEffect(() => {
		(async () => {
			const currencies:Currency[] = await getCurrencies();
			setCurrencies(currencies);
			setUserCurrency({
				currency: userData.settings.currency,
				price: currencies.find((currency: Currency) => currency.symbol === userData.settings.currency)?.price || 0
			});
		})()
	}, [userData]);

	return (
		<CurrenciesContext.Provider value={{ listCryptoCurrencies, userCurrency }}>
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