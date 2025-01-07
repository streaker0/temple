import { useEffect } from 'react';

export const useBalanceEffect = (balance: number) => {
    useEffect(() => {
        localStorage.setItem('gameBalance', balance.toString());
    }, [balance]);
};