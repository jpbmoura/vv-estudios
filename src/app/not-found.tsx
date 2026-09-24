import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[80svh] flex-col items-center justify-center pt-32 pb-24 text-center">
      <Eyebrow both>Erro 404</Eyebrow>
      <h1 className="mt-8 font-display text-display">A cortina ainda não abriu aqui.</h1>
      <p className="mt-8 max-w-md text-lg text-mute">A página que você procura não existe ou mudou de endereço.</p>
      <div className="mt-12">
        <Button href="/">Voltar ao início</Button>
      </div>
    </section>
  );
}
