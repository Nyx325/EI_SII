import { FigureProps } from "../pages/gallery/Figure";

export type Figure = {
  name: string;
  color: string;
  questions: string[];
};
//  triángulo, cuadrado, rombo, pentágono y corazón
export const figures: Figure[] = [
  {
    name: "Corazón",
    color: "ff0b0b",
    questions: [
      "¿Qué figura representa el amor y combina curvas y simetría perfecta?",
      '¿Qué figura se forma usando dos curvas semicirculares y tiene un "piquito" en el centro?',
    ],
  },
  {
    name: "Cuadrado",
    color: "a233ff",
    questions: [
      "¿Cuál es la figura que tiene cuatro lados iguales y todos sus ángulos son de 90 grados?",
    ],
  },
  {
    name: "Pentágono",
    color: "ff850b",
    questions: [
      "¿En qué figura todos sus lados y ángulos son iguales y tiene cinco lados?",
      "Si ves una figura con cinco lados iguales, ¿Qué figura estás viendo?",
    ],
  },
  {
    name: "Rombo",
    color: "ff0bc4",
    questions: [
      "¿Cuál es el nombre de la figura que parece un cuadrado inclinado y tiene las diagonales que se cruzan en ángulo recto?",
      "¿Cuál tiene dos ejes de simetría y sus diagonales también se cruzan justo en el centro?",
      "¿En qué figura las diagonales no solo se cruzan en el centro, sino que además son perpendiculares?",
    ],
  },
  {
    name: "Triángulo",
    color: "ff5733",
    questions: [
      "¿De qué figura estamos hablando al decir que sus ángulos siempre suman 180 grados?",
      "¿Cuál es la figura que se usa mucho en arquitectura porque es súper estable?",
    ],
  },
];

