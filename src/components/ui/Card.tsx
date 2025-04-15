export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow-md rounded p-4"> {children} </div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>;
}
