import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ===== MULTI-TENANT: Each child is a "tenant" with isolated data =====

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
      },
      {
        id: 'mateo',
        name: 'Mateo González',
        age: 3,
        level: 'Inicial 1',
        avatar: '👦',
        color: '#1976D2',
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
      },
    ],
  },
];

// ===== Activities per child (tenant-isolated data) =====

const ACTIVITIES_BY_CHILD = {
  sofia: [
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
  ],
  mateo: [
    {
      id: 101,
      title: 'Los colores de mi ropa',
      subject: 'Identidad y Autonomía',
      icon: '👕',
      description:
        'Saquen 3 prendas de ropa del niño/a.\\nPregunten: ¿De qué color es esta camiseta?\\nJueguen a agrupar la ropa por colores.\\nDibujen la prenda favorita y coloréenla.',
      deadline: '26 Mayo 2026',
      status: 'graded',
      parentEvaluation: 'Lo hicimos juntos 🤝',
      parentComment: 'Le gustó mucho separar su ropita por colores.',
      uploadedFile: 'ropa_colores.jpg',
      teacherGrade: 'Excelente',
      teacherFeedback: '¡Qué bien! Mateo ya reconoce los colores básicos. Sigan reforzando. 🌟',
    },
    {
      id: 102,
      title: 'Torre de vasos',
      subject: 'Relaciones Lógico-Matemáticas',
      icon: '🥤',
      description:
        'Busquen vasos plásticos y construyan una torre lo más alta posible.\\nCuenten cuántos vasos usaron.\\nPregunten: ¿Cuántos vasos tiene la torre? ¿Qué pasa si quitamos uno?\\nTomen foto de la torre más alta que lograron.',
      deadline: '27 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
    {
      id: 103,
      title: 'Canción "Cabeza, hombros, rodillas, pies"',
      subject: 'Expresión Corporal y Motricidad',
      icon: '🎶',
      description:
        'Canten juntos "Cabeza, hombros, rodillas y pies" tocándose cada parte.\\nRepitan cada vez más rápido.\\nGraben un video cortito del niño/a cantando y señalando las partes.',
      deadline: '28 Mayo 2026',
      status: 'submitted',
      parentEvaluation: 'Lo logró solito 🎉',
      parentComment: 'Se sabe toda la canción, ¡hasta le enseñó a su hermana!',
      uploadedFile: 'video_cancion.mp4',
      teacherGrade: null,
      teacherFeedback: null,
    },
    {
      id: 104,
      title: 'Mi animal favorito',
      subject: 'Comprensión y Expresión del Lenguaje',
      icon: '🐶',
      description:
        'Pregunten al niño/a: ¿Cuál es tu animal favorito?\\nAyúdenle a dibujar ese animal con crayones.\\nPractiquen decir: "Mi animal favorito es el/la..."\\nPueden buscar fotos o videos del animal juntos.',
      deadline: '29 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
    {
      id: 105,
      title: 'Texturas en casa',
      subject: 'Descubrimiento del Medio Natural',
      icon: '🧸',
      description:
        'Busquen objetos con texturas diferentes: suave (peluche), duro (cuchara), rugoso (esponja), liso (espejo).\\nDejen que el niño/a toque cada uno con los ojos cerrados.\\nPregunten: ¿Es suave o duro? ¿Te gusta cómo se siente?',
      deadline: '30 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
    {
      id: 106,
      title: 'Garabatos libres',
      subject: 'Expresión Artística',
      icon: '✏️',
      description:
        'Denle al niño/a una hoja grande y crayones gruesos.\\nDejen que dibuje libremente sin guiarlo.\\nAl terminar pregunten: ¿Qué dibujaste? Cuéntame tu dibujo.\\nGuarden el dibujo y tomen una foto.',
      deadline: '31 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
  ],
  diego: [
    {
      id: 201,
      title: 'Mis datos personales',
      subject: 'Identidad y Autonomía',
      icon: '🪪',
      description:
        'Practiquen con el niño/a decir su nombre completo y su edad.\\nPueden hacer una "cédula" de juguete con su nombre, foto y edad.\\nPregunten: ¿Cómo te llamas? ¿Cuántos años tienes?',
      deadline: '26 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
    {
      id: 202,
      title: 'Sumas con frutas',
      subject: 'Relaciones Lógico-Matemáticas',
      icon: '🍎',
      description:
        'Con frutas reales o dibujos, practiquen sumas sencillas:\\n2 manzanas + 1 manzana = ¿cuántas hay?\\nRepitan con diferentes cantidades hasta 5.\\nDibujen los ejercicios en una hoja.',
      deadline: '28 Mayo 2026',
      status: 'pending',
      parentEvaluation: null,
      parentComment: '',
      uploadedFile: null,
      teacherGrade: null,
      teacherFeedback: null,
    },
  ],
};

const TEACHER_NOTES = {
  sofia: '👩‍🏫 Queridos papitos y mamitas, esta semana trabajaremos actividades para fortalecer la motricidad, el lenguaje y el reconocimiento del entorno de Sofía. Recuerden que a esta edad aprenden jugando. ¡Disfruten cada actividad en familia! 💕',
  mateo: '👩‍🏫 Queridos papitos, esta semana Mateo trabajará en reconocer colores, texturas y movimiento corporal. Las actividades son más sencillas y lúdicas para su edad. ¡Acompáñenlo con mucho cariño! 🧡',
  diego: '👩‍🏫 Hola familia Ramírez, Diego está listo para actividades de identidad y lógica-matemática. Aprovechen los momentos del día para reforzar. ¡Gracias por su apoyo! 💪',
};

const MOCK_GRADES = {
  1: { grade: 'Excelente', feedback: '¡Qué lindo autorretrato! Se nota que se observó con mucho cuidado. 🌟' },
  2: { grade: 'Muy Bien', feedback: '¡Genial! Los hábitos de higiene se aprenden con práctica. 👏' },
  3: { grade: 'Excelente', feedback: '¡Qué obra de arte! La pintura con dedos ayuda a la motricidad fina. ✨' },
  102: { grade: 'Muy Bien', feedback: '¡Muy bien la torre! Sigan contando objetos en casa. 👏' },
  103: { grade: 'Excelente', feedback: '¡Mateo canta muy bien! Se nota que practica con la familia. 🎵' },
  104: { grade: 'Bien', feedback: 'Lindo dibujo del perrito. Sigan practicando. 🐶' },
  201: { grade: 'Excelente', feedback: '¡Diego ya sabe sus datos! Sigan reforzando en casa. 🌟' },
  202: { grade: 'Muy Bien', feedback: 'Las sumas con frutas son muy prácticas. ¡Sigan así! 🍎' },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentName, setParentName] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [activitiesMap, setActivitiesMap] = useState({});
  const [toast, setToast] = useState(null);

  // Current child data
  const currentChild = useMemo(
    () => childrenList.find((c) => c.id === selectedChildId) || null,
    [childrenList, selectedChildId]
  );

  const childName = currentChild?.name || '';
  const activities = activitiesMap[selectedChildId] || [];
  const teacherNote = TEACHER_NOTES[selectedChildId] || '';

  const login = useCallback((cedula, password) => {
    const user = MOCK_USERS.find(
      (u) => u.cedula === cedula && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setParentName(user.parentName);
      setChildrenList(user.children);
      // Initialize activities for each child
      const initMap = {};
      user.children.forEach((child) => {
        initMap[child.id] = JSON.parse(
          JSON.stringify(ACTIVITIES_BY_CHILD[child.id] || [])
        );
      });
      setActivitiesMap(initMap);
      // Don't auto-select child, go to selector
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
    setActivitiesMap({});
  }, []);

  const submitActivity = useCallback((activityId, evaluation, comment, fileName) => {
    setActivitiesMap((prev) => {
      const childActivities = prev[selectedChildId] || [];
      const updated = childActivities.map((a) => {
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
      });
      return { ...prev, [selectedChildId]: updated };
    });

    // Simulate teacher grading after 3 seconds
    const currentChildIdSnapshot = selectedChildId;
    setTimeout(() => {
      setActivitiesMap((prev) => {
        const childActivities = prev[currentChildIdSnapshot] || [];
        const updated = childActivities.map((a) => {
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
        });
        return { ...prev, [currentChildIdSnapshot]: updated };
      });
    }, 3000);

    showToast('¡Tarea enviada con éxito! 🎉');
  }, [selectedChildId]);

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
    teacherNote,
    showToast,
    // Multi-tenant
    childrenList,
    currentChild,
    selectedChildId,
    selectChild,
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
