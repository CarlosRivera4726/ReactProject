import React, { useMemo, useState } from "react";
import DataTable, { type TableColumn, type TableStyles } from "react-data-table-component";

type Row = {
    id: string;
    ubicacion: string;
    usuario: string;
    inspector: string;
    estado: "En curso" | "Finalizada" | "Pendiente";
};

/* ------------ helpers ------------ */
function getPaginationRange(current: number, totalPages: number) {
    const r: (number | string)[] = [];
    const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(n, b));
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) r.push(i); return r; }
    if (current <= 3) r.push(1, 2, 3, "…", totalPages - 1, totalPages);
    else if (current >= totalPages - 2) r.push(1, 2, "…", totalPages - 2, totalPages - 1, totalPages);
    else { const a = clamp(current - 1, 1, totalPages); const c = clamp(current + 1, 1, totalPages); r.push(1, "…", a, current, c, "…", totalPages); }
    return r;
}

/* ------------ datos quemados (340 registros = 68 páginas de 5) ------------ */
function generateRows(count: number): Row[] {
    const ciudades = ["Bogota", "Medellín", "Popayán", "Cali", "Barranquilla", "Cartagena"];
    const usuarios = ["Floyd Miles", "Savannah Nguyen", "Jerome Bell", "Darlene Robertson"];
    const inspectores = ["Carlos Rivera", "Julio Jaramillo", "Luis Torres", "María Rojas"];
    return Array.from({ length: count }, (_, i) => ({
        id: `INS-${String(i + 1).padStart(7, "0")}`,
        ubicacion: ciudades[i % ciudades.length],
        usuario: usuarios[i % usuarios.length],
        inspector: inspectores[i % inspectores.length],
        estado: "En curso",
    }));
}

/* ------------ estilos para que luzca como el screenshot ------------ */
const customStyles: TableStyles = {
    table: { style: { backgroundColor: "transparent" } },
    headRow: {
        style: {
            backgroundColor: "#f8fafc", // slate-50
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            minHeight: 44,
        },
    },
    headCells: {
        style: {
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: ".05em",
            color: "#64748b", // slate-500
        },
    },
    rows: {
        style: {
            minHeight: "56px",
            marginTop: 12,
            marginBottom: 12,
            borderRadius: 12,
            border: "1px solid #e5e7eb", // slate-200
            backgroundColor: "#ffffff",
        },
    },
    cells: {
        style: {
            paddingLeft: 20,
            paddingRight: 20,
            color: "#334155", // slate-700
            fontSize: 14,
        },
    },
};

export default function VerInspeccionesEnCurso() {
    const pageSize = 5;
    const ALL = useMemo(() => generateRows(340), []);
    const totalPages = Math.ceil(ALL.length / pageSize);

    const [page, setPage] = useState(1);
    const pageRows = useMemo(
        () => ALL.slice((page - 1) * pageSize, page * pageSize),
        [ALL, page]
    );
    const paginationRange = getPaginationRange(page, totalPages);

    const EstadoBadge = (estado: Row["estado"]) => {
        const ok = estado === "En curso";
        return (
            <span
                className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${ok
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}
            >
                <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-slate-400"}`} />
                {estado}
            </span>
        );
    };

    const columns: TableColumn<Row>[] = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            cell: (row) => <span className="font-semibold text-slate-900">{row.id}</span>,
            grow: 1,
        },
        { name: "Ubicación", selector: (row) => row.ubicacion, sortable: true, grow: 1 },
        { name: "Usuario", selector: (row) => row.usuario, sortable: true, grow: 1.2 },
        { name: "Inspector", selector: (row) => row.inspector, sortable: true, grow: 1.2 },
        {
            name: "Estado",
            selector: (row) => row.estado,
            sortable: true,
            cell: (row) => EstadoBadge(row.estado),
            grow: 1,
        },
        {
            name: "Opciones",
            cell: () => (
                <div className="flex items-center gap-3">
                    {/* Editar */}
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900" aria-label="Editar">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M14.304 4.844l2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853L11.565 18 8 14l6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            grow: 1,
        },
    ];

    return (
        <section className="flex flex-col items-center w-full">
            <h1 className="mb-6 text-3xl md:text-[32px] font-extrabold tracking-tight text-[#13235E]">
                Ver Inspecciones en Curso
            </h1>

            <div className="w-full max-w-[980px]">
                <DataTable
                    columns={columns}
                    data={pageRows}
                    customStyles={customStyles}
                    persistTableHead
                    dense={false}
                    highlightOnHover={false}
                    pointerOnHover={false}
                    responsive
                /* sin paginación interna: usamos la externa para lucir como tu screen */
                />

                {/* Paginación externa estilo "1 2 3 … 67 68" */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    {paginationRange.map((item, i) =>
                        item === "…" ? (
                            <span key={`dots-${i}`} className="px-2 text-slate-500 select-none">…</span>
                        ) : (
                            <button
                                key={`p-${item}`}
                                onClick={() => setPage(item as number)}
                                className={`min-w-7 h-7 px-2 rounded-md text-sm ${page === item ? "bg-black text-white" : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                aria-current={page === item ? "page" : undefined}
                            >
                                {item}
                            </button>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
