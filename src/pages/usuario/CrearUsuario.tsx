import axios from "axios"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { Status } from "../../enums/Status.enum"
import { API_URL } from "../../const/ApiUrl"
import AlertsComponent from "../../components/alerts/Alerts.component"

type Inputs = {
    name: string
    lastName: string
    email: string
    password: string
    confirm_password: string
}

const CrearUsuario = () => {

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(Status.INFO);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // const location = {
        //     name: data.ubicacion,
        //     coordinates: data.latitud + ',' + data.longitud,
        // }

        const result = await axios.post(`${API_URL}/location`, location);
        console.log(result.data)
        const { message, status } = result.data;
        setMessage(message);
        setStatus(status === 201 ? Status.SUCCESS : Status.ERROR);
        if (status === 201) {
            reset();
        }
    }
    return (
        <div className="flex flex-col justify-center items-center text-white gap-10">
            <h1 className="text-3xl font-bold">Crear Usuario</h1>

            {(message && message !== '') && <AlertsComponent message={message} status={status} />}

            <form className="flex flex-col w-96 gap-5 border border-white rounded-2xl p-5 bg-white text-black" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="name" className={`${errors.name ? 'text-red-500' : ''} block text-sm font-medium`}>*Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Juan"
                        {...register("name", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className={`${errors.lastName ? 'text-red-500' : ''} block text-sm font-medium`}>*Apellido:</label>
                    <input
                        type="text"
                        id="lastName"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Perez"
                        {...register("lastName", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className={`${errors.email ? 'text-red-500' : ''} block text-sm font-medium`}>*Email</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="juan@mail.com"
                        {...register("email", { required: true })}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className={`${errors.password ? 'text-red-500' : ''} block text-sm font-medium`}>*Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Contraseña"
                        {...register("password", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirm_password" className={`${errors.confirm_password ? 'text-red-500' : ''} block text-sm font-medium`}>*Confirmar contraseña:</label>
                    <input
                        type="password"
                        id="confirm_password"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Confirmar contraseña"
                        {...register("confirm_password", { required: true })}
                    />
                </div>

                <div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold cursor-pointer">Registrar</button>
                </div>
            </form>
        </div>
    )
}

export default CrearUsuario;