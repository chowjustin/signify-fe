import ButtonLink from "@/components/links/ButtonLink";

export default function SandboxPage() {
  return (
    <section className="flex flex-col items-center py-12">
      <h1 className="text-5xl font-bold">Sanbox Page</h1>
      <div className="flex gap-5 mt-12">
        <ButtonLink href="/sandbox/button">Button</ButtonLink>
        <ButtonLink href="/sandbox/form">Form</ButtonLink>
      </div>
    </section>
  );
}
