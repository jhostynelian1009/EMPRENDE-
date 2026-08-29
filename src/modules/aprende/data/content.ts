import { Lesson, LessonId } from '../domain/types';

export const LESSONS: Lesson[] = [
  {
    id: 'emprendimiento',
    order: 1,
    title: 'Emprendimiento',
    objective: 'Reconocer el emprendimiento como un proceso para convertir una idea en una solución útil.',
    explanation: 'El emprendimiento es el proceso de transformar una idea en una iniciativa que busca resolver una necesidad o aprovechar una oportunidad. Implica observar el entorno, proponer una solución y organizar recursos para ponerla en marcha.',
    example: 'Una estudiante identifica que en su comunidad es difícil conseguir postres personalizados y decide iniciar un pequeño negocio de repostería.',
    keyIdea: 'Emprender comienza al identificar una necesidad y plantear una solución.',
    reviewQuestion: '¿Qué necesidad concreta resolvería una idea de emprendimiento en tu comunidad?',
    expectedResponse: 'Respuesta abierta; debe mencionar una necesidad real y una posible solución.',
  },
  {
    id: 'idea-de-negocio',
    order: 2,
    title: 'Idea de negocio',
    objective: 'Definir una idea de negocio a partir de un problema, una solución y un público objetivo.',
    explanation: 'Una idea de negocio propone un producto o servicio para satisfacer una necesidad o resolver un problema. Para definirla se responde: ¿qué problema existe?, ¿qué solución ofreceré?, ¿a quién se dirige? y ¿qué recursos necesito?',
    example: 'Problema: estudiantes sin tiempo para preparar almuerzos. Solución: almuerzos económicos entregados en el instituto.',
    keyIdea: 'Una buena idea de negocio responde a una necesidad real y a un público específico.',
    reviewQuestion: '¿Cuáles son las tres preguntas mínimas que debe responder una idea de negocio?',
    expectedResponse: 'Qué problema resuelve, qué solución ofrece y para quién está dirigida.',
  },
  {
    id: 'innovacion',
    order: 3,
    title: 'Innovación',
    objective: 'Distinguir entre inventar algo nuevo y mejorar una solución existente.',
    explanation: 'Innovar consiste en crear algo nuevo o mejorar un producto, servicio o proceso existente para generar mayor valor. La mejora puede estar en el producto, la atención, la entrega, el precio o la forma de trabajar.',
    example: 'Una tienda tradicional empieza a recibir pedidos por WhatsApp y realiza entregas a domicilio.',
    keyIdea: 'Innovar también significa mejorar lo que ya existe para servir mejor al cliente.',
    reviewQuestion: '¿Por qué recibir pedidos por WhatsApp puede considerarse innovación?',
    expectedResponse: 'Porque mejora el proceso de compra y facilita el acceso del cliente.',
  },
  {
    id: 'mercado',
    order: 4,
    title: 'Mercado',
    objective: 'Identificar el mercado y describir al público objetivo de una propuesta.',
    explanation: 'El mercado está formado por las personas que pueden necesitar o comprar un producto o servicio. Para conocerlo se analiza quién es el cliente, qué necesita, qué prefiere y cuánto puede pagar.',
    example: 'Si se venden agendas universitarias, el público objetivo puede ser estudiantes de institutos y universidades.',
    keyIdea: 'Conocer al cliente permite diseñar una solución adecuada a sus necesidades.',
    reviewQuestion: '¿Qué diferencia existe entre decir “todas las personas” y definir un público objetivo?',
    expectedResponse: 'El público objetivo describe un grupo concreto con necesidades y características compartidas.',
  },
  {
    id: 'modelo-de-negocio',
    order: 5,
    title: 'Modelo de negocio',
    objective: 'Comprender cómo un emprendimiento crea, entrega y obtiene valor.',
    explanation: 'El modelo de negocio explica qué se ofrece, quiénes son los clientes, cómo se entrega el producto o servicio y de qué forma se generan ingresos.',
    example: 'Un emprendimiento vende accesorios personalizados mediante redes sociales y obtiene ingresos por cada producto vendido.',
    keyIdea: 'El modelo de negocio explica cómo funcionará el emprendimiento.',
    reviewQuestion: '¿Qué cuatro elementos básicos debe explicar un modelo de negocio?',
    expectedResponse: 'Oferta, clientes, forma de entrega y forma de generar ingresos.',
  },
  {
    id: 'marketing-digital',
    order: 6,
    title: 'Marketing digital',
    objective: 'Reconocer herramientas digitales para comunicar y promocionar un emprendimiento.',
    explanation: 'El marketing digital usa medios digitales para promocionar productos o servicios y comunicarse con clientes. Incluye redes sociales, publicaciones, videos, catálogos digitales y mensajería instantánea.',
    example: 'Una emprendedora publica fotografías de sus productos en Instagram, Facebook y WhatsApp para atraer compradores.',
    keyIdea: 'El marketing digital ayuda a dar a conocer el emprendimiento y llegar a más clientes.',
    reviewQuestion: 'Menciona dos herramientas digitales útiles para promocionar un negocio pequeño.',
    expectedResponse: 'Por ejemplo: redes sociales, videos, catálogos digitales o mensajería instantánea.',
  },
  {
    id: 'costos-y-precios',
    order: 7,
    title: 'Costos y precios',
    objective: 'Diferenciar costos fijos y variables y relacionarlos con el precio de venta.',
    explanation: 'Los costos son valores necesarios para producir o vender. Los costos fijos se mantienen aunque cambie la producción; los variables aumentan o disminuyen según la cantidad producida. El precio debe cubrir los costos y considerar el margen deseado.',
    example: 'Si producir un artículo cuesta 5 dólares, el precio de venta debe ser superior a ese costo para que exista ganancia.',
    keyIdea: 'Conocer los costos permite fijar un precio razonable y estimar la ganancia.',
    reviewQuestion: '¿Qué ocurriría si el precio de venta fuera menor que el costo total por unidad?',
    expectedResponse: 'El negocio tendría una pérdida por cada unidad vendida.',
  },
];

// Helper functions (pure functions)

export const isValidLessonId = (id: string): id is LessonId => {
  return LESSONS.some((lesson) => lesson.id === id);
};

export const getLessonById = (id: string): Lesson | undefined => {
  return LESSONS.find((lesson) => lesson.id === id);
};

export const getLessonIndex = (id: string): number => {
  return LESSONS.findIndex((lesson) => lesson.id === id);
};

export const getNextLesson = (currentId: string): Lesson | undefined => {
  const currentIndex = getLessonIndex(currentId);
  if (currentIndex === -1 || currentIndex === LESSONS.length - 1) {
    return undefined;
  }
  return LESSONS[currentIndex + 1];
};

export const getPreviousLesson = (currentId: string): Lesson | undefined => {
  const currentIndex = getLessonIndex(currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return LESSONS[currentIndex - 1];
};
