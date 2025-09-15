import axios from "axios"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { Status } from "../../enums/Status.enum"
import { API_URL } from "../../const/ApiUrl"
import AlertsComponent from "../../components/alerts/Alerts.component"

type Inputs = {
    latitud: string
    longitud: string
    ubicacion: string
}


const CrearUbicacion = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(Status.INFO);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const location = {
            name: data.ubicacion,
            coordinates: data.latitud + ',' + data.longitud,
        }

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
        <div className="flex flex-col justify-center items-center text-white gap-20">
            <h1 className="text-2xl font-bold">Registro Ubicacion</h1>
            {(message && message !== '') && <AlertsComponent message={message} status={status} />}

            <form className="w-96" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="latitud" className={`${errors.latitud ? 'text-red-500' : ''} block text-sm font-medium`}>*Latitud</label>
                    <input
                        type="text"
                        id="latitud"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Latitud"
                        {...register("latitud", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="longitud" className={`${errors.longitud ? 'text-red-500' : ''} block text-sm font-medium`}>*Longitud</label>
                    <input
                        type="text"
                        id="longitud"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Longitud"
                        {...register("longitud", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ubicacion" className={`${errors.ubicacion ? 'text-red-500' : ''} block text-sm font-medium`}>*Ubicacion</label>
                    <input
                        type="text"
                        id="ubicacion"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Nombre Ubicacion"
                        {...register("ubicacion", { required: true })}
                    />
                </div>

                <div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold cursor-pointer">Registrar</button>
                </div>
            </form>
        </div>
    )
}

export default CrearUbicacion;