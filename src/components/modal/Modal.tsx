// src/components/ui/SimpleModal.tsx
import React from "react";

type ModalState = "info" | "success" | "warning" | "error" | "question";

type BtnVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ModalAction {
    label: string;
    onClick?: () => void;
    variant?: BtnVariant;
}

interface SimpleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;     // <- pásale setOpen directamente
    title?: React.ReactNode;
    description?: React.ReactNode;
    state?: ModalState;                         // <- cambia el icono/colores
    closeOnOverlay?: boolean;                   // default: true
    showClose?: boolean;                        // default: true
    primary?: ModalAction;                      // botón principal
    secondary?: ModalAction;                    // botón secundario (opcional)
    children?: React.ReactNode;                 // contenido custom (opcional)
    className?: string;                         // estilos extra del panel
    cancelButton?: boolean;
    finalizedButton?: boolean;
}

const stateTheme: Record<ModalState, { bg: string; ring: string; text: string }> = {
    info: { bg: "bg-blue-50", ring: "ring-blue-200", text: "text-blue-700" },
    success: { bg: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-700" },
    warning: { bg: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-700" },
    error: { bg: "bg-rose-50", ring: "ring-rose-200", text: "text-rose-700" },
    question: { bg: "bg-indigo-50", ring: "ring-indigo-200", text: "text-indigo-700" },
};

function StateIcon({ state = "info" }: { state?: ModalState }) {
    const base = "h-5 w-5";
    switch (state) {
        case "success":
            return (<svg className={base} viewBox="0 0 24 24" fill="none"><path d="M20 7L10 17l-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
        case "warning":
            return (<svg className={base} viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
        case "error":
            return (<svg className={base} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
        case "question":
            return (<svg className={base} viewBox="0 0 24 24" fill="none"><path d="M9.09 9a3 3 0 1 1 4.82 2.4c-.86.64-1.41 1.01-1.41 2.1v.5M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
        default: // info
            return (<svg className={base} viewBox="0 0 24 24" fill="none"><path d="M12 8h.01M11 12h1v6m0-14a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    }
}

function btnClasses(variant: BtnVariant = "primary") {
    const base = "h-10 px-4 rounded-lg font-medium focus:outline-none focus:ring-2";
    const map: Record<BtnVariant, string> = {
        primary: `${base} bg-[#2B68FF] text-white hover:bg-[#2B68FF]/90 focus:ring-blue-300`,
        secondary: `${base} bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300`,
        danger: `${base} bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-300`,
        ghost: `${base} bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300`,
    };
    return map[variant];
}

const Modal: React.FC<SimpleModalProps> = ({
    open,
    onOpenChange,
    title,
    description,
    state = "info",
    closeOnOverlay = true,
    showClose = true,
    primary,
    secondary,
    children,
    className = "",
    cancelButton = false,
    finalizedButton = false,
}) => {
    console.log('cancel', cancelButton)
    if (!open) return null;

    const theme = stateTheme[state];

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => closeOnOverlay && onOpenChange(false)}
            />
            {/* panel centered */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl ${className}`}>
                    {/* header */}
                    <div className="px-5 pt-5 flex items-start justify-between">
                        <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm ring-1 ${theme.bg} ${theme.ring} ${theme.text}`}>
                            <StateIcon state={state} />
                        </div>
                        {showClose && (
                            <button
                                onClick={() => onOpenChange(false)}
                                className="ml-3 inline-flex items-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Cerrar"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* content */}
                    <div className="px-5 py-4">
                        {title && <h2 className="text-lg font-semibold text-slate-900 mb-1">{title}</h2>}
                        {description && <p className="text-slate-600">{description}</p>}
                        {children}
                    </div>

                    {/* footer */}
                    {(primary || secondary || cancelButton) && (
                        <div className="px-5 pb-5 pt-2 flex items-center justify-end gap-2">
                            {secondary && (
                                <button
                                    className={btnClasses(secondary.variant)}
                                    onClick={secondary.onClick}
                                >
                                    {secondary.label}
                                </button>
                            )}
                            {primary && (
                                <button
                                    className={btnClasses(primary.variant)}
                                    onClick={primary.onClick}
                                >
                                    {primary.label}
                                </button>
                            )}
                            {cancelButton && (
                                <button
                                    className={btnClasses('ghost')}
                                    onClick={() => console.log('cancelado')}>
                                    Cancelar
                                </button>
                            )}
                            {finalizedButton && (
                                <button
                                    className={btnClasses('danger')}
                                    onClick={() => console.log('cancelado')}>
                                    Finalizar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
