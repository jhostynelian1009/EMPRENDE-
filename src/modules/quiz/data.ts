import { Question } from './types';

export const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    statement: '¿Qué es una idea de negocio?',
    options: [
      { id: 'q1-a', text: 'Una propuesta para solucionar una necesidad o problema mediante un producto o servicio.' },
      { id: 'q1-b', text: 'Una actividad sin ningún propósito.' },
      { id: 'q1-c', text: 'Una lista de gastos personales.' },
      { id: 'q1-d', text: 'Una forma de entretenimiento.' },
    ],
    correctOptionId: 'q1-a',
    feedback: 'Una idea de negocio busca atender una necesidad o problema mediante una propuesta de valor.',
  },
  {
    id: 'q2',
    statement: '¿Qué busca identificar el análisis de mercado?',
    options: [
      { id: 'q2-a', text: 'Las necesidades y características de los posibles clientes.' },
      { id: 'q2-b', text: 'Únicamente los gastos del emprendedor.' },
      { id: 'q2-c', text: 'Solo el nombre de la empresa.' },
      { id: 'q2-d', text: 'La decoración del negocio.' },
    ],
    correctOptionId: 'q2-a',
    feedback: 'El análisis de mercado permite conocer a los posibles clientes y sus necesidades.',
  },
  {
    id: 'q3',
    statement: '¿Qué se entiende por innovación?',
    options: [
      { id: 'q3-a', text: 'La incorporación de mejoras o nuevas soluciones.' },
      { id: 'q3-b', text: 'Repetir siempre el mismo proceso sin cambios.' },
      { id: 'q3-c', text: 'Eliminar toda planificación.' },
      { id: 'q3-d', text: 'Evitar conocer al cliente.' },
    ],
    correctOptionId: 'q3-a',
    feedback: 'La innovación implica introducir mejoras, cambios o nuevas soluciones que aporten valor.',
  },
  {
    id: 'q4',
    statement: '¿Qué es un modelo de negocio?',
    options: [
      { id: 'q4-a', text: 'Una forma de explicar cómo funciona y genera valor un negocio.' },
      { id: 'q4-b', text: 'Una lista de nombres de empleados.' },
      { id: 'q4-c', text: 'Un registro de asistencia.' },
      { id: 'q4-d', text: 'Un diseño de logotipo.' },
    ],
    correctOptionId: 'q4-a',
    feedback: 'El modelo de negocio permite comprender cómo funciona el negocio y cómo genera valor.',
  },
  {
    id: 'q5',
    statement: '¿Para qué sirve el marketing digital?',
    options: [
      { id: 'q5-a', text: 'Para promocionar productos o servicios mediante medios digitales.' },
      { id: 'q5-b', text: 'Para calcular únicamente los costos.' },
      { id: 'q5-c', text: 'Para registrar asistencia.' },
      { id: 'q5-d', text: 'Para reemplazar todos los productos.' },
    ],
    correctOptionId: 'q5-a',
    feedback: 'El marketing digital utiliza canales y medios digitales para comunicar y promocionar productos o servicios.',
  },
  {
    id: 'q6',
    statement: '¿Qué representan los costos en un negocio?',
    options: [
      { id: 'q6-a', text: 'Los recursos o gastos necesarios para producir u ofrecer un producto o servicio.' },
      { id: 'q6-b', text: 'Únicamente las ganancias.' },
      { id: 'q6-c', text: 'Solo el nombre del negocio.' },
      { id: 'q6-d', text: 'Las opiniones de los clientes.' },
    ],
    correctOptionId: 'q6-a',
    feedback: 'Los costos corresponden a los recursos y gastos necesarios para desarrollar la actividad del negocio.',
  },
  {
    id: 'q7',
    statement: '¿Qué permite establecer un precio adecuado?',
    options: [
      { id: 'q7-a', text: 'Considerar los costos y el margen deseado.' },
      { id: 'q7-b', text: 'Ignorar los costos.' },
      { id: 'q7-c', text: 'Elegir cualquier valor sin analizarlo.' },
      { id: 'q7-d', text: 'Eliminar la cantidad de productos.' },
    ],
    correctOptionId: 'q7-a',
    feedback: 'El precio debe considerar el costo del producto o servicio y el margen que se desea obtener.',
  },
  {
    id: 'q8',
    statement: '¿Quién forma parte del público objetivo?',
    options: [
      { id: 'q8-a', text: 'Las personas a quienes se dirige principalmente el producto o servicio.' },
      { id: 'q8-b', text: 'Cualquier persona sin relación con el negocio.' },
      { id: 'q8-c', text: 'Solo los proveedores.' },
      { id: 'q8-d', text: 'Solo los competidores.' },
    ],
    correctOptionId: 'q8-a',
    feedback: 'El público objetivo está formado por los clientes a quienes se dirige principalmente la propuesta.',
  },
  {
    id: 'q9',
    statement: '¿Por qué es importante identificar un problema antes de plantear una solución?',
    options: [
      { id: 'q9-a', text: 'Porque permite orientar la propuesta hacia una necesidad real.' },
      { id: 'q9-b', text: 'Porque elimina la necesidad de conocer al cliente.' },
      { id: 'q9-c', text: 'Porque evita analizar el mercado.' },
      { id: 'q9-d', text: 'Porque garantiza ganancias inmediatas.' },
    ],
    correctOptionId: 'q9-a',
    feedback: 'Identificar el problema permite desarrollar una solución relacionada con una necesidad real.',
  },
  {
    id: 'q10',
    statement: '¿Qué debe buscar una propuesta de emprendimiento?',
    options: [
      { id: 'q10-a', text: 'Aportar una solución o valor frente a una necesidad o problema.' },
      { id: 'q10-b', text: 'Evitar conocer las necesidades de los usuarios.' },
      { id: 'q10-c', text: 'Generar gastos sin planificación.' },
      { id: 'q10-d', text: 'Copiar cualquier negocio sin cambios.' },
    ],
    correctOptionId: 'q10-a',
    feedback: 'Una propuesta de emprendimiento debe aportar valor y responder a una necesidad o problema.',
  },
];
