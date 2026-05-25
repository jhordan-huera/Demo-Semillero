import { createContext, useContext, useState, useCallback } from 'react';

const MOCK_USERS = [
  {
    cedula: '1234567890',
    password: 'padre123',
    parentName: 'María González',
    childName: 'Sofía González',
  },
  {
    cedula: '0987654321',
    password: 'padre456',
    parentName: 'Carlos Ramírez',
    childName: 'Diego Ramírez',
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    title: 'Recortes de personas confiables',
    subject: 'Desarrollo Personal',
    icon: '✂️',
    description:
      'Busquen revistas, periódicos o folletos en casa.\nPídele a tu hijo/a que recorte a 3 personas que parezcan amigables y confiables.\nPéguenlos en una hoja y conversen sobre por qué son personas a las que pueden pedir ayuda.',
    deadline: '30 Mayo 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 2,
    title: 'El mapa de mi casa',
    subject: 'Seguridad y Autonomía',
    icon: '🗺️',
    description:
      'Con una hoja en blanco y crayones, dibujen juntos un mapa sencillo de la casa.\nSeñalen las puertas de salida y zonas seguras.\nPueden usar calcomanías o colores divertidos para marcar el camino.',
    deadline: '01 Junio 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 3,
    title: 'Mi nombre, mi superpoder',
    subject: 'Lenguaje y Creatividad',
    icon: '🦸',
    description:
      'Consigue papelógrafo o varias hojas unidas.\nEscribe el nombre de tu hijo/a con letras grandes.\nUsen pintura de dedos o recortes de colores para decorar cada letra mientras repiten las letras en voz alta.',
    deadline: '03 Junio 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 4,
    title: 'Contemos juntos hasta 20',
    subject: 'Matemáticas',
    icon: '🔢',
    description:
      'Usen objetos de casa (botones, tapas, frijoles) para contar del 1 al 20.\nPídele al niño/a que agrupe los objetos de 5 en 5.\nTomen una foto del resultado final.',
    deadline: '26 Mayo 2026',
    status: 'graded',
    parentEvaluation: 'Excelente',
    parentComment: 'Le encantó contar con los botones.',
    uploadedFile: 'conteo_foto.jpg',
    teacherGrade: 'Excelente',
    teacherFeedback: '¡Muy bien! Se nota la dedicación de toda la familia. 🌟',
  },
  {
    id: 5,
    title: 'Lectura en familia: El patito feo',
    subject: 'Lectura Comprensiva',
    icon: '📖',
    description:
      'Lean juntos el cuento "El patito feo" o cualquier cuento corto disponible en casa.\nAl terminar, pídele al niño/a que dibuje su parte favorita y explique por qué le gustó.',
    deadline: '28 Mayo 2026',
    status: 'submitted',
    parentEvaluation: 'Bien',
    parentComment: 'Le costó un poco concentrarse pero al final disfrutó la historia.',
    uploadedFile: 'dibujo_patito.pdf',
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 6,
    title: 'Experimento: La planta que crece',
    subject: 'Ciencias Naturales',
    icon: '🌱',
    description:
      'Siembren un frijol o lenteja en un vaso con algodón húmedo.\nCada día observen y registren el crecimiento con un dibujo.\nAl final de la semana, tomen una foto del resultado.',
    deadline: '05 Junio 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 7,
    title: 'Figuras geométricas en casa',
    subject: 'Matemáticas',
    icon: '📐',
    description:
      'Recorran la casa y busquen objetos con forma de círculo, cuadrado, triángulo y rectángulo.\nHagan una lista o tomen fotos de cada objeto encontrado.\nDibujen las figuras y escriban el nombre de cada una.',
    deadline: '25 Mayo 2026',
    status: 'graded',
    parentEvaluation: 'Excelente',
    parentComment: 'Encontró muchas figuras, se divirtió mucho.',
    uploadedFile: 'figuras_casa.jpg',
    teacherGrade: 'Muy Bien',
    teacherFeedback: '¡Buen ojo! Encontraron muchas formas geométricas. 👏',
  },
  {
    id: 8,
    title: 'Canción de los colores',
    subject: 'Música y Expresión',
    icon: '🎵',
    description:
      'Busquen una canción infantil sobre los colores (puede ser en YouTube o inventada).\nCanten juntos y pídele al niño/a que señale objetos del color que menciona la canción.\nGraben un video corto cantando juntos o hagan un dibujo de su color favorito.',
    deadline: '30 Mayo 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
];

const MOCK_GRADES = {
  1: { grade: 'Excelente', feedback: '¡Gran trabajo! Se nota el esfuerzo y la creatividad de la familia. Sofía/Diego identificó muy bien a las personas de confianza. 🌟' },
  2: { grade: 'Muy Bien', feedback: 'El mapa quedó muy completo. Se ve que trabajaron en equipo. ¡Sigan así! 👏' },
  3: { grade: 'Excelente', feedback: '¡Qué bonito quedó el nombre decorado! Se nota mucha dedicación y amor. ✨' },
};

const TEACHER_NOTE = '👩‍🏫 Estimados padres de familia, esta semana nos enfocaremos en construir la autonomía y seguridad de los niños en casa. Las actividades están diseñadas para ser divertidas y educativas. ¡Gracias por ser sus mejores guías!';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [activities, setActivities] = useState(JSON.parse(JSON.stringify(INITIAL_ACTIVITIES)));
  const [toast, setToast] = useState(null);

  const login = useCallback((cedula, password) => {
    const user = MOCK_USERS.find(
      (u) => u.cedula === cedula && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setParentName(user.parentName);
      setChildName(user.childName);
      setActivities(JSON.parse(JSON.stringify(INITIAL_ACTIVITIES)));
      return { success: true };
    }
    return { success: false, error: 'Cédula o contraseña incorrecta' };
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setParentName('');
    setChildName('');
    setActivities(JSON.parse(JSON.stringify(INITIAL_ACTIVITIES)));
  }, []);

  const submitActivity = useCallback((activityId, evaluation, comment, fileName) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === activityId) {
          return {
            ...a,
            status: 'submitted',
            parentEvaluation: evaluation,
            parentComment: comment,
            uploadedFile: fileName,
          };
        }
        return a;
      })
    );

    // Simulate teacher grading after 3 seconds
    setTimeout(() => {
      setActivities((prev) =>
        prev.map((a) => {
          if (a.id === activityId && a.status === 'submitted') {
            const mockGrade = MOCK_GRADES[activityId] || {
              grade: 'Bien',
              feedback: '¡Buen trabajo! Sigan adelante.',
            };
            return {
              ...a,
              status: 'graded',
              teacherGrade: mockGrade.grade,
              teacherFeedback: mockGrade.feedback,
            };
          }
          return a;
        })
      );
    }, 3000);

    showToast('¡Tarea enviada con éxito! 🎉');
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const getActivity = useCallback(
    (id) => activities.find((a) => a.id === Number(id)),
    [activities]
  );

  const completedCount = activities.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  ).length;

  const value = {
    isLoggedIn,
    parentName,
    childName,
    activities,
    toast,
    login,
    logout,
    submitActivity,
    getActivity,
    completedCount,
    totalActivities: activities.length,
    teacherNote: TEACHER_NOTE,
    showToast,
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
