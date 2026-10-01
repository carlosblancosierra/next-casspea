import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/auth/authApiSlice';
import { setAuth } from '@/redux/features/auth/authSlice';
import { toast } from 'react-toastify';

/**
 * Where to go after signing in. Honours ?next= so an emailed order link
 * survives the login redirect, but only for same-origin relative paths so the
 * parameter cannot be used as an open redirect.
 */
function nextDestination(): string {
	if (typeof window === 'undefined') return '/orders';
	const next = new URLSearchParams(window.location.search).get('next');
	if (next && next.startsWith('/') && !next.startsWith('//')) return next;
	return '/orders';
}

export default function useLogin() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login, { isLoading }] = useLoginMutation();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		login({ email, password })
			.unwrap()
			.then(() => {
				console.log('Before dispatch - Setting auth state');
				dispatch(setAuth());
				console.log('After dispatch - Auth state should be updated');
				toast.success('Logged in');
				router.push(nextDestination());
			})
			.catch((error) => {
				console.error('Login error:', error);
				toast.error('Failed to log in');
			});
	};

	return {
		email,
		password,
		isLoading,
		onChange,
		onSubmit,
	};
}
