import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../const/ApiUrl";
import { Status } from "../../enums/Status.enum";
import type { Usuario } from "../../interfaces/usuario.interface";
import EditIcon from "../../assets/EditIcon";
import TrashIcon from "../../assets/trash";


const VerUsuarios = () => {
    const [message, setMessage] = useState('');
    const [_, setStatus] = useState(Status.INFO)

    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    const getUsuarios = async () => {
        try {
            const result = await axios.get(`${API_URL}/usuario`);
            const { message, data } = result.data;
            setUsuarios(data);
            setMessage(message);
            setStatus(Status.SUCCESS);
        } catch (error) {
            setMessage(message);
            setStatus(Status.ERROR);
        }
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    const handleClick = () => {
        console.log('Row clicked');
    }

    return (
        <div className="flex flex-col justify-center items-center text-white gap-14">
            <h1 className="text-3xl font-bold">Usuarios</h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[70rem]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nombre Completo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Contrasena
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Opciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} className="bg-white text-black border-b border-gray-200 cursor-pointer hover:bg-gray-100" onClick={handleClick}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {`USR-${String(usuario.id).padStart(7, '0')}`}
                                    </th>
                                    <td className="px-6 py-4">
                                        {usuario.persona.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {usuario.persona.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {'•'.repeat(10)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-start items-center gap-2">
                                            <div>
                                                <EditIcon />
                                            </div>
                                            <div>
                                                <TrashIcon />
                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                <td colSpan={6} className="px-6 py-4 text-center">
                                    No hay usuarios disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default VerUsuarios;
