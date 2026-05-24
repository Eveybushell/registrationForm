import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';

export default function RegistrationForm() {
    const {register, handleSubmit, reset, watch, getValues, formState: { errors, isSubmitting }} = useForm();

    const fullNameRef = useRef(null);
    const { ref: rhfRef, ...rest } = register("fullName",{
                        required: 'Full Name is required',
                        minLength:{
                            value: 3,
                            message: 'Minimum length is 3 characters'
                        }
                    });

    const mergedRef = (element) => {
        rhfRef(element);
        fullNameRef.current = element;
    };

   async function onSubmit(data) {
    console.log(data)
    await new Promise(resolve => setTimeout(resolve, 2000));
    reset();
    localStorage.clear();}

    useEffect(() => {
        fullNameRef.current.focus();
    },[]);

    useEffect(() => {
        const draft = watch((values) => {
            localStorage.setItem("registrationDraft", JSON.stringify(values));
        });

        return () => draft.unsubscribe();

    },[])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor='fullName'>Full Name</label>
                <input
                    ref={mergedRef}
                    id='fullName'
                    type='text'
                    {...rest}
                />
                <span>{errors.fullName?.message}</span>

                <label htmlFor='email'>Email Address</label>
                <input
                    id='email'
                    type='email'
                    {...register('email',{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/,
                            message: 'Valid email is required'
                        }
                    })}
                />
                <span>{errors.email?.message}</span>

                <label htmlFor='password'>Password</label>
                <input
                    id='password'
                    type='password'
                    {...register('password',{
                        required: 'Password is required',
                        pattern: {
                            value: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/,
                            message: 'Password must have at least 8 characters and at least one uppercase and one lowercase character and one number'
                        }
                    })}
                />
                <span>{errors.password?.message}</span>

                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                    id='confirmPassword'
                    type='password'
                    {...register('confirmPassword',{
                        required: 'Please confirm your password',
                        validate: value => value === getValues('password') || "Password does not match"
                    })}
                />
                <span>{errors.confirmPassword?.message}</span>

               <label htmlFor='role'>Role</label>
                <select id='role' {...register('role',{
                    required: 'Please select a role',
                })
                }>
                    <option value=""disabled>Select a role</option>
                    <option value="developer">developer</option>
                    <option value="designer">designer</option>
                    <option value="productManager">product manager</option>
                </select>

                <label htmlFor='terms'>Terms & Conditions</label>
                <input
                    id='terms'
                    type='checkbox'
                    {...register('terms',{
                        required: 'Please accept the terms & conditions',
                    })}
                />
                <span>{errors.terms?.message}</span>
                <button type='submit' disabled={isSubmitting} >{isSubmitting ? "Registering" : "Register"}</button>
            </form>

        </>
    )
}
