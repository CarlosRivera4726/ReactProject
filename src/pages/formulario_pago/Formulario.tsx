import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { api } from "../../lib/api";
import axios from "axios";
import { API_URL } from "../../const/ApiUrl";
import "./formulario.css"

declare global {
    interface Window {
        MercadoPago: any;
    }
}

type FormValues = {
    cardholderName: string;
    identificationType: string;
    identificationNumber: string;
    email: string;
    amount: number;
    description: string;
    installments: string;
    issuer: string;
    paymentMethodId: string;
};

const ISSUER_PLACEHOLDER = "Banco emisor";
const INSTALLMENTS_PLACEHOLDER = "Cuotas";

interface FormularioPagoProps {
    setProcessedPayment?: (processed: boolean) => void;
}


const FormularioPago = ({ setProcessedPayment }: FormularioPagoProps) => {
    // ===== stable amount ref =====
    // const amountRef = useRef<number>(50000.00);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            amount: 50000.01,
            description: "Producto",
            installments: "",
            issuer: "",
            paymentMethodId: "",
            email: "",
            cardholderName: "",
            identificationType: "",
            identificationNumber: "",
        },
    });

    // Observa SOLO el amount (evita bucles con installments/issuer)
    const amount = useWatch({ control, name: "amount" });

    const refs = {
        cardNumber: "form-checkout__cardNumber",
        expirationDate: "form-checkout__expirationDate",
        securityCode: "form-checkout__securityCode",
        issuer: "form-checkout__issuer",
        installments: "form-checkout__installments",
        identificationType: "form-checkout__identificationType",
        identificationNumber: "form-checkout__identificationNumber",
        cardholderName: "form-checkout__cardholderName",
        email: "form-checkout__email",
        paymentMethodId: "paymentMethodId",
    } as const;

    const mounted = useRef(false);
    const elementsRef = useRef({
        mp: undefined as any,
        cardNumberElement: undefined as any,
        expirationDateElement: undefined as any,
        securityCodeElement: undefined as any,
        cleanupFns: [] as Array<() => void>,
        currentBin: undefined as string | undefined,
        lastPaymentMethodId: undefined as string | undefined,
        installmentsInFlight: false,       // evita paralelos
        installmentsTimer: undefined as any, // debounce
        isSettingInstallments: false,      // evita bucles al fijar 1 cuota
    });

    const $ = <T extends HTMLElement>(id: string) =>
        document.getElementById(id) as T | null;

    // Cuando cambia el amount, si ya hay PM+BIN válidos, recalcúla cuotas
    // useEffect(() => {
    //     const n = Number(amount);
    //     if (Number.isFinite(n) && n > 0) {
    //         amountRef.current = n;
    //     }
    // }, [amount]);

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;

        (async () => {
            await loadMercadoPago();
            const PK = import.meta.env.VITE_MP_PUBLIC_KEY as string;
            if (!PK) throw new Error("Falta VITE_MP_PUBLIC_KEY en .env");

            const mp = new window.MercadoPago(PK, {
                locale: "es-CO",
                advancedFraudPrevention: true,
            });
            elementsRef.current.mp = mp;

            // Montar PCI fields
            const cardNumberElement = mp.fields
                .create("cardNumber", { placeholder: "Número de la tarjeta" })
                .mount(refs.cardNumber);

            const expirationDateElement = mp.fields
                .create("expirationDate", { placeholder: "MM/YY" })
                .mount(refs.expirationDate);

            const securityCodeElement = mp.fields
                .create("securityCode", { placeholder: "CVC" })
                .mount(refs.securityCode);

            elementsRef.current.cardNumberElement = cardNumberElement;
            elementsRef.current.expirationDateElement = expirationDateElement;
            elementsRef.current.securityCodeElement = securityCodeElement;

            // Utils selects
            function createSelectOptions<T extends Record<string, any>>(
                elem: HTMLSelectElement,
                options: T[] = [],
                labelsAndKeys: { label: keyof T; value: keyof T } = {
                    label: "name",
                    value: "id",
                } as any
            ) {
                if (!elem) return;
                elem.options.length = 0;
                const frag = document.createDocumentFragment();
                for (const option of options) {
                    if (!option) continue;
                    const opt = document.createElement("option");
                    opt.value = String(option[labelsAndKeys.value] ?? "");
                    opt.textContent = String(option[labelsAndKeys.label] ?? "");
                    frag.appendChild(opt);
                }
                elem.appendChild(frag);
            }

            function clearSelect(el: HTMLSelectElement | null, placeholder: string) {
                if (!el) return;
                el.options.length = 0;
                const opt = document.createElement("option");
                opt.value = "";
                opt.disabled = true;
                opt.selected = true;
                opt.textContent = placeholder;
                el.appendChild(opt);
            }

            // Tipos de documento
            (async () => {
                try {
                    const identificationTypes = await mp.getIdentificationTypes();
                    const identificationTypeEl = $<HTMLSelectElement>(refs.identificationType);
                    if (identificationTypeEl) createSelectOptions(identificationTypeEl, identificationTypes);
                } catch (e) {
                    console.error("Error getting identificationTypes:", e);
                }
            })();

            // ---------- LÓGICA DE CUOTAS ----------
            const setSingleInstallment = () => {
                const sel = $<HTMLSelectElement>(refs.installments);
                if (!sel) return;
                sel.options.length = 0;
                const opt = document.createElement("option");
                opt.value = "1";
                opt.textContent = "1 cuota";
                sel.appendChild(opt);
                sel.value = "1";

                elementsRef.current.isSettingInstallments = true;
                // no dispares validación (para evitar loops)
                setValue("installments", "1", { shouldValidate: false, shouldDirty: false });
                queueMicrotask(() => {
                    elementsRef.current.isSettingInstallments = false;
                });
            };

            function scheduleUpdateInstallments(
                paymentMethod: { id: string } | null,
                bin: string | undefined
            ) {
                if (elementsRef.current.isSettingInstallments) return;
                if (elementsRef.current.installmentsTimer) {
                    clearTimeout(elementsRef.current.installmentsTimer);
                }
                // Requisitos mínimos
                if (!paymentMethod?.id) return;
                if (!bin || bin.length < 6) return;

                elementsRef.current.installmentsTimer = setTimeout(
                    () => updateInstallmentsNow(paymentMethod, bin),
                    200
                );
            }

            async function updateInstallmentsNow(
                paymentMethod: { id: string } | null,
                bin: string | undefined
            ) {
                if (elementsRef.current.isSettingInstallments) return;
                if (elementsRef.current.installmentsInFlight) return;

                const installmentsSelect = $<HTMLSelectElement>(refs.installments);

                try {
                    if (!paymentMethod?.id || !bin || bin.length < 6) {
                        clearSelect(installmentsSelect, INSTALLMENTS_PLACEHOLDER);
                        setValue("installments", "", { shouldValidate: true });
                        return;
                    }

                    const issuerIdStr = $<HTMLSelectElement>(refs.issuer)?.value || "";
                    const hasIssuer = issuerIdStr !== "";

                    let params: any;
                    if (hasIssuer) {
                        // const issuerIdParsed = /^\d+$/.test(issuerIdStr) ? Number(issuerIdStr) : issuerIdStr;
                        params = {
                            amount: parseFloat(amount.toFixed(2)).toString(),
                            bin: bin,
                            paymentTypeId: 'credit_card'
                        };
                    } else {
                        params = {
                            amount: parseFloat(amount.toFixed(2)).toString(),
                            bin,
                            paymentTypeId: 'credit_card',
                        };
                    }

                    elementsRef.current.installmentsInFlight = true;
                    console.log(params);
                    const installments = await elementsRef.current.mp.getInstallments(params);
                    const payerCosts = installments?.[0]?.payer_costs ?? [];

                    if (payerCosts.length && installmentsSelect) {
                        installmentsSelect.options.length = 0;
                        const frag = document.createDocumentFragment();
                        for (const pc of payerCosts) {
                            const opt = document.createElement("option");
                            opt.value = String(pc.installments);
                            opt.textContent = String(pc.recommended_message);
                            frag.appendChild(opt);
                        }
                        installmentsSelect.appendChild(frag);
                        // seleccionar primera opción
                        installmentsSelect.value = installmentsSelect.options[0]?.value || "1";
                        setValue("installments", installmentsSelect.value, { shouldValidate: true });
                    } else {
                        // si MP no devuelve cuotas, forzamos 1
                        setSingleInstallment();
                    }
                } catch (error) {
                    console.error("❌ Error en getInstallments:", error);
                    // fallback a 1 cuota
                    setSingleInstallment();
                } finally {
                    elementsRef.current.installmentsInFlight = false;
                }
            }
            // ---------- FIN LÓGICA DE CUOTAS ----------

            function updatePCIFieldsSettings(paymentMethod: any) {
                const settings = paymentMethod?.settings?.[0];
                if (settings?.card_number) {
                    elementsRef.current.cardNumberElement?.update({ settings: settings.card_number });
                }
                if (settings?.security_code) {
                    elementsRef.current.securityCodeElement?.update({ settings: settings.security_code });
                }
            }

            async function getIssuers(paymentMethod: any, bin: string) {
                try {
                    const { id: paymentMethodId } = paymentMethod;
                    return await mp.getIssuers({ paymentMethodId, bin });
                } catch (e) {
                    console.error("error getting issuers:", e);
                    return [];
                }
            }

            async function updateIssuer(paymentMethod: any, bin: string) {
                const issuerSelect = $<HTMLSelectElement>(refs.issuer);
                clearSelect(issuerSelect, ISSUER_PLACEHOLDER);

                const additional = paymentMethod?.additional_info_needed ?? [];
                let issuerOptions: any[] = [];

                if (Array.isArray(additional) && additional.includes("issuer_id")) {
                    issuerOptions = (await getIssuers(paymentMethod, bin)) || [];
                } else if (paymentMethod?.issuer) {
                    issuerOptions = [paymentMethod.issuer];
                }

                if (issuerOptions.length && issuerSelect) {
                    createSelectOptions(issuerSelect, issuerOptions);
                    issuerSelect.value = issuerSelect.options[0].value;
                    setValue("issuer", issuerSelect.value, { shouldValidate: true });
                } else {
                    setValue("issuer", "", { shouldValidate: true });
                }

                // Recalcular cuotas con issuer/bin actuales
                scheduleUpdateInstallments({ id: paymentMethod.id }, bin);
            }

            // Listeners de selects
            const issuerEl = $<HTMLSelectElement>(refs.issuer);
            const installmentsEl = $<HTMLSelectElement>(refs.installments);

            const onIssuerChange = () => {
                if (elementsRef.current.isSettingInstallments) return;
                const issuerId = (issuerEl?.value ?? "");
                setValue("issuer", issuerId, { shouldValidate: true });
                const pmId = elementsRef.current.lastPaymentMethodId;
                if (pmId) scheduleUpdateInstallments({ id: pmId }, elementsRef.current.currentBin);
            };
            const onInstallmentsChange = (e: Event) => {
                if (elementsRef.current.isSettingInstallments) return;
                setValue("installments", (e.target as HTMLSelectElement).value, { shouldValidate: true });
            };

            issuerEl?.addEventListener("change", onIssuerChange);
            installmentsEl?.addEventListener("change", onInstallmentsChange);
            elementsRef.current.cleanupFns.push(() => issuerEl?.removeEventListener("change", onIssuerChange));
            elementsRef.current.cleanupFns.push(() => installmentsEl?.removeEventListener("change", onInstallmentsChange));

            // BIN listener
            const off = cardNumberElement.on("binChange", async (data: any) => {
                const bin: string | undefined = data?.bin;

                if (!bin || bin.length < 6) {
                    clearSelect($(refs.issuer), ISSUER_PLACEHOLDER);
                    clearSelect($(refs.installments), INSTALLMENTS_PLACEHOLDER);
                    setValue("paymentMethodId", "", { shouldValidate: true });
                    setValue("issuer", "", { shouldValidate: true });
                    setValue("installments", "", { shouldValidate: true });
                    elementsRef.current.currentBin = undefined;
                    return;
                }

                if (bin !== elementsRef.current.currentBin) {
                    elementsRef.current.currentBin = bin;
                    try {
                        const { results = [] } = await mp.getPaymentMethods({ bin });
                        const paymentMethod = results[0];
                        if (!paymentMethod) {
                            clearSelect($(refs.issuer), ISSUER_PLACEHOLDER);
                            clearSelect($(refs.installments), INSTALLMENTS_PLACEHOLDER);
                            setValue("paymentMethodId", "", { shouldValidate: true });
                            setValue("issuer", "", { shouldValidate: true });
                            setValue("installments", "", { shouldValidate: true });
                            return;
                        }
                        setValue("paymentMethodId", paymentMethod.id, { shouldValidate: true });
                        elementsRef.current.lastPaymentMethodId = paymentMethod.id;

                        updatePCIFieldsSettings(paymentMethod);
                        await updateIssuer(paymentMethod, bin);
                    } catch (error) {
                        console.error("Error obteniendo payment methods:", error);
                    }
                }
            });

            elementsRef.current.cleanupFns.push(() => off?.remove?.());
        })();

        return () => {
            try {
                elementsRef.current.cleanupFns.forEach((fn) => fn());
                elementsRef.current.cardNumberElement?.unmount?.();
                elementsRef.current.expirationDateElement?.unmount?.();
                elementsRef.current.securityCodeElement?.unmount?.();
            } catch { }
        };
    }, []);

    // Submit
    const onSubmit = async (values: FormValues) => {
        try {
            const mp = elementsRef.current.mp;
            if (!mp) throw new Error("MercadoPago SDK no inicializado");

            const token = await mp.fields.createCardToken({
                cardholderName: (document.getElementById(refs.cardholderName) as HTMLInputElement).value,
                identificationType: (document.getElementById(refs.identificationType) as HTMLSelectElement).value,
                identificationNumber: (document.getElementById(refs.identificationNumber) as HTMLInputElement).value,
            });

            // Asegura amount numérico con 2 decimales
            const amountNum = Number.parseFloat(Number(values.amount).toFixed(2));
            if (!Number.isFinite(amountNum) || amountNum <= 0) {
                throw new Error("Monto inválido");
            }

            const payload = {
                token: token.id,
                paymentMethodId: values.paymentMethodId,                  // p.ej. "visa"
                installments: Number(values.installments || 1),           // número
                issuer: values.issuer ? Number(values.issuer) : undefined,// issuer_id
                amount: amountNum,                                        // número decimal
                description: values.description,
                email: values.email,
                identificationType: (document.getElementById(refs.identificationType) as HTMLSelectElement).value,
                identificationNumber: (document.getElementById(refs.identificationNumber) as HTMLInputElement).value,
            };

            const { data } = await api.post("/mercado-pago/pay", payload);
            const response = await axios.post(`${API_URL}/mercado-pago/register-pay`, data);
            const reverse = confirm(`Desea reversar su pago?\nPago: ${data.id}`);
            if (reverse) {
                setProcessedPayment && setProcessedPayment(false);
                await axios.post(`${API_URL}/mercado-pago/reverse-pay`, { paymentId: data.id });
                return;
            } else {
                alert(`Pago procesado con éxito. Estado: ${response.data.message}`);
                if (setProcessedPayment) {
                    setProcessedPayment(true);
                }
            }
        } catch (e: any) {
            console.error("Error en el pago:", e);
            console.error("Error response:", e?.response?.data);
            alert(`Error procesando el pago: ${e?.message || "Desconocido"}`);
            if (setProcessedPayment) {
                setProcessedPayment(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-3xl ">
                <div className="bg-[#0e1c58] shadow-sm rounded-2xl border border-gray-100 p-6 md:p-8">
                    <header className="mb-6">
                        <h1 className="text-2xl font-semibold text-white">Pago con tarjeta</h1>
                        <p className="text-sm text-white">
                            Completa los datos para procesar tu pago de{" "}
                            <span className="font-medium">${amount ?? 0}</span>.
                        </p>
                    </header>

                    <form id="form-checkout" onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
                        {/* PCI fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                            <div>
                                <label htmlFor={refs.cardNumber} className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de la tarjeta
                                </label>
                                <div
                                    id={refs.cardNumber}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 flex items-center
                  focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor={refs.expirationDate} className="block text-sm font-medium text-gray-700 mb-1">
                                        Vencimiento (MM/YY)
                                    </label>
                                    <div
                                        id={refs.expirationDate}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 flex items-center
                    focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={refs.securityCode} className="block text-sm font-medium text-gray-700 mb-1">
                                        CVC
                                    </label>
                                    <div
                                        id={refs.securityCode}
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 flex items-center
                    focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Datos Titular */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={refs.cardholderName} className="block text-sm font-medium text-gray-700 mb-1">
                                    Titular de la tarjeta
                                </label>
                                <input
                                    id={refs.cardholderName}
                                    type="text"
                                    placeholder="Nombre y apellido"
                                    {...register("cardholderName", { required: "Campo requerido" })}
                                    className="h-11 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-black"
                                />
                                {errors.cardholderName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.cardholderName.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor={refs.email} className="block text-sm font-medium text-gray-700 mb-1">
                                    Email del pagador
                                </label>
                                <input
                                    id={refs.email}
                                    type="email"
                                    placeholder="correo@dominio.com"
                                    {...register("email", {
                                        required: "Email requerido",
                                        pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
                                    })}
                                    className="h-11 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Documento */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor={refs.identificationType} className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de documento
                                </label>
                                <select
                                    id={refs.identificationType}
                                    defaultValue="CC"
                                    {...register("identificationType", { required: "Tipo requerido" })}
                                    className="h-11 w-full rounded-lg border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>Selecciona…</option>
                                </select>
                                {errors.identificationType && (
                                    <p className="mt-1 text-xs text-red-600">{errors.identificationType.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor={refs.identificationNumber} className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de documento
                                </label>
                                <input
                                    id={refs.identificationNumber}
                                    type="text"
                                    placeholder="Ej: 1001234567"
                                    {...register("identificationNumber", { required: "Documento requerido" })}
                                    className="h-11 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.identificationNumber && (
                                    <p className="mt-1 text-xs text-red-600">{errors.identificationNumber.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Emisor / Cuotas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={refs.issuer} className="block text-sm font-medium text-gray-700 mb-1">
                                    Banco emisor
                                </label>
                                <select
                                    id={refs.issuer}
                                    defaultValue=""
                                    {...register("issuer")}
                                    className="h-11 w-full rounded-lg border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>{ISSUER_PLACEHOLDER}</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor={refs.installments} className="block text-sm font-medium text-gray-700 mb-1">
                                    Cuotas
                                </label>
                                <select
                                    id={refs.installments}
                                    defaultValue=""
                                    {...register("installments", { required: "Selecciona cuotas" })}
                                    className="h-11 w-full rounded-lg border-gray-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>{INSTALLMENTS_PLACEHOLDER}</option>
                                </select>
                                {errors.installments && (
                                    <p className="mt-1 text-xs text-red-600">{errors.installments.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Hidden / internos */}
                        <input type="hidden" {...register("paymentMethodId", { required: "Método de pago inválido" })} />
                        <input type="hidden" {...register("amount", { required: true, min: 1 })} />
                        <input type="hidden" {...register("description", { required: true })} />
                        {errors.paymentMethodId && <p className="text-xs text-red-600">{errors.paymentMethodId.message}</p>}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                            {isSubmitting ? "Procesando..." : "Pagar ahora"}
                        </button>

                        <p className="text-[11px] text-gray-200 text-center">
                            Tus datos se procesan de forma segura a través de Mercado Pago.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioPago;
