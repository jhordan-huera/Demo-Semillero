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
    title: 'Mi carita en el espejo',
    subject: 'Identidad y Autonomía',
    icon: '🪞',
    description:
      'Pongan un espejo frente al niño/a y pídanle que se observe.\\nPregunten: ¿De qué color son tus ojos? ¿Cómo es tu cabello?\\nLuego, con crayones y una hoja, ayúdenle a dibujar su carita.\\nPueden pegar bolitas de papel o lana para el cabello. ¡Que se divierta!',
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
    title: 'Jugamos a lavarnos las manos',
    subject: 'Convivencia',
    icon: '🧼',
    description:
      'Canten juntos la canción "Lavo mis manitas" mientras el niño/a se lava las manos.\\nPractiquen los 5 pasos: mojar, enjabonar, frotar, enjuagar y secar.\\nTomen una foto o video del niño/a lavándose solito/a. ¡Pueden inventar su propia canción!',
    deadline: '27 Mayo 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 3,
    title: 'Pintamos con los deditos',
    subject: 'Expresión Artística',
    icon: '🎨',
    description:
      'Preparen pintura casera (agua con colorante o témperas) y una hoja grande.\\nDejen que el niño/a pinte libremente usando sus deditos y manos.\\nPueden hacer flores, un sol o lo que quieran. ¡No importa si se ensucian, es parte de la diversión!\\nAl final, cuenten qué dibujó y por qué eligió esos colores.',
    deadline: '29 Mayo 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 4,
    title: 'Contemos hasta 5 con juguetes',
    subject: 'Relaciones Lógico-Matemáticas',
    icon: '🧸',
    description:
      'Busquen 5 juguetes o peluches favoritos del niño/a.\\nAlinéenlos en fila y cuenten juntos: uno, dos, tres, cuatro, cinco.\\nLuego quiten uno y pregunten: ¿Cuántos quedan?\\nRepitan el juego varias veces. ¡Tomen una foto de los juguetes en fila!',
    deadline: '26 Mayo 2026',
    status: 'graded',
    parentEvaluation: 'Lo logró solito 🎉',
    parentComment: 'Le encantó alinear sus peluches y contarlos. Hasta contó los de su hermana.',
    uploadedFile: 'conteo_juguetes.jpg',
    teacherGrade: 'Excelente',
    teacherFeedback: '¡Maravilloso! Se nota que disfrutó mucho el juego. Sigan practicando con objetos diferentes. 🌟',
  },
  {
    id: 5,
    title: 'El cuento antes de dormir',
    subject: 'Comprensión y Expresión del Lenguaje',
    icon: '📚',
    description:
      'Escojan un cuento corto con muchas imágenes (puede ser un libro de casa o inventado).\\nLean o cuenten la historia señalando los dibujos.\\nAl terminar, pregunten: ¿Quién era el personaje? ¿Qué pasó? ¿Te gustó?\\nPidan al niño/a que dibuje su parte favorita.',
    deadline: '28 Mayo 2026',
    status: 'submitted',
    parentEvaluation: 'Lo hicimos juntos 🤝',
    parentComment: 'Le costó un poco concentrarse pero al final le encantó el cuento del osito. Hizo un dibujo muy bonito.',
    uploadedFile: 'dibujo_cuento.pdf',
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 6,
    title: '¿Qué sonidos hace la naturaleza?',
    subject: 'Descubrimiento del Medio Natural',
    icon: '🐦',
    description:
      'Salgan al patio, jardín o balcón y quédense en silencio unos minutitos.\\nPregunten: ¿Qué sonidos escuchas? (pájaros, viento, agua, perros)\\nImiten juntos los sonidos de los animales que conozcan.\\nDibujen en una hoja los animales o cosas que escucharon.',
    deadline: '31 Mayo 2026',
    status: 'pending',
    parentEvaluation: null,
    parentComment: '',
    uploadedFile: null,
    teacherGrade: null,
    teacherFeedback: null,
  },
  {
    id: 7,
    title: 'Círculos, cuadrados y triángulos',
    subject: 'Relaciones Lógico-Matemáticas',
    icon: '🔵',
    description:
      'Busquen objetos redondos (platos, tapas), cuadrados (cajas, libros) y triangulares en casa.\\nAyuden al niño/a a tocarlos y decir la forma: "Esto es un círculo porque es redondito".\\nPeguen recortes de cada forma en una hoja. ¡Pueden decorarla con colores!',
    deadline: '25 Mayo 2026',
    status: 'graded',
    parentEvaluation: 'Lo logró solito 🎉',
    parentComment: 'Encontró muchas formas, se emocionó mucho con las tapas redondas.',
    uploadedFile: 'formas_casa.jpg',
    teacherGrade: 'Muy Bien',
    teacherFeedback: '¡Qué bien que reconoce las formas! Sigan jugando a encontrar figuras en la calle también. 👏',
  },
  {
    id: 8,
    title: 'Bailamos como los animales',
    subject: 'Expresión Corporal y Motricidad',
    icon: '🐸',
    description:
      'Pongan música alegre y jueguen a moverse como animales:\\n🐸 Saltar como rana\\n🐍 Arrastrarse como serpiente\\n🐻 Caminar como oso\\n🦅 Volar como pájaro\\nGraben un video cortito o tomen fotos de los movimientos. ¡Que toda la familia participe!',
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
  1: { grade: 'Excelente', feedback: '¡Qué lindo autorretrato! Se nota que se observó con mucho cuidado. El dibujo muestra creatividad. 🌟' },
  2: { grade: 'Muy Bien', feedback: '¡Genial! Es muy importante que los pequeños aprendan hábitos de higiene de forma divertida. Sigan practicando juntos. 👏' },
  3: { grade: 'Excelente', feedback: '¡Qué obra de arte tan colorida! La pintura con dedos ayuda mucho a la motricidad fina. ✨' },
};

const TEACHER_NOTE = '👩‍🏫 Queridos papitos y mamitas, esta semana trabajaremos actividades para fortalecer la motricidad, el lenguaje y el reconocimiento del entorno de sus pequeños. Recuerden que a esta edad aprenden jugando. ¡Disfruten cada actividad en familia! 💕';

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
