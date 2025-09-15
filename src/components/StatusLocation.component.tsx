import { StatusLocation } from "../const/Status"


const StatusLocationComponent = ({ status }: { status: string }) => {
    const statusMap = {
        [StatusLocation.AVAILABLE]: {
            color: 'border border-green-400 text-green-400 text-center',
            text: 'Disponible'
        },
        [StatusLocation.UNAVAILABLE]: {
            color: 'border border-red-500 text-red-500 text-center',
            text: 'No Disponible'
        },
    }
    return (
        <div className={`${statusMap[status].color} px-2 py-1 rounded-sm w-32`}>
            {statusMap[status].text}
        </div>
    )
}

export default StatusLocationComponent