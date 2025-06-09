import React from "react";

interface ButtonProps {
  // 定义按钮的属性
  text?: string;
}

const Button: React.FC<ButtonProps> = (props) => <button>App 2 Button{props.text}</button>;

export default Button;
