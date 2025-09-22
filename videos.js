const videosData = [
  {
    category: "Inspiración",
    title: '24 Minutos Muerta - Tessa Romero Cuenta su emotiva experiencia"',
    description: "Tessa Romero nos cuenta lo que vivió y sintió estando muerta y nos cuenta como no hay nada que temer en la muerte y que sin duda estamos todos conectados entre nosotros y a Dios",
    url: "https://youtu.be/ZEhz0rQIdpM",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: 'Uno de los co-descubridores del bosón de Higgs nos habla de que el mundo puede ser una simulación"',
    description: "Javier Santaolalla doctor en física de particulas nos explica como la realidad matematicamente puede ser una simulación o multiples simulaciones una dentro de otra",
    url: "https://youtu.be/RNUuphoKL8k",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: 'El Perdón hace que un Psicopata se derrumbe por primera vez"',
    description: "Este video muestra a uno de los mayores asesión de mujeres de EEUU derrumbandose emocionalmente por primera vez ante un padre que le perdona por matar a su hija. Mostrando como el perdón verdadero puede desmontar hasta a la persona más "psicopata"",
    url: "https://youtu.be/I5B6wloyURA?t=44",
    thumbnail: ""
  }
  {
    category: "Conocimiento",
    title: 'Uno de los co-descubridores del bosón de Higgs nos habla de que el mundo puede ser una simulación"',
    description: "Javier Santaolalla doctor en física de particulas nos explica como la realidad matematicamente puede ser una simulación o multiples simulaciones una dentro de otra",
    url: "https://youtu.be/PTIcIOrYGSM",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: 'Uno de los co-descubridores del bosón de Higgs nos habla de que no existe el TIEMPO"',
    description: "Javier Santaolalla doctor en física de particulas nos explica como el tiempo no existe y que es unicamente una percepción humana",
    url: "https://youtu.be/jFffcQBRKZY",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: 'Las carceles de Noruega - Las carceles compasivas con menor reincidencia del mundo"',
    description: "En este capitulo documental nos hablan de como en las carceles mas compasivas del mundo consiguen las mejores tasas de reinserción del planeta",
    url: "https://youtu.be/4ShqT6ZxfCI",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: 'Ilia Topuria (Campeón del Mundo): "Deposito mi Confianza en Dios"',
    description: "Ilia Topuria antes de ser campeón indiscutido y contra todo pronóstico de MMA; habla de que aplica uno de los principios fundamentales de UCDM. Depositar tu fe en Dios y que lo demás se dará.",
    url: "https://www.youtube.com/watch?v=QTqD7ThiDRQ",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: "Jim Carrey sobre decidir entre Amor o Miedo",
    description: "Discurso de Graduación en la Universidad Internacional Maharishi en la que Jim Carrey habla sobre decidir entre Amor y Miedo.",
    url: "https://youtu.be/VAPTjpRg7Gk?si=SidCWwbLelsMpW2h",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: "Entrevista a empresaria Marta Marcilla - La importancia de la mentalidad para el éxito.",
    description: "Entrevista a Mujer Multi-millonaria, Marta Marcilla habla sobre de su vida y de cómo se hizo millonaria cambiando de mentalidad y su autoconcepto.",
    url: "https://youtu.be/aiAEeI-QKNw?si=VmQRtctIje7H_MBW",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: "Masterclass 3ª Edición - De tu Mente a tu Realidad.",
    description: "Masterclass de Darío Arrigazzi donde te enseña el proceso desde que se programa la mente hasta que vives tu realidad actual.",
    url: "https://drive.google.com/file/d/1K8p68fQpHAEq6dDT_x411X1-teFN7GAp/view?usp=drive_link",
    thumbnail: "https://i.imgur.com/smFAtCV.png"
  },
  {
    category: "Película",
    title: "El Guerrero Pacífico",
    description: "Película de espiritualidad basada en hechos reales. Trata sobre deshacer el Ego y el desapego para conseguir todo lo que quieres.",
    url: "https://odysee.com/@Elleonestoico:0/El-Guerrero-Pacifico:9",
    thumbnail: ""
  },
  {
    category: "Inspiración",
    title: "Sabiduría de Will Smith",
    description: "Fragmentos de entrevistas de Will Smith donde comparte grandes consejos y sabiduría sobre la vida.",
    url: "https://www.youtube.com/watch?v=lx-qRBPljj0",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: "Entrevista a Enrique Jurado, maestro de Coaching y Programación Neurolingüística.",
    description: "El maestro de Darío Arrigazzi en PNL y Coaching, Enrique Jurado habla sobre experiencias personales y la importancia de cómo te hablas a ti mismo, entre otras cosas interesantes.",
    url: "https://youtu.be/9_GalJXUdpM?si=pVzUCy6qyDN8Gthb",
    thumbnail: ""
  },
  {
    category: "Audio",
    title: "Mini Podcast Sobre la Mente de Cristo vs Ego",
    description: "Conversación sobre los textos de Un Curso de Milagros.",
    url: "https://youtu.be/PiYZUTZeGuo",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: "Entrevista a Ramón Campayo (194 IQ)",
    description: "El memorizador más rápido de la historia y ostenta numerosos récords internacionales en memoria. Autor de varios best seller y creador del sistema 'Speed Memory', referente en entrenamiento y competición de alto rendimiento mental. Aborda cómo crear la realidad desde el pensamiento, el papel esencial del subconsciente en nuestras decisiones, y su convicción de que la muerte no es un final, sino una transición.",
    url: "https://youtu.be/AtbxzOHgmnY",
    thumbnail: ""
  },
  {
    category: "Película",
    title: "El Cambio - Wayne Dyer",
    description: "Película que explora el viaje espiritual de la segunda mitad de la vida, donde se busca un propósito y significado más allá de la ambición y el logro material, enfocándose en la contribución única y personal al mundo y la búsqueda de la divinidad en el presente.",
    url: "https://youtu.be/hgFfxq_Fm8Q",
    thumbnail: ""
  },
  {
    category: "Conocimiento",
    title: "Entrevista a Experta en visión Extra-Ocular",
    description: "Camila demuestra como entrenando la mente se puede ver sin usar lo ojos y lo demuestra en directo.",
    url: "https://youtu.be/suVhfCe7Ah4",
    thumbnail: ""
  }
];





