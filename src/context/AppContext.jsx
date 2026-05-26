import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ===== MOCK USERS =====
const MOCK_USERS = [
  {
    cedula: '1234567890',
    password: 'padre123',
    parentName: 'María González',
    children: [
      {
        id: 'sofia',
        name: 'Sofía González',
        age: 4,
        level: 'Inicial 2',
        avatar: '👧',
        color: '#E91E63',
        group: 'Inicial 2 - A',
        teacher: 'Lcda. Ana Martínez',
      },
      {
        id: 'mateo',
        name: 'Mateo González',
        age: 3,
        level: 'Inicial 1',
        avatar: '👦',
        color: '#1976D2',
        group: 'Inicial 1 - B',
        teacher: 'Lcda. Patricia Ruiz',
      },
    ],
  },
  {
    cedula: '0987654321',
    password: 'padre456',
    parentName: 'Carlos Ramírez',
    children: [
      {
        id: 'diego',
        name: 'Diego Ramírez',
        age: 5,
        level: 'Inicial 2',
        avatar: '🧒',
        color: '#388E3C',
        group: 'Inicial 2 - B',
        teacher: 'Lcda. Laura Cevallos',
      },
    ],
  },
];

// ===== RF-F01: Unidades activas por hijo =====
const UNITS_BY_CHILD = {
  sofia: [
    { id: 'u1', title: 'Unidad 1: Mi cuerpo y yo', scope: 'Identidad y Autonomía', weeks: 3, status: 'completed' },
    { id: 'u2', title: 'Unidad 2: Descubro mi entorno', scope: 'Descubrimiento del Medio', weeks: 4, status: 'active' },
    { id: 'u3', title: 'Unidad 3: Juego y aprendo', scope: 'Expresión y Comunicación', weeks: 3, status: 'upcoming' },
  ],
  mateo: [
    { id: 'u1', title: 'Unidad 1: Mis sentidos', scope: 'Identidad y Autonomía', weeks: 4, status: 'active' },
    { id: 'u2', title: 'Unidad 2: Colores y formas', scope: 'Relaciones Lógico-Matemáticas', weeks: 3, status: 'upcoming' },
  ],
  diego: [
    { id: 'u1', title: 'Unidad 1: Personas seguras', scope: 'Convivencia', weeks: 3, status: 'completed' },
    { id: 'u2', title: 'Unidad 2: Me cuido solito', scope: 'Identidad y Autonomía', weeks: 4, status: 'active' },
  ],
};

// ===== RF-F02: Rúbrica cognitiva — Evaluaciones por hijo =====
const RUBRIC_CRITERIA = [
  { id: 'clasificacion', name: 'Clasificación', icon: '🧩', description: 'Agrupa objetos por atributos (color, forma, tamaño)' },
  { id: 'seriacion', name: 'Seriación', icon: '📊', description: 'Ordena elementos por un criterio progresivo' },
  { id: 'construccion', name: 'Construcción de conocimiento', icon: '🧠', description: 'Asimilación y acomodación de nuevos conceptos' },
  { id: 'pensamiento', name: 'Pensamiento lógico', icon: '🔍', description: 'Justificación lógica ante preguntas' },
  { id: 'metacognicion', name: 'Metacognición', icon: '🪞', description: 'Autorregulación del propio aprendizaje' },
];

