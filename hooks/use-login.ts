import { useState, ChangeEvent, FormEvent } from 'react';
import { useLoginMutation } from '@/redux/features/auth/authApiSlice';
import { toast } from 'react-toastify';
import useAfterSignIn from './useAfterSignIn';

export default function useLogin() {
	const [login, { isLoading }] = useLoginMutation();
	const afterSignIn = useAfterSignIn();

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
				toast.success('Logged in');
				return afterSignIn();
			})
			.catch(() => {
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