export const figuresInfo: FigureProps[] = [
  {
    id: "cuadrado",
    name: "Cuadrado",
    description:
      "El cuadrado es una figura plana de cuatro lados iguales y cuatro ángulos rectos de 90°. Es un caso particular del rectángulo y del rombo. Puede inscribirse en un círculo de radio igual a la mitad de su diagonal y es la base de muchos sistemas de coordenadas en geometría analítica.",
    funFacts: [
      "Todos sus lados son congruentes.",
      "Tiene dos ejes de simetría vertical y horizontal, además de dos diagonales.",
      "Las diagonales se bisecan y son perpendiculares.",
      "La longitud de cada diagonal es lado × √2.",
      "Es uno de los tres polígonos regulares que tesela el plano (junto al triángulo y al hexágono).",
      "En arquitectura y arte, simboliza estabilidad y perfección.",
    ],
    formulas: [
      { title: "Área:", formula: "lado × lado = lado²" },
      { title: "Perímetro:", formula: "4 × lado" },
      {
        title: "Diagonal:",
        formula: "lado × √2",
      },
      {
        title: "Inradio:",
        formula: "lado / 2",
      },
      {
        title: "Circunradio:",
        formula: "lado / √2",
      },
    ],
    figureImage: {
      path: "/figuras/cuadrado.png",
      alt: "Imagen de un cuadrado",
    },
    motivationalPhrase: "¡Conquista la perfección de la simetría!",
  },
  {
    id: "triangulo",
    name: "Triángulo",
    description:
      "El triángulo es un polígono de tres lados y tres vértices. Es la figura más estable en arquitectura y diseño debido a su rigidez estructural. Existen tipologías según sus ángulos (acutángulo, rectángulo u obtusángulo) y su estudio dio origen al Teorema de Pitágoras.",
    funFacts: [
      "La suma de sus ángulos interiores siempre es 180°.",
      "Puede clasificarse como equilátero, isósceles o escaleno.",
      "Se utiliza en construcciones para asegurar resistencia.",
      "No tiene diagonales internas (nivel más simple de polígono).",
      "Las tres medianas se encuentran en el centroid, que divide cada mediana en proporción 2:1.",
      "La suma de los ángulos exteriores totales es siempre 360°.",
    ],
    formulas: [
      {
        title: "Área (base × altura):",
        formula: "(base × altura) ÷ 2",
      },
      {
        title: "Perímetro:",
        formula: "3 × lado",
      },
      {
        title: "Herón (s = (a+b+c)/2):",
        formula: "√[s(s-a)(s-b)(s-c)]",
      },
      {
        title: "Circunradio:",
        formula: "a / (2·sin(A))",
      },
      {
        title: "Inradio:",
        formula: "Área / s",
      },
    ],
    figureImage: {
      path: "/figuras/triangulo.png",
      alt: "Imagen de un triángulo",
    },
    motivationalPhrase: "¡Cada lado cuenta para construir grandes sueños!",
  },
  {
    id: "pentagono",
    name: "Pentágono",
    description:
      "El pentágono es un polígono de cinco lados. Si es regular, todos sus lados y ángulos (108°) son iguales. Sus diagonales forman la proporción áurea y aparece en la naturaleza, arte y arquitectura, como en el edificio del Pentágono en EE.UU.",
    funFacts: [
      "Cada ángulo interno mide 108° en un pentágono regular.",
      "Presenta cinco ejes de simetría.",
      "El famoso edificio del Pentágono en EE.UU. tiene esta forma.",
      "La razón diagonal/lado equivale al número áureo φ ≈ 1.618.",
      "Sus diagonales forman un pentagrama, símbolo de proporción perfecta.",
      "Se encuentra en estructuras florales y patrones estelares en la naturaleza.",
    ],
    formulas: [
      {
        title: "Área:",
        formula: "(5/4)·lado²·cot(π/5)",
      },
      { title: "Perímetro:", formula: "5 × lado" },
      {
        title: "Apotema:",
        formula: "lado / (2·tan(π/5))",
      },
      {
        title: "Circunradio:",
        formula: "lado / (2·sin(π/5))",
      },
      {
        title: "Diagonal:",
        formula: "φ × lado",
      },
    ],
    figureImage: {
      path: "/figuras/pentagono.png",
      alt: "Imagen de un pentágono",
    },
    motivationalPhrase: "¡Cinco caminos hacia la grandeza!",
  },
  {
    id: "rombo",
    name: "Rombo",
    description:
      "El rombo es un cuadrilátero cuyos cuatro lados tienen la misma longitud, pero sus ángulos no son necesariamente rectos. Es un caso especial de paralelogramo y sus diagonales se cruzan perpendicularmente y dividen el área en cuatro triángulos de igual área.",
    funFacts: [
      "Sus diagonales son perpendiculares y se bisecan mutuamente.",
      "Tiene dos pares de ángulos opuestos iguales.",
      "Puede verse en cristales, cometas y patrones de arte.",
      "Las diagonales miden: p = a·√(2+2·cos(α)), q = a·√(2−2·cos(α)).",
      "Es un paralelogramo, por lo que sus lados opuestos son paralelos.",
      "Se utiliza en mosaicos y revestimientos decorativos.",
    ],
    formulas: [
      {
        title: "Área (lado²·sin α):",
        formula: "a²·sin(α)",
      },
      {
        title: "Área (diag. × diag. ÷ 2):",
        formula: "(p × q) ÷ 2",
      },
      {
        title: "Diag. mayores y menores:",
        formula: "p = a·√(2+2 cos α), q = a·√(2−2 cos α)",
      },
      {
        title: "Inradio:",
        formula: "(p·q)/(2·√(p²+q²)) = (a·sin α)/2",
      },
      { title: "Perímetro:", formula: "4 × lado" },
    ],
    figureImage: {
      path: "/figuras/romb.png",
      alt: "Imagen de un rombo",
    },
    motivationalPhrase: "¡La belleza también se encuentra en el equilibrio!",
  },
  {
    id: "corazon",
    name: "Corazón",
    description:
      "El corazón es una forma simbólica muy popular. Aunque no es una figura geométrica clásica, combina curvas y simetría. Representa amor y conexión humana. Puede aproximarse mediante ecuaciones paramétricas en matemáticas avanzadas y aparece en el símbolo de naipes y arte religioso.",
    funFacts: [
      "Simetría axial vertical perfecta.",
      "Se forma a partir de curvas semicirculares y puntos cóncavos.",
      "Se utiliza en arte, logos, diseño gráfico y matemáticas recreativas.",
      "El símbolo Unicode de corazón es U+2665.",
      "Su popularización como símbolo de amor data de la Edad Media.",
      "Se emplea en patrones textiles y joyería.",
    ],
    formulas: [
      {
        title: "Cardioide (polar):",
        formula: "r = 1 − sin θ",
      },
      {
        title: "Ecuación algebraica:",
        formula: "(x²+y²−1)³ − x²·y³ = 0",
      },
      {
        title: "Paramétrica:",
        formula: "x = 16 sin³t; y = 13 cos t − 5 cos(2t) − 2 cos(3t) − cos(4t)",
      },
    ],
    figureImage: {
      path: "/figuras/corazon.png",
      alt: "Imagen de un corazón",
    },
    motivationalPhrase: "¡La forma más poderosa es la que conecta corazones!",
  },
];