// Levels: iniciado (🔴), en_proceso (🟡), logrado (🟢)
const EVALUATIONS_BY_CHILD = {
  sofia: {
    clasificacion: { level: 'logrado', observation: 'Sofía clasifica objetos por color y tamaño sin ayuda. Reconoce hasta 4 atributos distintos.', date: '20 Mayo 2026' },
    seriacion: { level: 'en_proceso', observation: 'Puede ordenar de 3 a 4 objetos por tamaño, pero necesita guía para seriar por grosor o longitud.', date: '20 Mayo 2026' },
    construccion: { level: 'logrado', observation: 'Asimila conceptos nuevos con facilidad. Cuando se le presenta una contradicción, intenta resolverla por sí misma.', date: '18 Mayo 2026' },
    pensamiento: { level: 'en_proceso', observation: 'Justifica sus respuestas de forma simple ("porque sí"). Se está trabajando en que argumente con razones.', date: '18 Mayo 2026' },
    metacognicion: { level: 'iniciado', observation: 'Aún necesita que el adulto le recuerde los pasos de una tarea. Se distrae fácilmente pero muestra interés cuando se le guía.', date: '15 Mayo 2026' },
  },
  mateo: {
    clasificacion: { level: 'en_proceso', observation: 'Mateo agrupa por color pero le cuesta por forma. Se refuerza con juegos de bloques.', date: '19 Mayo 2026' },
    seriacion: { level: 'iniciado', observation: 'Necesita apoyo constante para ordenar objetos. Apenas identifica "grande" y "pequeño".', date: '19 Mayo 2026' },
    construccion: { level: 'en_proceso', observation: 'Acepta información nueva con curiosidad pero le cuesta integrarla con lo que ya sabe.', date: '17 Mayo 2026' },
    pensamiento: { level: 'iniciado', observation: 'Responde con gestos más que con palabras. Se trabaja la verbalización de ideas.', date: '17 Mayo 2026' },
    metacognicion: { level: 'iniciado', observation: 'Requiere recordatorios constantes. Se está introduciendo rutinas visuales para apoyar su autorregulación.', date: '14 Mayo 2026' },
  },
  diego: {
    clasificacion: { level: 'logrado', observation: 'Clasifica con seguridad y puede explicar su criterio de agrupación.', date: '21 Mayo 2026' },
    seriacion: { level: 'logrado', observation: 'Ordena hasta 6 elementos correctamente por tamaño y peso.', date: '21 Mayo 2026' },
    construccion: { level: 'en_proceso', observation: 'Muestra interés en descubrir cosas nuevas pero a veces se frustra cuando no entiende algo rápidamente.', date: '20 Mayo 2026' },
    pensamiento: { level: 'logrado', observation: 'Da explicaciones claras: "Porque el rojo es más grande que el azul, entonces va primero".', date: '20 Mayo 2026' },
    metacognicion: { level: 'en_proceso', observation: 'Empieza a autorregularse en actividades cortas. En actividades largas aún necesita pausas guiadas.', date: '18 Mayo 2026' },
  },
};

// ===== RF-F03: Historial de avance por unidad =====
const HISTORY_BY_CHILD = {
  sofia: [
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Mi cuerpo y yo', date: '5 Mayo 2026',
      evaluations: {
        clasificacion: 'en_proceso', seriacion: 'iniciado', construccion: 'en_proceso',
        pensamiento: 'iniciado', metacognicion: 'iniciado',
      },
    },
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Mi cuerpo y yo', date: '12 Mayo 2026',
      evaluations: {
        clasificacion: 'logrado', seriacion: 'en_proceso', construccion: 'en_proceso',
        pensamiento: 'en_proceso', metacognicion: 'iniciado',
      },
    },
    {
      unitId: 'u2', unitTitle: 'Unidad 2: Descubro mi entorno', date: '20 Mayo 2026',
      evaluations: {
        clasificacion: 'logrado', seriacion: 'en_proceso', construccion: 'logrado',
        pensamiento: 'en_proceso', metacognicion: 'iniciado',
      },
    },
  ],
  mateo: [
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Mis sentidos', date: '8 Mayo 2026',
      evaluations: {
        clasificacion: 'iniciado', seriacion: 'iniciado', construccion: 'iniciado',
        pensamiento: 'iniciado', metacognicion: 'iniciado',
      },
    },
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Mis sentidos', date: '19 Mayo 2026',
      evaluations: {
        clasificacion: 'en_proceso', seriacion: 'iniciado', construccion: 'en_proceso',
        pensamiento: 'iniciado', metacognicion: 'iniciado',
      },
    },
  ],
  diego: [
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Personas seguras', date: '3 Mayo 2026',
      evaluations: {
        clasificacion: 'en_proceso', seriacion: 'en_proceso', construccion: 'iniciado',
        pensamiento: 'en_proceso', metacognicion: 'iniciado',
      },
    },
    {
      unitId: 'u1', unitTitle: 'Unidad 1: Personas seguras', date: '15 Mayo 2026',
      evaluations: {
        clasificacion: 'logrado', seriacion: 'logrado', construccion: 'en_proceso',
        pensamiento: 'logrado', metacognicion: 'en_proceso',
      },
    },
    {
      unitId: 'u2', unitTitle: 'Unidad 2: Me cuido solito', date: '21 Mayo 2026',
      evaluations: {
        clasificacion: 'logrado', seriacion: 'logrado', construccion: 'en_proceso',
        pensamiento: 'logrado', metacognicion: 'en_proceso',
      },
    },
  ],
};

