import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../enums/Status.enum";
import { useAuth } from "../../hooks/useAuth";
import { API_URL } from "../../const/ApiUrl";
import type { IPersona } from "../../interfaces/persona.interface";
import LoadingComponent from "../../components/LoadingComponent";
import AlertsComponent from "../../components/alerts/Alerts.component";

type Inputs = { email: string; password: string };

export default function Login() {
    const SHOW_TEST_USER_BUTTON = true;
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(Status.INFO);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const createTestUser = async () => {
        try {
            const testUserInspector = { name: "inspector", email: "inspector1@gmail.com", password: "123", role: "INSPECTOR" };
            const testUserAdmin = { name: "admin", email: "admin1@gmail.com", password: "123", role: "ADMIN" };
            const testUser = { name: "user", email: "user1@gmail.com", password: "123", role: "USUARIO" };

            await axios.post(`${API_URL}/persona`, testUserInspector);
            await axios.post(`${API_URL}/persona`, testUserAdmin);
            await axios.post(`${API_URL}/persona`, testUser);

            setMessage("Usuario de prueba creado exitosamente");
            setStatus(Status.SUCCESS);
        } catch (error) {
            console.log(error);
            setMessage("Error al crear usuario de prueba");
            setStatus(Status.ERROR);
        }
    };

    const onSubmit: SubmitHandler<Inputs> = async (data: IPersona) => {
        setLoading(true);
        try {
            const result = await axios.post(`${API_URL}/auth/login`, data);
            if (result?.data) {
                login(result.data.access_token, result.data.email, result.data.role);
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                setMessage("Usuario no autenticado, por favor intente nuevamente.");
                setStatus(Status.ERROR);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingComponent />;

    return (loading ? (
        <LoadingComponent />
    ) : (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4"
            style={{
                background:
                    "radial-gradient(900px 600px at 85% -10%, #17306e 0%, rgba(23,48,110,0) 60%)," +
                    "radial-gradient(800px 500px at 10% 110%, #0f1f4a 0%, rgba(15,31,74,0) 55%)," +
                    "linear-gradient(180deg, #070b1a 0%, #0b1b3d 100%)",
            }}
        >
            <div className="w-[440px] max-w-full bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-8">
                <h1 className="text-center text-[22px] font-semibold text-slate-900 mb-6">
                    Inicio sesión
                </h1>

                {message !== "" && <AlertsComponent message={message} status={status} />}

                {SHOW_TEST_USER_BUTTON && <button
                    onClick={createTestUser}
                    className="mb-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Crear usuarios de prueba
                </button>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-[13px] font-medium text-slate-700">
                            Correo
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="inspector@gmail.com"
                            autoComplete="email"
                            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <span className="mt-1 block text-[12px] text-red-600">El campo es obligatorio.</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-[13px] font-medium text-slate-700">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Ingrese su contraseña"
                                autoComplete="current-password"
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register("password", { required: true })}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center opacity-70 hover:opacity-100"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C6 20 1.73 12 1.73 12a21.78 21.78 0 0 1 5.06-6.06" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6 0 10.27 8 10.27 8a21.73 21.73 0 0 1-3.06 4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 10a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M1.5 12S5.5 4 12 4s10.5 8 10.5 8-4 8-10.5 8S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="mt-1 block text-[12px] text-red-600">El campo es obligatorio.</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!!errors.email || !!errors.password}
                        className={`mt-2 h-11 w-full rounded-lg font-medium text-white transition
              ${errors.email || errors.password
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-[#2B68FF] hover:bg-[#2B68FF]/90 focus:ring-4 focus:ring-blue-300"}`}
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    )
    )

}
