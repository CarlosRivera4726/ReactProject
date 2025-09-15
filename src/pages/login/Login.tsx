import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../enums/Status.enum";
import { useAuth } from "../../hooks/useAuth";
import { API_URL } from "../../const/ApiUrl";
import type { IUser } from "../../interfaces/user.interface";
import LoadingComponent from "../../components/LoadingComponent";
import AlertsComponent from "../../components/alerts/Alerts.component";

type Inputs = {
    email: string
    password: string
}



export default function Login() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(Status.INFO);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const createTestUser = async () => {
        try {
            const testUserInspector = {
                name: "inspector",
                email: "inspector1@gmail.com",
                password: "123",
                role: 'INSPECTOR'
            };

            const testUserAdmin = {
                name: "admin",
                email: "admin1@gmail.com",
                password: "123",
                role: 'ADMIN'
            };

            const testUser = {
                name: "user",
                email: "user1@gmail.com",
                password: "123",
                role: 'USER'
            };

            await axios.post(`${API_URL}/persona`, testUserInspector);
            await axios.post(`${API_URL}/persona`, testUserAdmin);
            await axios.post(`${API_URL}/persona`, testUser);
            setMessage("Usuario de prueba creado exitosamente");
            setStatus(Status.SUCCESS);
        } catch (error) {
            console.log(error);
            setMessage("Error al crear usuario de prueba");
            setStatus(Status.ERROR);
        }
    };

    const onSubmit: SubmitHandler<Inputs> = async (data: IUser) => {
        setLoading(true);
        try {
            const result = await axios.post(`${API_URL}/auth/login`, data);

            if (result && result.data) {
                login(result.data.access_token, result.data.email, result.data.role);
                navigate('/home');
            }
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                setMessage("Usuario no autenticado, por favor intente nuevamente.")
                setStatus(Status.ERROR);
            }
        } finally {
            setLoading(false);
        }
    }

    return (loading ? (
        <LoadingComponent />
    ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center gap-10 w-full">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">Iniciar Sesion</h1>

            {message !== '' ? <AlertsComponent message={message} status={status} /> : null}


            {/*crear usuario de prueba*/}
            <button
                onClick={createTestUser}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            ></button>

            <form className=" justify-center items-center w-96" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo Electronico:</label>
                    <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        {...register("email", { required: true })}
                        placeholder="name@test.com" />
                    {errors.email && <span className="text-red-600">El campo es obligatorio.</span>}
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        {...register("password", { required: true })}
                    />
                    {errors.password && <span className="text-red-600">El campo es obligatorio.</span>}
                </div>
                <button
                    type="submit"
                    className={
                        `${errors.email || errors.password ? 'cursor-not-allowed disabled:bg-gray-300 disabled:cursor-not-allowed text-black' : 'cursor-pointer text-white'}` +
                        ` bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`
                    }
                    disabled={!!errors.email || !!errors.password}
                >
                    Ingresar
                </button>
            </form>
        </div>
    )
    )


}