// ===== RF-F04: Actividades para casa (homework) =====
const HOMEWORK_BY_CHILD = {
  sofia: [
    { id: 1, title: 'Observar el video de la semana', unit: 'Unidad 2', description: 'Vean juntos el video "Los animales de mi barrio" y conversen sobre qué animales conoce el niño/a. Pregunten: ¿Cuáles has visto cerca de casa?', deadline: '27 Mayo 2026', completed: false, comment: '' },
    { id: 2, title: 'Traer recortes de revistas', unit: 'Unidad 2', description: 'Busquen en revistas o periódicos imágenes de plantas, animales y personas. Recorten al menos 5 imágenes para clasificar en clase.', deadline: '28 Mayo 2026', completed: false, comment: '' },
    { id: 3, title: 'Dibujar mi familia', unit: 'Unidad 2', description: 'El niño/a debe dibujar a su familia con crayones. Pregunten quién es cada persona del dibujo y escriban los nombres al lado.', deadline: '29 Mayo 2026', completed: true, comment: 'Sofía dibujó a toda la familia incluyendo al perro. ¡Le encantó!' },
    { id: 4, title: 'Clasificar juguetes por color', unit: 'Unidad 2', description: 'Junten varios juguetes y pidan al niño/a que los separe por colores. Luego cuenten cuántos hay de cada color.', deadline: '30 Mayo 2026', completed: false, comment: '' },
    { id: 5, title: 'Cantar la canción de los números', unit: 'Unidad 2', description: 'Practiquen la canción "1, 2, 3, indio" señalando con los dedos cada número. Repitan varias veces hasta que el niño/a la cante solo/a.', deadline: '31 Mayo 2026', completed: false, comment: '' },
  ],
  mateo: [
    { id: 101, title: 'Tocar texturas diferentes', unit: 'Unidad 1', description: 'Busquen 4 objetos con texturas diferentes (suave, áspero, liso, rugoso). Dejen que el niño/a toque cada uno y diga cómo se siente.', deadline: '27 Mayo 2026', completed: false, comment: '' },
    { id: 102, title: 'Oler frutas con los ojos cerrados', unit: 'Unidad 1', description: 'Con los ojos vendados, acerquen frutas (naranja, manzana, plátano) y pidan al niño/a que adivine cuál es por el olor.', deadline: '28 Mayo 2026', completed: true, comment: 'Mateo adivinó la naranja y el plátano. La manzana le costó.' },
    { id: 103, title: 'Escuchar sonidos de la casa', unit: 'Unidad 1', description: 'Quédense en silencio 1 minuto y pregunten: ¿Qué sonidos escuchas? (reloj, refrigerador, pájaros). Dibujen lo que escucharon.', deadline: '30 Mayo 2026', completed: false, comment: '' },
  ],
  diego: [
    { id: 201, title: 'Practicar decir su nombre completo', unit: 'Unidad 2', description: 'Pregunten al niño/a: ¿Cómo te llamas? Practiquen que diga nombre y apellido completos. Pueden hacer un juego: "Me llamo... y me gusta..."', deadline: '28 Mayo 2026', completed: false, comment: '' },
    { id: 202, title: 'Identificar personas seguras', unit: 'Unidad 2', description: 'Miren fotos familiares y pregunten: ¿Quién te cuida? ¿A quién puedes pedir ayuda? Conversen sobre las personas de confianza.', deadline: '29 Mayo 2026', completed: true, comment: 'Diego identificó a mamá, papá, abuela y su maestra como personas seguras.' },
    { id: 203, title: 'Lavarse las manos solo', unit: 'Unidad 2', description: 'Observen si el niño/a puede lavarse las manos siguiendo los 5 pasos sin ayuda. Si necesita apoyo, guíenlo pero dejen que intente primero.', deadline: '31 Mayo 2026', completed: false, comment: '' },
  ],
};

