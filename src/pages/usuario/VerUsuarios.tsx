import { useEffect, useState } from "react";
import PencilSVG from "../../assets/pencil.svg";
import TrashSVG from "../../assets/trash.svg";
import axios from "axios";
import { API_URL } from "../../const/ApiUrl";
import { Status } from "../../enums/Status.enum";
import type { Usuario } from "../../interfaces/usuario.interface";


const VerUsuarios = () => {
    const [message, setMessage] = useState('');
    const [_, setStatus] = useState(Status.INFO)

    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    const getUsuarios = async () => {
        try {
            const result = await axios.get(`${API_URL}/usuario`);
            const { message, data } = result.data;
            console.log(data)
            setUsuarios(data);
            setMessage(message);
            setStatus(Status.SUCCESS);
        } catch (error) {
            console.log(error);
            setMessage(message);
            setStatus(Status.ERROR);
        }
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center text-white gap-14">
            <h1 className="text-3xl font-bold">Ver Inspectores</h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
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
                                <tr key={usuario.id} className="odd:bg-white odd:text-black even:bg-[#706f9a] even:text-black border-b border-gray-200">
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
                                                <img src={PencilSVG} alt="pencil" width={35} className="cursor-pointer" />
                                            </div>
                                            <div>
                                                <img src={TrashSVG} alt="pencil" width={35} className="cursor-pointer" />
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
