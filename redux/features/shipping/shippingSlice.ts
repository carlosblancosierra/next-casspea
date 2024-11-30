import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShippingCompany } from '@/types/shipping';
import { RootState } from '@/redux/store';
import { createSelector } from '@reduxjs/toolkit';

interface ShippingState {
    companies: ShippingCompany[];
}

const initialState: ShippingState = {
    companies: [],
};

const shippingSlice = createSlice({
    name: 'shipping',
    initialState,
    reducers: {
        setShippingCompanies(state, action: PayloadAction<ShippingCompany[]>) {
            state.companies = action.payload;
        },
    },
});

// Base selector
const selectShippingState = (state: RootState) => state.shipping;

// Memoized selectors
export const selectAllShippingCompanies = createSelector(
    [selectShippingState],
    (shippingState) => shippingState.companies
);

export const selectAllShippingOptions = createSelector(
    [selectAllShippingCompanies],
    (companies) => companies.flatMap(company =>
        company.shipping_options.map(option => ({
            ...option,
            companyName: company.name,
            companyCode: company.code
        }))
    )
);

export const { setShippingCompanies } = shippingSlice.actions;
export default shippingSlice.reducer;
