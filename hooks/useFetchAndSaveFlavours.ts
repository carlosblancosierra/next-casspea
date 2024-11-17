import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { setFlavours } from '@/redux/features/flavour/flavourSlice';

const useFetchAndSaveFlavours = () => {
  const dispatch = useDispatch();

  // Get flavours from the API
const { data: flavours, isLoading, isError } = useGetFlavoursQuery({});  // no argument needed

  // Save the flavours to the store
  useEffect(() => {
    if (flavours && !isLoading && !isError) {
      dispatch(setFlavours(flavours));
    }
  }, [flavours, isLoading, isError, dispatch]);

  return { flavours, isLoading, isError };
};

export default useFetchAndSaveFlavours;
