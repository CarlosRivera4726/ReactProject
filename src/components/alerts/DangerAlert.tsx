import { ExclamationCircleIcon } from "@heroicons/react/16/solid"

interface DangerAlertProps {
    message: string
}

export default function DangerAlert({ message }: DangerAlertProps) {


    return (
        <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <ExclamationCircleIcon className="inline-block w-5 h-5 mr-2" />
            <span className="font-medium">{message}</span>
        </div>
    )
}