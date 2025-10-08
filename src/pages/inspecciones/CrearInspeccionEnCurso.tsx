import React, { useMemo, useState } from "react";
import DataTable, { type TableColumn, type TableStyles } from "react-data-table-component";
import Modal from "../../components/modal/Modal";

/* ===== tipos ===== */
type Row = {
  id: string;
  lat: string;
  lng: string;
  ubicacion: string;
};

/* ===== helpers ===== */
function getPaginationRange(current: number, totalPages: number) {
  const r: (number | string)[] = [];
  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(n, b));
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) r.push(i); return r; }
  if (current <= 3) r.push(1, 2, 3, "…", totalPages - 1, totalPages);
  else if (current >= totalPages - 2) r.push(1, 2, "…", totalPages - 2, totalPages - 1, totalPages);
  else { const a = clamp(current - 1, 1, totalPages); const c = clamp(current + 1, 1, totalPages); r.push(1, "…", a, current, c, "…", totalPages); }
  return r;
}

/* ===== datos “quemados” (68 páginas x 4 = 272 filas) ===== */
function genRows(count: number): Row[] {
  const cities = ["Bogota", "Pénjamo", "Popayán", "Medellín", "Cali", "Cartagena"];
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: `UBI-${String(i + 1).padStart(7, "0")}`,
      lat: (-(22 + (i % 50))).toFixed(6),
      lng: (62 + (i % 80)).toFixed(6),
      ubicacion: cities[i % cities.length],
    });
  }
  return rows;
}

/* ===== estilos de la tabla para replicar el mock ===== */
const baseStyles: TableStyles = {
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
      border: "1px solid #e5e7eb",
      backgroundColor: "#ffffff",
    },
  },
  cells: {
    style: {
      paddingLeft: 20,
      paddingRight: 20,
      color: "#334155",
      fontSize: 14,
    },
  },
};

export default function CrearInspeccionEnCurso() {
  const pageSize = 4;
  const ALL = useMemo(() => genRows(272), []);
  const totalPages = Math.ceil(ALL.length / pageSize);

  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [inspeccionID, setInspeccionID] = useState("")
  const [openFinalizado, setOpenFinalizado] = useState(false);

  const pageRows = useMemo(
    () => ALL.slice((page - 1) * pageSize, page * pageSize),
    [ALL, page]
  );
  const paginationRange = getPaginationRange(page, totalPages);

  // estilos que cambian si está seleccionada la fila
  const customStyles: TableStyles = {
    ...baseStyles,
    rows: {
      ...baseStyles.rows!,
      highlightOnHoverStyle: {
        backgroundColor: "rgba(99,102,241,0.06)", // indigo-500/6
        borderRadius: "12px",
      },
    },
  };

  const columns: TableColumn<Row>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => <span className="font-semibold text-slate-900">{row.id}</span>,
      grow: 1.1,
    },
    { name: "Latitud", selector: (row) => row.lat, sortable: true, grow: 1 },
    { name: "Longitud", selector: (row) => row.lng, sortable: true, grow: 1 },
    { name: "Ubicación", selector: (row) => row.ubicacion, sortable: true, grow: 1.2 },
  ];

  return (
    <section className="flex flex-col items-center w-full">
      <h1 className="mb-6 text-3xl md:text-[32px] font-extrabold tracking-tight text-[#13235E]">
        Seleccionar ubicación
      </h1>

      <div className="w-full max-w-[980px]">
        <DataTable
          columns={columns}
          data={pageRows}
          customStyles={customStyles}
          persistTableHead
          dense={false}
          highlightOnHover
          pointerOnHover
          onRowClicked={(row) => setSelectedId(row.id)}
          conditionalRowStyles={[
            {
              when: (row) => row.id === selectedId,
              style: {
                backgroundColor: "#5B5BD6", // morado del mock
                color: "white",
              },
            },
          ]}
        />

        {/* Paginación externa */}
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

        {/* Acciones inferiores */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            className="h-10 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={() => window.history.back()}
          >
            Atras
          </button>
          <button
            type="button"
            disabled={!selectedId}
            className={`h-10 px-5 rounded-lg font-medium ${selectedId
              ? "bg-[#2B68FF] hover:bg-[#2B68FF]/90 text-white"
              : "bg-blue-300 text-white/80 cursor-not-allowed"
              }`}
            onClick={() => {
              // aquí haces lo que necesites con la selección
              console.log("Seleccionado:", selectedId);
              setInspeccionID(selectedId);
              setOpen(true)
            }}
          >
            Seleccionar
          </button>

        </div>
        <Modal
          open={open}
          onOpenChange={setOpen}
          state="question"
          title="Cambiar Estado"
          description={`¿Se han realizado cambios en la inspeccion - ${inspeccionID} desea aceptarlos?`}
          secondary={{
            label: 'Finalizar',
            variant: 'danger',
            onClick: () => {
              setOpenFinalizado(true);
            }
          }}
          primary={{
            label: 'Cancelar',
            variant: 'ghost',
            onClick: () => {
              setOpen(true);
            }
          }}
        />
        <Modal
          open={openFinalizado}
          onOpenChange={setOpenFinalizado}
          state="success"
          title="Informacion Guardada"
          primary={{
            label: "Aceptar",
            variant: "primary",
            onClick: () => {
              // tu lógica aquí
              setOpenFinalizado(false);
              setOpen(false);
            },
          }}
        />


      </div>
    </section>
  );
}
