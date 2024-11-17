import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlavourType } from '@/types/flavours';
import { RootState } from '@/redux/store';
import flavours from './flavoursMockData';

interface FlavourState {
    flavours: FlavourType[];
}

const initialState: FlavourState = {
    flavours: [...flavours],
};

const flavourSlice = createSlice({
    name: 'flavours',
    initialState,
    reducers: {
        setFlavours(state, action: PayloadAction<FlavourType[]>) {
            state.flavours = action.payload;
        }
    },
});

export const { setFlavours } = flavourSlice.actions;
export const selectAllFlavours = (state: RootState): FlavourType[] => state.flavours.flavours;

export default flavourSlice.reducer;
