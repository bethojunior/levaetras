"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="admin-card">
      <h2>Não foi possível concluir.</h2>
      <p>Recarregue a página e tente novamente.</p>
      <button className="abtn" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
