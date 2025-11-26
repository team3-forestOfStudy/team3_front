import "./textbutton.css";

export default function TextButton({ children, className }) {
  return <button className={className}>{children}</button>;
}
