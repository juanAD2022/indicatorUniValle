# Tabla Consolidada por Cohorte - Pregrado

## Descripción

Vista de tabla que muestra un resumen consolidado de indicadores estudiantiles agrupados por periodo (cohorte). Reemplaza la vista individual de estudiantes por una tabla agregada por semestre.

## Estructura de la Tabla

| Campo | Descripción | Cálculo |
|-------|-------------|---------|
| **Periodo** | Identificador del periodo académico | Formato: `AAAA-N` (ej. 2024-1) |
| **Matriculados** | Estudiantes activos en el periodo | `estado = 'MATRICULADO'` |
| **Graduados** | Estudiantes que egresaron | `estado = 'GRADUADO'` |
| **Desertores** | Estudiantes que abandonaron | `estado = 'DESERTOR'` |
| **Retirados por BRA** | Retirados con indicador BRA activo | `estado = 'RETIRADO' AND bra = 1` |
| **Trabajos de grado en desarrollo** | Tesis en proceso | `tesis_estado = 'EN_PROCESO'` |
| **Trabajos de grado finalizados** | Tesis aprobadas | `tesis_estado = 'APROBADA'` |
| **Prácticas profesionales** | Estudiantes con práctica activa | `practica_profesional = true` |

## Endpoints API

### GET /api/v1/student-indicators/cohort-summary

Retorna el resumen consolidado por periodo.

**Parámetros query:**
- `tipo_programa` (opcional): Filtrar por tipo de programa (`PREGRADO`, `POSGRADO`, `ESPECIALIZACION`)

**Ejemplo de respuesta:**
```json
[
  {
    "periodo": "2025-2",
    "matriculados": 32,
    "graduados": 8,
    "desertores": 4,
    "retirados_bra": 2,
    "tesis_en_desarrollo": 5,
    "tesis_finalizados": 8,
    "practicas_profesionales": 10
  }
]
```

## Archivos Modificados

### Backend
| Archivo | Cambio |
|---------|--------|
| `backend/app/schemas/student_indicator.py` | Schema `CohortSummaryResponse` |
| `backend/app/routers/student_indicator.py` | Endpoint `/cohort-summary` |

### Frontend
| Archivo | Cambio |
|---------|--------|
| `frontend/src/models/StudentIndicator.ts` | Interfaz `CohortSummary` |
| `frontend/src/services/studentIndicator/studentIndicatorService.ts` | Función `getCohortSummary()` |
| `frontend/src/services/studentIndicator/index.ts` | Export de la función |
| `frontend/src/components/StudentIndicatorTable/StudentIndicatorTable.types.ts` | Tipos actualizados |
| `frontend/src/components/StudentIndicatorTable/StudentIndicatorTable.tsx` | Componente reescrito |
| `frontend/src/page/Pregrado/Pregrado.tsx` | Usa nueva vista consolidada |

## Uso del Componente

```tsx
import { StudentIndicatorTable } from '@components/StudentIndicatorTable';
import type { CohortSummary } from '@models/StudentIndicator';

const data: CohortSummary[] = await getCohortSummary('PREGRADO');

<StudentIndicatorTable
  data={data}
  isLoading={false}
  tipo_programa="PREGRADO"
  selectedPeriod="2024-1"
/>
```

## Funcionalidades

- **Ordenamiento**: Click en encabezados para ordenar ascendente/descendente
- **Búsqueda**: Filtrar por periodo
- **Paginación**: 11 registros por página
- **Filtro por periodo**: Se integra con el selector global de periodos
