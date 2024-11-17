import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flavour } from '@/types/flavours';
import { RootState } from '@/redux/store';
import { createSelector } from '@reduxjs/toolkit';

interface FlavourState {
    flavours: Flavour[];
}

const initialState: FlavourState = {
    flavours: [],
};

const flavourSlice = createSlice({
    name: 'flavours',
    initialState,
    reducers: {
        setFlavours(state, action: PayloadAction<Flavour[]>) {
            state.flavours = action.payload;
        },
    },
});

// Base selector
const selectFlavoursState = (state: RootState) => state.flavours;

// Memoized selectors
export const selectAllFlavours = createSelector(
    [selectFlavoursState],
    (flavourState) => flavourState.flavours
);

export const selectActiveFlavours = createSelector(
    [selectAllFlavours],
    (flavours) => flavours.filter(flavour => flavour.active) || []
);

export const { setFlavours } = flavourSlice.actions;
export default flavourSlice.reducer;
