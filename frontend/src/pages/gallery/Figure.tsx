import React from "react";

export interface Formula {
  title: string;
  formula: string;
}

export interface FigureImage {
  path: string;
  alt: string;
}

export interface FigureProps {
  id: string;
  name: string;
  description: string;
  funFacts: string[];
  formulas: Formula[];
  figureImage: FigureImage;
  motivationalPhrase: string;
}

export const Figure: React.FC<FigureProps> = ({
  id,
  name,
  description,
  funFacts,
  formulas,
  figureImage,
  motivationalPhrase,
}) => {
  return (
    <section className="figura" id={id}>
      <h2>{name}</h2>

      <img
        src={figureImage.path}
        alt={figureImage.alt}
        className="imagen-figura"
      />

      <article>
        <p>{description}</p>
      </article>

      {funFacts.length !== 0 && (
        <article>
          <ul>
            {funFacts.map((fact) => (
              <li>{fact}</li>
            ))}
          </ul>
        </article>
      )}

      {formulas.length !== 0 && (
        <article className="formulas">
          <h3>Fórmulas</h3>
          {formulas.map((formula) => (
            <p>
              <strong>{formula.title}</strong>
              {` ${formula.formula}`}
            </p>
          ))}
        </article>
      )}

      <article className="frase-motivadora">{motivationalPhrase}</article>
    </section>
  );
};
