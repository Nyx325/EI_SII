import React from "react";

export enum AlertType {
  SUCCESS = "success",
  DANGER = "error",
  WARNING = "warning",
  INFO = "info",
}

interface AlertProps {
  message: string;
  type: AlertType; // Tipos de alerta
}

const Alert: React.FC<AlertProps> = ({ message, type = AlertType.WARNING }) => {
  const colors = {
    [AlertType.SUCCESS]: "green",
    [AlertType.DANGER]: "red",
    [AlertType.WARNING]: "orange",
    [AlertType.INFO]: "blue",
  };

  return (
    <div
      className="alert"
      style={{
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: colors[type],
        color: "white",
        fontWeight: "bold",
        marginBottom: "10px",
      }}
    >
      {message}
    </div>
  );
};

export default Alert;
