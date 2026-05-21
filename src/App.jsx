import { useState, useRef, useCallback, useMemo } from "react";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const MORNING_SLOTS = ["7:00-9:00", "9:00-11:00", "11:00-13:00", "13:00-15:00"];
const EVENING_SLOTS = ["16:00-18:00", "18:00-20:00", "20:00-22:00"];

const SUBJECT_COLORS = [
  { bg: "#E8F4FD", border: "#93C5E8", text: "#1A5276", dot: "#3498DB" },
  { bg: "#F0FDF4", border: "#86EFAC", text: "#14532D", dot: "#22C55E" },
  { bg: "#FFF7ED", border: "#FDC878", text: "#7C2D12", dot: "#F97316" },
  { bg: "#FDF4FF", border: "#D8B4FE", text: "#581C87", dot: "#A855F7" },
  { bg: "#FFF1F2", border: "#FDA4AF", text: "#881337", dot: "#F43F5E" },
  { bg: "#F0FDFA", border: "#5EEAD4", text: "#134E4A", dot: "#14B8A6" },
  { bg: "#FFFBEB", border: "#FDE68A", text: "#78350F", dot: "#F59E0B" },
  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A", dot: "#3B82F6" },
];

const DEMO_SUBJECTS = [
  // Estructura de datos
  {
    id: 1,
    name: "Estructura de datos",
    group: "No especificado",
    professor: "ROMERO CORONADO JUAN PABLO",
    room: "T-204",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 2,
    name: "Estructura de datos",
    group: "ESI3181A",
    professor: "GILBERT PEREZ DIEGO RODOLFO",
    room: "T-106 / VIDEOCONFERENCIA",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 3,
    name: "Estructura de datos",
    group: "ESI3181C",
    professor: "PALOMO BRIONES GAMALIEL ABISAY",
    room: "T-110",
    schedule: [
      { day: "Miércoles", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 4,
    name: "Estructura de datos",
    group: "No especificado",
    professor: "PIZA DAVILA HUGO IVAN",
    room: "T-104",
    schedule: [
      { day: "Lunes", slot: "09:00 AM–11:00 AM" },
      { day: "Miércoles", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 5,
    name: "Estructura de datos",
    group: "No especificado",
    professor: "GILBERT PEREZ DIEGO RODOLFO",
    room: "T-205",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 6,
    name: "Estructura de datos",
    group: "No especificado",
    professor: "SANCHEZ GATICA LUIS ALBERTO",
    room: "T-205",
    schedule: [
      { day: "Martes", slot: "11:00 AM–01:00 PM" },
      { day: "Jueves", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 7,
    name: "Estructura de datos",
    group: "No especificado",
    professor: "Por Asignar",
    room: "T-107",
    schedule: [
      { day: "Lunes", slot: "04:00 PM–06:00 PM" },
      { day: "Jueves", slot: "04:00 PM–06:00 PM" }
    ]
  },

  // Administración de Redes
  {
    id: 8,
    name: "Administración de Redes",
    group: "ESI3118D",
    professor: "VALDEZ ROBREDO SERGIO",
    room: "VIDEOCONFERENCIA / EN LINEA",
    schedule: [
      { day: "Lunes", slot: "09:00 AM–11:00 AM" },
      { day: "Miércoles", slot: "09:00 AM–11:00 AM" },
      { day: "Sábado", slot: "04:00 PM–08:00 PM" }
    ]
  },

  // Programación Orientada a Objetos
  {
    id: 9,
    name: "Programación Orientada a Objetos",
    group: "ESI017A",
    professor: "GAYTAN GODINEZ LORENA",
    room: "D-209 / T-205",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 10,
    name: "Programación Orientada a Objetos",
    group: "ESI017B",
    professor: "Por Asignar",
    room: "T-205 / B-103",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 11,
    name: "Programación Orientada a Objetos",
    group: "ESI017E",
    professor: "PIZA DAVILA HUGO IVAN",
    room: "T-104",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 12,
    name: "Programación Orientada a Objetos",
    group: "ESI017F",
    professor: "ZALDIVAR CARRILLO VICTOR HUGO",
    room: "T-110",
    schedule: [
      { day: "Lunes", slot: "11:00 AM–01:00 PM" },
      { day: "Miércoles", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 13,
    name: "Programación Orientada a Objetos",
    group: "ESI017G",
    professor: "ELVIRA VALENZUELA JOSE LUIS",
    room: "T-114",
    schedule: [
      { day: "Martes", slot: "11:00 AM–01:00 PM" },
      { day: "Jueves", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 14,
    name: "Programación Orientada a Objetos",
    group: "ESI017K",
    professor: "ELVIRA VALENZUELA JOSE LUIS",
    room: "T-216 MSC",
    schedule: [
      { day: "Lunes", slot: "04:00 PM–06:00 PM" },
      { day: "Jueves", slot: "04:00 PM–06:00 PM" }
    ]
  },
  {
    id: 15,
    name: "Programación Orientada a Objetos",
    group: "ESI017O",
    professor: "Por Asignar",
    room: "T-105",
    schedule: [
      { day: "Martes", slot: "06:00 PM–08:00 PM" },
      { day: "Jueves", slot: "06:00 PM–08:00 PM" }
    ]
  },
  // Organización y Arquitectura de Computadoras
  {
    id: 16,
    name: "Organización y Arquitectura de Computadoras",
    group: "ESI3913B",
    professor: "GUTIERREZ ARCE ALVARO",
    room: "T-207",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 17,
    name: "Organización y Arquitectura de Computadoras",
    group: "ESI3913N",
    professor: "IBARRA ESPARZA JUANPABLO",
    room: "T-205",
    schedule: [
      { day: "Lunes", slot: "06:00 PM–08:00 PM" },
      { day: "Miércoles", slot: "06:00 PM–08:00 PM" }
    ]
  },
  {
    id: 18,
    name: "Organización y Arquitectura de Computadoras",
    group: "ESI3913O",
    professor: "DEL RIO GARCIA RIOS SEBASTIAN",
    room: "T-205",
    schedule: [
      { day: "Martes", slot: "06:00 PM–08:00 PM" },
      { day: "Jueves", slot: "06:00 PM–08:00 PM" }
    ]
  },
  // Ecuaciones Diferenciales
  {
    id: 19,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968A",
    professor: "TORRES RUVALCABA HUGO ENRIQUE",
    room: "V-405",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 20,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968A2",
    professor: "LOPEZ LOPEZ ELKIN",
    room: "D-111",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 21,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968A3",
    professor: "ANDRADE HERNANDEZ GISELLE",
    room: "D-309",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 22,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968A4",
    professor: "TEJEDA DAVALOS FABIOLA",
    room: "D-310",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 23,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968B",
    professor: "ALONZO FLORES MIGUEL ANGEL",
    room: "V-405",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 24,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968B2",
    professor: "RAMIREZ CONDADO EMANUEL",
    room: "V-404",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 25,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968C",
    professor: "Por Asignar",
    room: "V-406",
    schedule: [
      { day: "Miércoles", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 26,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968D",
    professor: "ULLOA NANCY",
    room: "C-109",
    schedule: [
      { day: "Lunes", slot: "09:00 AM–11:00 AM" },
      { day: "Miércoles", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 27,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968E",
    professor: "IBARRA OCHOA ANAROSA",
    room: "D-107",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 28,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968E2",
    professor: "ZEPEDA ALATORRE COSME",
    room: "C-213",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 29,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968E3",
    professor: "AGUILERA PEREZ GERARDO ANTONIO",
    room: "A-304",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 30,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968F",
    professor: "VAZQUEZ PEREZ ABEL",
    room: "C-210",
    schedule: [
      { day: "Lunes", slot: "11:00 AM–01:00 PM" },
      { day: "Miércoles", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 31,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968F2",
    professor: "GOMEZ SALAZAR DAVID",
    room: "D-303",
    schedule: [
      { day: "Lunes", slot: "11:00 AM–01:00 PM" },
      { day: "Miércoles", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 32,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968H",
    professor: "IBARRA OCHOA ANAROSA",
    room: "C-208",
    schedule: [
      { day: "Lunes", slot: "01:00 PM–03:00 PM" },
      { day: "Jueves", slot: "01:00 PM–03:00 PM" }
    ]
  },
  {
    id: 33,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968H2",
    professor: "ZAPATA ROMANO JUAN JAVIER",
    room: "B-112",
    schedule: [
      { day: "Lunes", slot: "01:00 PM–03:00 PM" },
      { day: "Jueves", slot: "01:00 PM–03:00 PM" }
    ]
  },
  {
    id: 34,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968H3",
    professor: "DELGADO AGUIÑAGA JORGE ALEJANDRO",
    room: "D-210",
    schedule: [
      { day: "Lunes", slot: "01:00 PM–03:00 PM" },
      { day: "Jueves", slot: "01:00 PM–03:00 PM" }
    ]
  },
  {
    id: 35,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968I",
    professor: "GARCIA SANCHEZ FERNANDO",
    room: "D-109",
    schedule: [
      { day: "Martes", slot: "01:00 PM–03:00 PM" },
      { day: "Viernes", slot: "01:00 PM–03:00 PM" }
    ]
  },
  {
    id: 36,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968K",
    professor: "GONZALEZ FIGUEROA ARMANDO",
    room: "C-211",
    schedule: [
      { day: "Lunes", slot: "04:00 PM–06:00 PM" },
      { day: "Jueves", slot: "04:00 PM–06:00 PM" }
    ]
  },
  {
    id: 37,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968L",
    professor: "AGUILERA PEREZ GERARDO ANTONIO",
    room: "D-103",
    schedule: [
      { day: "Martes", slot: "04:00 PM–06:00 PM" },
      { day: "Viernes", slot: "04:00 PM–06:00 PM" }
    ]
  },
  {
    id: 38,
    name: "Ecuaciones Diferenciales",
    group: "MAF3968L2",
    professor: "BAEZA ORNELAS RAUL",
    room: "C-104",
    schedule: [
      { day: "Martes", slot: "04:00 PM–06:00 PM" },
      { day: "Viernes", slot: "04:00 PM–06:00 PM" }
    ]
  },
  // Física Universitaria (Actualización)
  
  {
    id: 39,
    name: "Física Universitaria",
    group: "MAF3904M",
    professor: "LOPEZ LOPEZ ELKIN",
    room: "J-LFISI3",
    schedule: [
      { day: "Miércoles", slot: "04:00 PM–06:00 PM" }
    ]
  },
  {
    id: 40,
    name: "Física Universitaria",
    group: "MAF2251D",
    professor: "Por Asignar",
    room: "J-LFISI4",
    schedule: [
      { day: "Lunes", slot: "09:00 AM–11:00 AM" },
      { day: "Miércoles", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 41,
    name: "Física Universitaria",
    group: "MAF2251F",
    professor: "Por Asignar",
    room: "J-LFISI1",
    schedule: [
      { day: "Lunes", slot: "11:00 AM–01:00 PM" },
      { day: "Miércoles", slot: "11:00 AM–01:00 PM" },
      { day: "Viernes", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 42,
    name: "Física Universitaria",
    group: "MAF3904B",
    professor: "ZEPEDA ALATORRE COSME",
    room: "J-LFISI2",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 43,
    name: "Física Universitaria",
    group: "MAF3904C",
    professor: "SHINDO DAISUKE",
    room: "J-LFISI3",
    schedule: [
      { day: "Miércoles", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 44,
    name: "Física Universitaria",
    group: "MAF3904C2",
    professor: "LOPEZ LOPEZ ELKIN",
    room: "J-LFISI2",
    schedule: [
      { day: "Viernes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 45,
    name: "Física Universitaria",
    group: "MAF3904D",
    professor: "ZEPEDA ALATORRE COSME",
    room: "A-208",
    schedule: [
      { day: "Lunes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 46,
    name: "Física Universitaria",
    group: "MAF3904D2",
    professor: "SHINDO DAISUKE",
    room: "J-LFISI3",
    schedule: [
      { day: "Miércoles", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 47,
    name: "Física Universitaria",
    group: "MAF3904E",
    professor: "SHINDO DAISUKE",
    room: "J-LFISI1",
    schedule: [
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 48,
    name: "Física Universitaria",
    group: "MAF3904E2",
    professor: "BARAJAS BARRAZA RAMON ENRIQUE",
    room: "J-LFISI2",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 49,
    name: "Física Universitaria",
    group: "MAF3904G",
    professor: "ALONZO FLORES MIGUEL ANGEL",
    room: "J-LFISI2",
    schedule: [
      { day: "Martes", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 50,
    name: "Física Universitaria",
    group: "MAF3904G2",
    professor: "SHINDO DAISUKE",
    room: "J-LFISI1",
    schedule: [
      { day: "Jueves", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 51,
    name: "Física Universitaria",
    group: "MAF3904H",
    professor: "LOPEZ LOPEZ ELKIN",
    room: "C-215",
    schedule: [
      { day: "Lunes", slot: "01:00 PM–03:00 PM" }
    ]
  },
  {
    id: 52,
    name: "Física Universitaria",
    group: "MAF3904J",
    professor: "LOPEZ LOPEZ ELKIN",
    room: "J-LFISI2",
    schedule: [
      { day: "Viernes", slot: "11:00 AM–01:00 PM" }
    ]
  },
  // Administración de Sistemas
  {
    id: 56,
    name: "Administración de Sistemas",
    group: "ESI2628A",
    professor: "DURAN POLANCO LILIANA",
    room: "T-210",
    schedule: [
      { day: "Lunes", slot: "07:00 AM–09:00 AM" },
      { day: "Jueves", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 57,
    name: "Administración de Sistemas",
    group: "ESI2628E",
    professor: "GONZALEZ DIAZ LUIS DANIEL",
    room: "T-210",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 58,
    name: "Administración de Sistemas",
    group: "ESI2628N",
    professor: "VARGAS ESTRADA MARIA DE LOS ANGELES",
    room: "T-210",
    schedule: [
      { day: "Lunes", slot: "06:00 PM–08:00 PM" },
      { day: "Miércoles", slot: "06:00 PM–08:00 PM" }
    ]
  },
  // Análisis y Diseño de Procesos
  {
    id: 59,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116B",
    professor: "DE LA GARZA MUSI ALEJANDRO",
    room: "T-102",
    schedule: [
      { day: "Martes", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "07:00 AM–09:00 AM" }
    ]
  },
  {
    id: 60,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116C",
    professor: "Por Asignar",
    room: "T-204",
    schedule: [
      { day: "Miércoles", slot: "07:00 AM–09:00 AM" },
      { day: "Viernes", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 61,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116E",
    professor: "SALAS MEJIA RICARDO",
    room: "T-106",
    schedule: [
      { day: "Martes", slot: "09:00 AM–11:00 AM" },
      { day: "Jueves", slot: "09:00 AM–11:00 AM" }
    ]
  },
  {
    id: 62,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116F",
    professor: "SALAS MEJIA RICARDO",
    room: "T-102",
    schedule: [
      { day: "Lunes", slot: "11:00 AM–01:00 PM" },
      { day: "Miércoles", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 63,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116G",
    professor: "PEREZ GARCIA ANA LAURA",
    room: "T-112",
    schedule: [
      { day: "Martes", slot: "11:00 AM–01:00 PM" },
      { day: "Jueves", slot: "11:00 AM–01:00 PM" }
    ]
  },
  {
    id: 64,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116N",
    professor: "TREVIÑO LEON LUIS EDUARDO",
    room: "T-114",
    schedule: [
      { day: "Lunes", slot: "06:00 PM–08:00 PM" },
      { day: "Miércoles", slot: "06:00 PM–08:00 PM" }
    ]
  },
  {
    id: 65,
    name: "Análisis y Diseño de Procesos",
    group: "ESI116P",
    professor: "CALZADA LOPEZ JOSE JUAN",
    room: "T-114",
    schedule: [
      { day: "Lunes", slot: "08:00 PM–10:00 PM" },
      { day: "Miércoles", slot: "08:00 PM–10:00 PM" }
    ]
  }
];

const JSON_TEMPLATE = `[
  {
    "name": "Estructura de Datos",
    "group": "ESI3181A",
    "professor": "GILBERT PEREZ DIEGO RODOLFO",
    "room": "T-106",
    "schedule": [
      { "day": "Lun", "slot": "07:00 AM-09:00 AM" },
      { "day": "Jue", "slot": "07:00 AM-09:00 AM" }
    ]
  }
]`;

// --- FUNCIONES DE NORMALIZACIÓN ULTRA ROBUSTAS ---
const normalizeSlot = (slot) => {
  // Quitamos todos los espacios y lo pasamos a mayúsculas
  let s = slot.replace(/\s+/g, '').toUpperCase();
  // Unificamos cualquier tipo de guion
  s = s.replace(/[-–—]/g, '-');
  
  // Extraemos las horas usando una expresión regular para convertirlas a formato 24h
  const match = s.match(/(\d{1,2}):(\d{2})(AM|PM)?-(\d{1,2}):(\d{2})(AM|PM)?/);
  if (match) {
    let h1 = parseInt(match[1], 10);
    let m1 = match[2];
    let ap1 = match[3];
    
    let h2 = parseInt(match[4], 10);
    let m2 = match[5];
    let ap2 = match[6];
    
    if (ap1 === 'PM' && h1 !== 12) h1 += 12;
    if (ap1 === 'AM' && h1 === 12) h1 = 0;
    
    if (ap2 === 'PM' && h2 !== 12) h2 += 12;
    if (ap2 === 'AM' && h2 === 12) h2 = 0;
    
    return `${h1}:${m1}-${h2}:${m2}`;
  }
  
  // Fallback por si acaso: solo quita ceros a la izquierda ("07:00-09:00" -> "7:00-9:00")
  return s.replace(/(^|-)(0+)(\d)/g, '$1$3');
};

const normalizeDay = (day) => {
  let d = day.trim().toLowerCase();
  // Permite que pongas abreviaturas en el JSON y las empareja correctamente
  if (d.startsWith('lun')) return 'lunes';
  if (d.startsWith('mar')) return 'martes';
  if (d.startsWith('mi')) return 'miércoles'; // Funciona para 'mié' y 'mie'
  if (d.startsWith('jue')) return 'jueves';
  if (d.startsWith('vie')) return 'viernes';
  return d;
};

export default function ScheduleSimulator() {
  const [subjects, setSubjects] = useState(DEMO_SUBJECTS);
  const [selected, setSelected] = useState(new Set());
  const [conflict, setConflict] = useState(null);
  const [view, setView] = useState("calendar");
  const [previewImage, setPreviewImage] = useState(null);
  const [importText, setImportText] = useState(JSON_TEMPLATE);
  const [uploadError, setUploadError] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const fileRef = useRef(null);

  const groupedSubjects = useMemo(() => {
    const groups = {};
    subjects.forEach(s => {
      if (!groups[s.name]) {
        groups[s.name] = [];
      }
      groups[s.name].push(s);
    });
    return groups;
  }, [subjects]);

  const colorMap = useMemo(() => {
    const map = {};
    Object.keys(groupedSubjects).forEach((name, i) => {
      map[name] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
    });
    return map;
  }, [groupedSubjects]);

  const toggleAccordion = (subjectName) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(subjectName)) {
        next.delete(subjectName);
      } else {
        next.add(subjectName);
      }
      return next;
    });
  };

  const getCalendarCell = useCallback((day, slot) => {
    return [...selected].map(id => subjects.find(s => s.id === id)).filter(Boolean)
      .find(s => s.schedule.some(sc => normalizeDay(sc.day) === normalizeDay(day) && normalizeSlot(sc.slot) === normalizeSlot(slot)));
  }, [selected, subjects]);

  const hasConflict = useCallback((subjectId) => {
    const subj = subjects.find(s => s.id === subjectId);
    if (!subj) return null;
    for (const sc of subj.schedule) {
      for (const selId of selected) {
        if (selId === subjectId) continue;
        const selSubj = subjects.find(s => s.id === selId);
        if (selSubj && selSubj.schedule.some(s => normalizeDay(s.day) === normalizeDay(sc.day) && normalizeSlot(s.slot) === normalizeSlot(sc.slot))) {
          return selSubj;
        }
      }
    }
    return null;
  }, [selected, subjects]);

  const toggleSubject = useCallback((id, subjectName) => {
    if (selected.has(id)) {
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
      setConflict(null);
    } else {
      const currentlySelectedGroup = [...selected].find(selId => subjects.find(s => s.id === selId)?.name === subjectName);
      
      let nextSelected = new Set(selected);
      if (currentlySelectedGroup !== undefined) {
         nextSelected.delete(currentlySelectedGroup);
      }

      const mockSelected = new Set(nextSelected);
      const subj = subjects.find(s => s.id === id);
      let foundConflict = null;

      for (const sc of subj.schedule) {
          for (const selId of mockSelected) {
              const selSubj = subjects.find(s => s.id === selId);
              if (selSubj && selSubj.schedule.some(s => normalizeDay(s.day) === normalizeDay(sc.day) && normalizeSlot(s.slot) === normalizeSlot(sc.slot))) {
                  foundConflict = selSubj;
                  break;
              }
          }
          if(foundConflict) break;
      }

      if (foundConflict) {
        setConflict({ newSubject: subjects.find(s => s.id === id), existing: foundConflict });
        setTimeout(() => setConflict(null), 4000);
      } else {
        nextSelected.add(id);
        setSelected(nextSelected);
        setConflict(null);
      }
    }
  }, [selected, subjects]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target.result);
      reader.readAsDataURL(file);
      setUploadError("");
    } else {
      setUploadError("Por favor sube un archivo de imagen válido (JPG, PNG).");
    }
  };

  const handleImport = () => {
    setUploadError("");
    const text = importText.trim();
    
    try {
      const parsedJSON = JSON.parse(text);
      const newSubjects = (Array.isArray(parsedJSON) ? parsedJSON : [parsedJSON]).map(s => ({
        ...s,
        id: s.id || Date.now() + Math.random()
      }));
      
      setSubjects(prev => {
        const existingKeys = new Set(prev.map(x => `${x.name}-${x.group}`));
        const filtered = newSubjects.filter(x => !existingKeys.has(`${x.name}-${x.group}`));
        return [...prev, ...filtered];
      });
      setView("calendar");
    } catch (e) {
      setUploadError("Error en el formato JSON. Verifica comas y comillas: " + e.message);
    }
  };

  const totalCredits = [...selected].length * 3;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F9FC", minHeight: "100vh", color: "#1A1D23" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        .tab-btn { transition: all 0.15s ease; border: none; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; }
        .conflict-shake { animation: shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        
        .accordion-header {
          padding: 12px 16px; background: #FFFFFF; border: 1px solid #EAECF0;
          border-radius: 8px; cursor: pointer; display: flex;
          justify-content: space-between; align-items: center;
          transition: all 0.2s; margin-bottom: 8px;
        }
        .accordion-header:hover { background: #FAFAFA; border-color: #D1D5DB; }
        .accordion-header.active { border-color: #6366F1; background: #EEF2FF; }
        
        .group-card {
          padding: 10px 12px; border-radius: 8px; margin-bottom: 6px;
          margin-left: 12px; border: 1.5px solid #EAECF0; background: #FAFAFA;
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .group-card:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .group-card.selected { transform: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EAECF0", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 60 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>📅</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px" }}>Simulador de Horarios</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: -1 }}>Planificación Académica</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["calendar", "import"].map(v => (
            <button key={v} className="tab-btn" onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 8,
              background: view === v ? "#EEF2FF" : "transparent",
              color: view === v ? "#4F46E5" : "#6B7280",
            }}>
              {v === "calendar" ? "Calendario" : "Importar Datos"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginLeft: 8, padding: "6px 16px", background: "#F3F4F6", borderRadius: 10, fontSize: 12 }}>
          <span><b style={{ color: "#111827" }}>{selected.size}</b> <span style={{ color: "#6B7280" }}>materias</span></span>
          <span style={{ color: "#D1D5DB" }}>|</span>
          <span><b style={{ color: "#111827" }}>{totalCredits}</b> <span style={{ color: "#6B7280" }}>créditos est.</span></span>
        </div>
      </div>

      {/* Conflict Alert */}
      {conflict && (
        <div className="fade-in conflict-shake" style={{
          margin: "12px 24px 0", padding: "12px 16px", background: "#FFF1F2",
          border: "1px solid #FCA5A5", borderRadius: 10, display: "flex", alignItems: "center", gap: 10
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B" }}>Conflicto de horario detectado</div>
            <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 2 }}>
              <b>{conflict.newSubject.name} (Gpo. {conflict.newSubject.group})</b> colisiona con <b>{conflict.existing.name} (Gpo. {conflict.existing.group})</b>.
            </div>
          </div>
          <button onClick={() => setConflict(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}>×</button>
        </div>
      )}

      {/* Main Layout */}
      <div style={{ display: "flex", gap: 0, height: "calc(100vh - 60px)", overflow: "hidden" }}>

        {/* Sidebar */}
        {view === "calendar" && (
          <div style={{ width: 320, background: "#FFFFFF", borderRight: "1px solid #EAECF0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Materias disponibles
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Expande una materia para ver sus grupos</div>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column" }}>
              {Object.entries(groupedSubjects).map(([subjectName, groups]) => {
                const isExpanded = expandedSubjects.has(subjectName);
                const color = colorMap[subjectName];
                const hasSelectedGroup = groups.some(g => selected.has(g.id));

                return (
                  <div key={subjectName}>
                    <div 
                      className={`accordion-header ${hasSelectedGroup ? 'active' : ''}`}
                      onClick={() => toggleAccordion(subjectName)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "2px", background: color.dot }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: hasSelectedGroup ? "#4F46E5" : "#374151" }}>
                            {subjectName}
                          </div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                            {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'} disponibles
                          </div>
                        </div>
                      </div>
                      <div style={{ color: "#9CA3AF", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        ▼
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="fade-in" style={{ marginBottom: 12 }}>
                        {groups.map(s => {
                          const isSelected = selected.has(s.id);
                          const isConflicting = conflict?.newSubject?.id === s.id;
                          
                          return (
                            <div
                              key={s.id}
                              className={`group-card ${isSelected ? "selected" : ""}`}
                              onClick={() => toggleSubject(s.id, subjectName)}
                              style={{
                                border: `1.5px solid ${isConflicting ? "#FCA5A5" : isSelected ? color.border : "#EAECF0"}`,
                                background: isSelected ? color.bg : "#FAFAFA",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? color.text : "#374151" }}>
                                  Grupo {s.group}
                                </div>
                                {isSelected && <span style={{ fontSize: 14, color: color.text }}>✓</span>}
                              </div>
                              
                              <div style={{ fontSize: 11, color: "#6B7280", display: "flex", gap: 8, marginBottom: 4 }}>
                                <span>{s.room}</span><span>·</span><span style={{textTransform: "capitalize"}}>{s.professor.toLowerCase()}</span>
                              </div>
                              
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {s.schedule.map((sc, i) => (
                                  <span key={i} style={{ fontSize: 10, background: isSelected ? color.border + "44" : "#F3F4F6", color: isSelected ? color.text : "#6B7280", padding: "2px 6px", borderRadius: 4 }}>
                                    {sc.day.slice(0, 3)} {sc.slot.split("-")[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div style={{ padding: "12px 16px", borderTop: "1px solid #F3F4F6" }}>
              <button onClick={() => { setSelected(new Set()); setConflict(null); }} style={{
                width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid #EAECF0",
                background: "transparent", color: "#6B7280", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit"
              }}>
                Limpiar horario
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, height: "100%" }}>
          {view === "calendar" && (
            <div>
              <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Semana Académica</div>
                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                  <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "4px 10px", borderRadius: 6 }}>🌅 Matutino 7:00-15:00</span>
                  <span style={{ fontSize: 11, color: "#6B7280", background: "#F3F4F6", padding: "4px 10px", borderRadius: 6 }}>🌆 Vespertino 16:00-22:00</span>
                </div>
              </div>

              <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", background: "#F9FAFB", borderBottom: "1px solid #EAECF0" }}>
                  <div style={{ padding: "12px 8px", fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>Horario</div>
                  {DAYS.map(d => <div key={d} style={{ padding: "12px 8px", fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{d}</div>)}
                </div>

                <div style={{ padding: "8px 8px 4px", display: "flex", alignItems: "center", gap: 8, background: "#FFFBF5", borderBottom: "1px solid #FDE68A" }}>
                  <span style={{ fontSize: 10, color: "#92400E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>☀️ Matutino</span>
                </div>
                {MORNING_SLOTS.map(slot => (
                  <div key={slot} style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ padding: "10px 8px", fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center" }}>{slot}</div>
                    {DAYS.map(day => {
                      const cell = getCalendarCell(day, slot);
                      const color = cell ? colorMap[cell.name] : null;
                      return (
                        <div key={day} style={{ padding: 6, minHeight: 68, borderLeft: "1px solid #F3F4F6", background: cell ? color.bg : "transparent" }}>
                          {cell && (
                            <div style={{ height: "100%", borderRadius: 8, padding: "6px 8px", background: color.bg, border: `1px solid ${color.border}` }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: color.text, lineHeight: 1.3 }}>{cell.name}</div>
                              <div style={{ fontSize: 10, color: color.dot, marginTop: 3 }}>{cell.room}</div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>Gpo. {cell.group}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                <div style={{ padding: "8px 8px 4px", display: "flex", alignItems: "center", gap: 8, background: "#F5F3FF", borderTop: "1px solid #EAECF0", borderBottom: "1px solid #DDD6FE" }}>
                  <span style={{ fontSize: 10, color: "#5B21B6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>🌙 Vespertino</span>
                </div>
                {EVENING_SLOTS.map(slot => (
                  <div key={slot} style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ padding: "10px 8px", fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center" }}>{slot}</div>
                    {DAYS.map(day => {
                      const cell = getCalendarCell(day, slot);
                      const color = cell ? colorMap[cell.name] : null;
                      return (
                        <div key={day} style={{ padding: 6, minHeight: 68, borderLeft: "1px solid #F3F4F6", background: cell ? color.bg : "transparent" }}>
                          {cell && (
                            <div style={{ height: "100%", borderRadius: 8, padding: "6px 8px", background: color.bg, border: `1px solid ${color.border}` }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: color.text, lineHeight: 1.3 }}>{cell.name}</div>
                              <div style={{ fontSize: 10, color: color.dot, marginTop: 3 }}>{cell.room}</div>
                              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>Gpo. {cell.group}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "import" && (
            <div style={{ display: "flex", gap: 24, height: "100%" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAECF0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>1. Imagen de Referencia (Opcional)</span>
                  {previewImage && (
                    <button onClick={() => setPreviewImage(null)} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>
                      Quitar imagen
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, padding: 20, display: "flex", justifyContent: "center", alignItems: "center", background: "#F9FAFB", overflow: "hidden" }}>
                  {!previewImage ? (
                    <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #D1D5DB", borderRadius: 12, padding: "40px", textAlign: "center", cursor: "pointer", width: "100%", background: "#FFFFFF" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>Clic para subir tu lista de materias</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>La imagen se mostrará aquí para que la transcribas.</div>
                    </div>
                  ) : (
                    <img src={previewImage} alt="Referencia" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", borderRadius: 14, border: "1px solid #EAECF0", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAECF0" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>2. Editor de Datos JSON</span>
                  <span style={{ fontSize: 12, color: "#6B7280", display: "block", marginTop: 4 }}>Agrega todas las materias y grupos que necesites.</span>
                </div>
                <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
                  <textarea 
                    value={importText} 
                    onChange={e => setImportText(e.target.value)} 
                    spellCheck="false"
                    style={{ 
                      flex: 1, width: "100%", padding: 16, fontFamily: "'DM Mono', monospace", fontSize: 12, 
                      border: "1px solid #E5E7EB", borderRadius: 10, resize: "none", outline: "none",
                      background: "#F9FAFB", color: "#1F2937", lineHeight: 1.6
                    }} 
                  />
                  {uploadError && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "#FFF1F2", border: "1px solid #FCA5A5", borderRadius: 8, fontSize: 12, color: "#991B1B" }}>
                      ⚠️ {uploadError}
                    </div>
                  )}
                  <button onClick={handleImport} style={{ marginTop: 16, padding: "12px", background: "#4F46E5", color: "#FFF", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 13, transition: "background 0.2s" }} onMouseOver={e => e.target.style.background = "#4338CA"} onMouseOut={e => e.target.style.background = "#4F46E5"}>
                    Procesar y Agregar al Calendario →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}