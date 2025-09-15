import { ExclamationCircleIcon } from "@heroicons/react/16/solid"
import { Status } from "../../enums/Status.enum";


const AlertsComponent = ({ message, status }: { message: string; status: string }) => {
    return (
        <>
            {status === Status.INFO && (
                <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                    <ExclamationCircleIcon className="inline-block w-5 h-5 mr-2" />
                    <span className="font-medium">{message}</span>
                </div>
            )}
            {status === Status.ERROR && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <ExclamationCircleIcon className="inline-block w-5 h-5 mr-2" />
                    <span className="font-medium">{message}</span>
                </div>
            )}
            {status === Status.SUCCESS && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <ExclamationCircleIcon className="inline-block w-5 h-5 mr-2" />
                    <span className="font-medium">{message}</span>
                </div>
            )}
            {status === Status.WARNING && (
                <div className="flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                    <ExclamationCircleIcon className="inline-block w-5 h-5 mr-2" />
                    <span className="font-medium">{message}</span>
                </div>
            )}
        </>
    );
}

export default AlertsComponent;