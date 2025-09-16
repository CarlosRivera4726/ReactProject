import { useEffect, useState } from "react";
import type { Inspector } from "../../interfaces/inspector.interface";
import PencilSVG from "../../assets/pencil.svg";
import TrashSVG from "../../assets/trash.svg";
import axios from "axios";
import { API_URL } from "../../const/ApiUrl";
import { Status } from "../../enums/Status.enum";


const VerInspectores = () => {
    const [message, setMessage] = useState('');
    const [_, setStatus] = useState(Status.INFO)

    const [inspectores, setInspectores] = useState<Inspector[]>([])

    const getInspectores = async () => {
        try {
            const result = await axios.get(`${API_URL}/inspector`);
            const { message, data } = result.data;
            console.log(data)
            setInspectores(data);
            setMessage(message);
            setStatus(Status.SUCCESS);
        } catch (error) {
            console.log(error);
            setMessage(message);
            setStatus(Status.ERROR);
        }
    }

    useEffect(() => {
        getInspectores();
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
                                Latitud
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Longitud
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ubicacion
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspectores && inspectores.length > 0 ? (
                            inspectores.map((inspector) => (
                                <tr key={inspector.id} className="odd:bg-white odd:text-black even:bg-[#706f9a] even:text-black border-b border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {`INSP-${String(inspector.id).padStart(7, '0')}`}
                                    </th>
                                    <td className="px-6 py-4">
                                        {inspector.persona.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {inspector.persona.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {'•'.repeat(10)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {inspector.locationId === null ? "No hay Ubicacion" : inspector.location.name}
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
                                    No hay inspectores disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default VerInspectores;