const TEACHER_NOTES = {
  sofia: '👩‍🏫 Queridos papitos, esta semana Sofía trabajará la Unidad 2 "Descubro mi entorno". Las actividades de casa complementan lo que hacemos en el aula. ¡Disfrútenlas en familia! 💕',
  mateo: '👩‍🏫 Queridos papitos, Mateo está en la Unidad 1 "Mis sentidos". Las actividades son sensoriales y muy lúdicas para su edad. ¡Acompáñenlo con mucho cariño! 🧡',
  diego: '👩‍🏫 Hola familia Ramírez, Diego avanza muy bien en la Unidad 2 "Me cuido solito". Refuercen los hábitos de autocuidado en casa. ¡Gracias por su apoyo! 💪',
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [homeworkMap, setHomeworkMap] = useState({});
  const [toast, setToast] = useState(null);

  // Current child data
  const currentChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) || null,
    [childrenList, selectedChildId]
  );

  const childName = currentChild?.name || '';
  const homework = homeworkMap[selectedChildId] || [];
  const teacherNote = TEACHER_NOTES[selectedChildId] || '';
  const units = UNITS_BY_CHILD[selectedChildId] || [];
  const evaluations = EVALUATIONS_BY_CHILD[selectedChildId] || {};
  const history = HISTORY_BY_CHILD[selectedChildId] || [];

  const login = useCallback((cedula, password) => {
    const user = MOCK_USERS.find(
      (u) => u.cedula === cedula && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setParentName(user.parentName);
      setChildrenList(user.children);
      // Initialize homework for each child
      const initMap = {};
      user.children.forEach((child) => {
        initMap[child.id] = JSON.parse(
          JSON.stringify(HOMEWORK_BY_CHILD[child.id] || [])
        );
      });
      setHomeworkMap(initMap);
      setSelectedChildId(null);
      return { success: true, children: user.children };
    }
    return { success: false, error: 'Cédula o contraseña incorrecta' };
  }, []);

  const selectChild = useCallback((childId) => {
    setSelectedChildId(childId);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setParentName('');
    setChildrenList([]);
    setSelectedChildId(null);
    setHomeworkMap({});
  }, []);

  // RF-F04: Mark homework as completed with comment
  const completeHomework = useCallback((homeworkId, comment) => {
    setHomeworkMap((prev) => {
      const childHw = prev[selectedChildId] || [];
      const updated = childHw.map((h) => {
        if (h.id === homeworkId) {
          return { ...h, completed: true, comment: comment || '' };
        }
        return h;
      });
      return { ...prev, [selectedChildId]: updated };
    });
    showToast('✅ Actividad marcada como realizada');
  }, [selectedChildId]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const completedCount = homework.filter((h) => h.completed).length;

  const value = {
    isLoggedIn,
    parentName,
    childName,
    toast,
    login,
    logout,
    showToast,
    // Multi-tenant (RF-F08)
    childrenList,
    currentChild,
    selectedChildId,
    selectChild,
    // RF-F01: Profile
    units,
    teacherNote,
    // RF-F02: Rubric
    rubricCriteria: RUBRIC_CRITERIA,
    evaluations,
    // RF-F03: History
    history,
    // RF-F04: Homework
    homework,
    completeHomework,
    completedCount,
    totalActivities: homework.length,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
