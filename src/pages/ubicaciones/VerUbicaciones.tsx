import { useEffect, useState } from "react";
import { Status } from "../../enums/Status.enum";
import type { Location } from "../../interfaces/location.interface";
import axios from "axios";
import { API_URL } from "../../const/ApiUrl";
import { StatusLocation } from "../../const/Status";
import StatusLocationComponent from "../../components/StatusLocation.component";
import { PencilIcon } from "@heroicons/react/24/outline";
import pencilsvg from "../../assets/pencil.svg";

const VerUbicaciones = () => {
    const [ubicaciones, setUbicaciones] = useState<Location[]>([]);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(Status.INFO);

    const getUbicaciones = async () => {
        try {
            const result = await axios.get(`${API_URL}/location`);
            const { message, data } = result.data;
            setUbicaciones(data);
            setMessage(message);
            setStatus(Status.SUCCESS);
        } catch (error) {
            console.log(error);
            setMessage(message);
            setStatus(Status.ERROR);
        }
    }

    useEffect(() => {
        getUbicaciones();
    }, []);
    return (
        <div className="flex flex-col justify-center items-center text-white gap-14">
            <h1 className="text-3xl font-bold">Ver Ubicaciones</h1>

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
                        {ubicaciones && ubicaciones.length > 0 ? (
                            ubicaciones.map((ubicacion) => (
                                <tr key={ubicacion.id} className="odd:bg-white odd:text-black even:bg-[#706f9a] even:text-black border-b border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {`UBI-${String(ubicacion.id).padStart(6, '0')}`}
                                    </th>
                                    <td className="px-6 py-4">
                                        {ubicacion.coordinates.split(',')[0]}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ubicacion.coordinates.split(',')[1]}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ubicacion.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusLocationComponent
                                            status={StatusLocation[ubicacion.status as keyof typeof StatusLocation]}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-start items-center gap-2">
                                            <div data-tooltip-target="tooltip-dark">
                                                <img src={pencilsvg} alt="pencil" width={35} className="cursor-pointer" />
                                            </div>
                                            <div id="tooltip-dark" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                                                Tooltip content
                                                <div className="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                <td colSpan={6} className="px-6 py-4 text-center">
                                    No hay ubicaciones disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default VerUbicaciones;