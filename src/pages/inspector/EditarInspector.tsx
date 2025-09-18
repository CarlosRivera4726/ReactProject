import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../const/ApiUrl";
import { useNavigate } from "react-router-dom";
import { Status } from "../../enums/Status.enum";
import { useForm, type SubmitHandler } from "react-hook-form";
import AlertsComponent from "../../components/alerts/Alerts.component";

type Inputs = {
    name: string
    lastName: string
    email: string
}

export const EditarInspector = () => {
    /* ACTION FORM */
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(Status.INFO);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const usuario = {
                id: inspector.personaId,
                name: data.name + ' ' + data.lastName,
                email: data.email,
            }
            console.log(usuario)

            const result = await axios.patch(`${API_URL}/persona/${inspector.personaId}`, usuario);
            console.log(result)
            const { message, status } = result.data;
            console.log(message, status)
            setMessage(message);
            setStatus(status === 200 ? Status.SUCCESS : Status.ERROR);
            if (status === 200) {
                reset();
            }
        } catch (error: AxiosError | unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const { message } = error.response.data;
                setMessage(message);
                setStatus(message.includes('correo') ? Status.INFO : Status.ERROR);
            } else {
                setMessage('Error desconocido');
                setStatus(Status.ERROR);
            }
        }
    }
    const navigate = useNavigate();
    const [inspector, setInspector] = useState({
        id: '',
        name: '',
        lastName: '',
        email: '',
        password: '',
        rol: '',
        personaId: 0
    });

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        if (id) {
            const getInspector = async () => {
                const res = await axios.get(`${API_URL}/inspector/${id}`);
                const { id: personaId, name, email, password, role } = res.data.persona;
                console.log({
                    id: id,
                    name: name.split(" ")[0],
                    lastName: name.split(" ")[1] ? name.split(" ")[1] : "",
                    email,
                    password,
                    rol: role,
                    personaId: personaId
                })
                setInspector({
                    id: id,
                    name: name.split(" ")[0],
                    lastName: name.split(" ")[1] ? name.split(" ")[1] : "",
                    email,
                    password,
                    rol: role,
                    personaId: personaId
                });
            }
            getInspector();
        }
    }, [])
    return (
        <div className="flex flex-col justify-center items-center text-black gap-10">
            <h1 className="text-3xl font-bold text-white">Editar Inspector</h1>
            {(message && message !== '') && <AlertsComponent message={message} status={status} />}
            <form className="flex flex-col w-96 gap-5 border border-white rounded-2xl p-5 bg-white text-black" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="name" className={`${errors.name ? 'text-red-500' : ''} block text-sm font-medium`}>*Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        defaultValue={inspector.name}
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
                        defaultValue={inspector.lastName}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="Apellido"
                        {...register("lastName", { required: true })}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className={`${errors.email ? 'text-red-500' : ''} block text-sm font-medium`}>*Email:</label>
                    <input
                        type="email"
                        id="email"
                        defaultValue={inspector.email}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
                        placeholder="juan@example.com"
                        {...register("email", { required: true })}
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Actualizar
                </button>
                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
                    navigate('/ver-inspectores');
                }}>
                    Cancelar
                </button>
            </form>
        </div>
    )
}