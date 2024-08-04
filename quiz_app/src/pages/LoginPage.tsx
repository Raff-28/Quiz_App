import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Card } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

type Props = {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

type LoginData = {
    username: string;
    password: string;
};

const schema = yup.object().shape({
    username: yup.string().required("Username must be filled"),
    password: yup
        .string()
        .required("Password must be filled"),
});

export const LoginPage = (props: Props) => {

    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onTouched',
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: LoginData) => {
        const registeredUsername = localStorage.getItem('username');
        const registeredPassword = localStorage.getItem('password');
        if (data.username == registeredUsername && data.password == registeredPassword) {
            props.setIsLoggedIn(true);
            navigate('/');
        } else {
            setLoginError(true);
        };
    };

    return (
        <>
            <div className="container p-5 100vh w-50">
                <Card className="shadow">
                    <Card.Header className="bg-info">
                        <Card.Title className="text-light"><strong>Welcome to React Quiz App</strong></Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="d-flex flex-column align-items-center">
                                <div className="text-center mb-4">
                                    <img src="/react.svg" alt="logo" style={{ width: "7rem" }} />
                                </div>
                                <div className="d-flex flex-column align-items-start">
                                    <div className='mb-3 d-flex flex-column align-items-start'>
                                        <div className="input-group">
                                            <span className="input-group-text input-addon-start" id="username-addon">
                                                <i className="bi-person-fill"></i>
                                            </span>
                                            <input type="username" className="form-control" placeholder="Username" {...register("username")} aria-label="username" aria-describedby="username-addon" />
                                        </div>
                                        {errors.username && <div className="text-danger" style={{ maxWidth: "310px" }}>{errors.username.message}</div>}
                                    </div>
                                    <div className='mb-4 d-flex flex-column align-items-start'>
                                        <div className="input-group">
                                            <span className="input-group-text input-addon-start" id="password-addon">
                                                <i className="bi-lock-fill"></i>
                                            </span>
                                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" {...register("password")} aria-label="Password" aria-describedby="password-addon" />
                                            <button className="btn btn-outline-secondary" type="button" id="show-password-addon" onClick={() => { setShowPassword((prev) => !prev) }}>
                                                <i className={showPassword ? "bi-eye-fill text-primary" : "bi-eye-slash-fill"}></i>
                                            </button>
                                        </div>
                                        {errors.password && <div className="text-danger" style={{ maxWidth: "310px" }}>{errors.password.message}</div>}
                                </div>
                                </div>
                                {
                                    loginError &&
                                    <div className="alert alert-danger py-1 text-center" role="alert">
                                        Username atau password tidak terdaftar
                                    </div>
                                }
                                <div className='text-center'>
                                    <button type="submit" className="btn btn-primary mb-3"><strong>Log In</strong></button>
                                </div>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}